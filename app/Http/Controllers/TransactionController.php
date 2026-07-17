<?php

namespace App\Http\Controllers;

use App\Mail\TransactionReceiptMail;
use App\Models\FlashDealItem;
use App\Models\PaymentMethod;
use App\Models\Product;
use App\Models\Transaction;
use App\Services\TripaySimulationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function __construct(protected TripaySimulationService $tripay)
    {
    }

    /**
     * Proses "Bayar Sekarang" dari halaman detail game.
     * Login OPSIONAL: guest tetap bisa checkout (kecuali memilih metode Wallet, yang wajib login).
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'payment_method_id' => ['required', 'exists:payment_methods,id'],
            'user_game_id' => ['required', 'string', 'max:100'],
            'user_server_id' => ['nullable', 'string', 'max:100'],
            'whatsapp_number' => ['required', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'promo_code' => ['nullable', 'string', 'max:50'],
        ]);

        $product = Product::with('game')->findOrFail($validated['product_id']);
        $method = PaymentMethod::findOrFail($validated['payment_method_id']);
        $user = $request->user();

        abort_if($product->game->needs_server_id && empty($validated['user_server_id']), 422, 'Server ID wajib diisi untuk game ini.');
        abort_if($method->requires_login && !$user, 403, 'Silakan login terlebih dahulu untuk membayar dengan ' . $method->name . '.');

        // Cek apakah nominal ini sedang ikut Flash Deal aktif — kalau ya, PAKAI harga flash deal
        // (bukan harga normal), supaya harga yang dibayar sama dengan yang dipromosikan.
        $flashItem = FlashDealItem::where('product_id', $product->id)
            ->whereHas('flashDeal', function ($q) {
                $q->where('is_active', true)->where('ends_at', '>', now());
            })
            ->first();

        $hasFlashStock = $flashItem && ($flashItem->stock === null || $flashItem->stock > 0);
        $effectivePrice = $hasFlashStock ? $flashItem->flash_price : $product->price;

        $adminFee = $method->calculateFee($effectivePrice);
        $discount = 0; // TODO: validasi promo_code jika ada tabel promo
        $isWallet = $method->code === 'WALLET';
        $totalAmount = $effectivePrice + $adminFee - $discount;

        if ($isWallet && !$user->withdrawWallet($totalAmount)) {
            return back()->withErrors(['payment_method_id' => 'Saldo BagusCoins Wallet kamu tidak cukup. Silakan isi saldo terlebih dahulu.']);
        }

        $transaction = DB::transaction(function () use ($validated, $product, $method, $adminFee, $discount, $totalAmount, $effectivePrice, $user, $isWallet, $flashItem, $hasFlashStock) {
            // Stok Flash Deal dipotong begitu order dibuat (bukan menunggu pembayaran selesai)
            if ($hasFlashStock && $flashItem->stock !== null) {
                $flashItem->decrement('stock');
            }

            return Transaction::create([
                'user_id' => $user?->id,
                'invoice_number' => 'BC-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6)),
                'merchant_ref' => 'MRF' . now()->format('YmdHis') . random_int(100, 999),
                'game_id' => $product->game_id,
                'product_id' => $product->id,
                'payment_method_id' => $method->id,
                'user_game_id' => $validated['user_game_id'],
                'user_server_id' => $validated['user_server_id'] ?? null,
                'whatsapp_number' => $validated['whatsapp_number'],
                'email' => $validated['email'] ?? null,
                'product_name' => $product->name,
                'base_amount' => $product->base_amount,
                'bonus_amount' => $product->bonus_amount,
                'price' => $effectivePrice,
                'admin_fee' => $adminFee,
                'total_amount' => $totalAmount,
                'promo_code' => $validated['promo_code'] ?? null,
                'discount_amount' => $discount,
                'status' => $isWallet ? 'success' : 'pending',
                'paid_at' => $isWallet ? now() : null,
                'expired_at' => now()->addHour(),
            ]);
        });

        // Pembayaran Wallet: saldo sudah dipotong di atas, tidak perlu simulasi Tripay.
        if (!$isWallet) {
            $tripayResponse = $this->tripay->createTransaction($transaction, $method);

            $transaction->update([
                'tripay_reference' => $tripayResponse['reference'],
                'qr_url' => $tripayResponse['qr_url'],
                'pay_code' => $tripayResponse['pay_code'],
            ]);
        } else {
            $this->sendReceiptEmail($transaction);
        }

        return redirect()->route('transactions.show', $transaction->invoice_number);
    }

    /**
     * Halaman status/pembayaran transaksi (bisa diakses via invoice_number, tanpa login).
     */
    public function show(string $invoice): Response
    {
        $transaction = Transaction::with(['game', 'product', 'paymentMethod'])
            ->where('invoice_number', $invoice)
            ->firstOrFail();

        return Inertia::render('Transactions/Show', [
            'transaction' => $transaction,
        ]);
    }

    /**
     * Tombol simulasi (HANYA aktif selama belum pakai Tripay asli):
     * menandai transaksi sebagai berhasil dibayar, seolah callback Tripay masuk.
     */
    public function simulatePay(string $invoice): RedirectResponse
    {
        $transaction = Transaction::where('invoice_number', $invoice)->firstOrFail();

        if (!$transaction->isFinal()) {
            $transaction->update([
                'status' => 'success',
                'paid_at' => now(),
                'callback_payload' => [
                    'simulated' => true,
                    'reference' => $transaction->tripay_reference,
                    'status' => 'PAID',
                    'paid_at' => now()->toIso8601String(),
                ],
            ]);

            $this->sendReceiptEmail($transaction);
        }

        return back();
    }

    /**
     * Cek transaksi cukup pakai nomor invoice saja (untuk lacak status pesanan).
     */
    public function lookup(Request $request): Response|RedirectResponse
    {
        if ($request->filled('invoice_number')) {
            $transaction = Transaction::where('invoice_number', $request->invoice_number)->first();

            if ($transaction) {
                return redirect()->route('transactions.show', $transaction->invoice_number);
            }

            return Inertia::render('Transactions/Lookup', ['notFound' => true]);
        }

        return Inertia::render('Transactions/Lookup', ['notFound' => false]);
    }

    /**
     * Kirim email struk kalau pembeli mengisi email (opsional).
     * Dibungkus try/catch supaya kalau konfigurasi SMTP belum diisi/salah,
     * checkout tetap sukses (nggak ikut gagal cuma gara-gara email nggak terkirim).
     */
    protected function sendReceiptEmail(Transaction $transaction): void
    {
        if (!$transaction->email) {
            return;
        }

        try {
            $transaction->load(['game', 'product', 'paymentMethod']);
            Mail::to($transaction->email)->send(new TransactionReceiptMail($transaction));
        } catch (\Throwable $e) {
            Log::warning('Gagal mengirim email struk transaksi: ' . $e->getMessage(), [
                'invoice_number' => $transaction->invoice_number,
            ]);
        }
    }

    /**
     * Endpoint callback Tripay ASLI (belum aktif dalam mode simulasi).
     * Sudah disiapkan strukturnya agar tinggal dipakai saat go-live.
     */
    public function callback(Request $request)
    {
        // TODO saat integrasi asli:
        // 1. Verifikasi signature header X-Callback-Signature dengan private key Tripay
        // 2. Cari Transaction via merchant_ref dari payload
        // 3. Update status sesuai payload['status'] (PAID/EXPIRED/FAILED)
        abort(404, 'Callback Tripay asli belum diaktifkan (mode simulasi).');
    }
}
