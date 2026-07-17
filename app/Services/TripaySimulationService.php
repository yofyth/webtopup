<?php

namespace App\Services;

use App\Models\PaymentMethod;
use App\Models\Transaction;
use Illuminate\Support\Str;

/**
 * TripaySimulationService
 *
 * Service ini MENIRU struktur response API Tripay (https://tripay.co.id/developer)
 * tetapi seluruhnya berjalan secara lokal/simulasi — tidak ada request keluar ke Tripay.
 *
 * Tujuan: agar saat nanti Yof siap pakai Tripay asli, tinggal:
 *  1. Buat TripayService baru yang benar-benar hit endpoint Tripay
 *     (POST https://tripay.co.id/api-sandbox/transaction/create, dst)
 *  2. Ganti binding di TransactionController dari TripaySimulationService -> TripayService
 * Struktur data (reference, qr_url, pay_code, status) sudah dibuat semirip mungkin
 * dengan response asli Tripay supaya migrasinya minim perubahan.
 */
class TripaySimulationService
{
    /**
     * Simulasikan pembuatan transaksi ke Tripay.
     * Response asli Tripay: reference, checkout_url, qr_url / pay_code, expired_time, dst.
     */
    public function createTransaction(Transaction $transaction, PaymentMethod $method): array
    {
        $reference = 'T' . strtoupper(Str::random(3)) . now()->format('YmdHis');

        $isQris = $method->group === 'qris';
        $isVA = $method->group === 'virtual_account';

        $payload = [
            'success' => true,
            'reference' => $reference,
            'merchant_ref' => $transaction->merchant_ref,
            'payment_method' => $method->code,
            'payment_name' => $method->name,
            'amount' => $transaction->total_amount,
            'status' => 'UNPAID', // status awal ala Tripay
            'expired_time' => now()->addHours(1)->timestamp,
            // Simulasi kode bayar / QR — bukan QR/VA sungguhan
            'qr_url' => $isQris ? $this->fakeQrUrl($reference) : null,
            'pay_code' => (!$isQris) ? $this->fakePayCode($method, $isVA) : null,
            'instructions' => $this->fakeInstructions($method),
        ];

        return $payload;
    }

    /**
     * Simulasikan pengecekan status transaksi ke Tripay.
     * Di dunia nyata: GET /transaction/detail?reference=xxxx
     *
     * Untuk simulasi, kita anggap transaksi otomatis "PAID" setelah
     * dipanggil endpoint simulate-pay di TransactionController (tombol
     * "Simulasikan Pembayaran Berhasil" yang hanya tampil di mode simulasi).
     */
    public function checkStatus(Transaction $transaction): string
    {
        return strtoupper($transaction->status === 'success' ? 'PAID' : $transaction->status);
    }

    protected function fakeQrUrl(string $reference): string
    {
        // Placeholder QR (menggunakan generator QR publik hanya untuk simulasi visual)
        return 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' . urlencode('SIMULASI-QRIS-' . $reference);
    }

    protected function fakePayCode(PaymentMethod $method, bool $isVA): string
    {
        if ($isVA) {
            // Contoh format VA: kode bank + 10 digit acak
            return $method->code . str_pad((string) random_int(0, 9999999999), 10, '0', STR_PAD_LEFT);
        }

        // Kode bayar untuk e-wallet/convenience store, mis. Alfamart
        return strtoupper(Str::random(8));
    }

    protected function fakeInstructions(PaymentMethod $method): array
    {
        return [
            "Ini adalah SIMULASI pembayaran ({$method->name}), tidak ada transaksi uang sungguhan.",
            'Pada mode produksi nanti, instruksi ini akan digantikan instruksi resmi dari Tripay.',
        ];
    }
}
