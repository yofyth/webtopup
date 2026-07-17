<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Models\PaymentMethod;
use App\Models\WalletTopup;
use App\Services\TripaySimulationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class WalletController extends Controller
{
    public function __construct(protected TripaySimulationService $tripay)
    {
    }

    /**
     * Halaman form isi saldo.
     */
    public function create(Request $request): Response
    {
        // Wallet tidak bisa dipakai untuk mengisi Wallet itu sendiri.
        $paymentMethods = PaymentMethod::where('is_active', true)
            ->where('code', '!=', 'WALLET')
            ->orderBy('sort_order')
            ->get()
            ->groupBy('group');

        return Inertia::render('Account/WalletTopup', [
            'paymentMethods' => $paymentMethods,
            'walletBalance' => $request->user()->wallet_balance,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'integer', 'min:10000', 'max:10000000'],
            'payment_method_id' => ['required', 'exists:payment_methods,id'],
        ]);

        $method = PaymentMethod::findOrFail($validated['payment_method_id']);
        abort_if($method->code === 'WALLET', 422, 'Tidak bisa isi saldo menggunakan Wallet itu sendiri.');

        $adminFee = $method->calculateFee($validated['amount']);

        $topup = WalletTopup::create([
            'user_id' => $request->user()->id,
            'payment_method_id' => $method->id,
            'invoice_number' => 'WTP-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6)),
            'merchant_ref' => 'WMRF' . now()->format('YmdHis') . random_int(100, 999),
            'amount' => $validated['amount'],
            'admin_fee' => $adminFee,
            'total_amount' => $validated['amount'] + $adminFee,
            'status' => 'pending',
            'expired_at' => now()->addHour(),
        ]);

        // Manfaatkan service simulasi yang sama dengan checkout game (struktur mirip Tripay asli)
        $tripayResponse = $this->tripay->createTransaction($topup, $method);

        $topup->update([
            'tripay_reference' => $tripayResponse['reference'],
            'qr_url' => $tripayResponse['qr_url'],
            'pay_code' => $tripayResponse['pay_code'],
        ]);

        return redirect()->route('account.wallet.show', $topup->invoice_number);
    }

    public function show(string $invoice, Request $request): Response
    {
        $topup = WalletTopup::where('invoice_number', $invoice)
            ->where('user_id', $request->user()->id)
            ->with('paymentMethod')
            ->firstOrFail();

        return Inertia::render('Account/WalletTopupShow', ['topup' => $topup]);
    }

    /**
     * Simulasi callback Tripay: tandai berhasil & tambah saldo wallet user.
     */
    public function simulatePay(string $invoice, Request $request): RedirectResponse
    {
        $topup = WalletTopup::where('invoice_number', $invoice)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if (!$topup->isFinal()) {
            $topup->update([
                'status' => 'success',
                'paid_at' => now(),
                'callback_payload' => [
                    'simulated' => true,
                    'reference' => $topup->tripay_reference,
                    'status' => 'PAID',
                    'paid_at' => now()->toIso8601String(),
                ],
            ]);

            $request->user()->depositWallet($topup->amount);
        }

        return back();
    }
}
