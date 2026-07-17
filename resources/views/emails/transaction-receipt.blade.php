@php
    $siteName = \App\Models\Setting::get('site_name', 'BagusCoins');
    $siteLogo = \App\Models\Setting::get('site_logo');
    $formatRupiah = fn ($v) => 'Rp ' . number_format((float) $v, 0, ',', '.');

    // Logo di-embed langsung sebagai base64 (bukan link URL) supaya tetap tampil
    // di email walau situsnya masih di localhost (URL localhost tidak bisa diakses
    // dari luar/oleh Mailtrap/klien email penerima).
    $logoDataUri = null;
    if ($siteLogo && \Illuminate\Support\Facades\Storage::disk('public')->exists($siteLogo)) {
        $logoPath = \Illuminate\Support\Facades\Storage::disk('public')->path($siteLogo);
        $mime = \Illuminate\Support\Facades\Storage::disk('public')->mimeType($siteLogo) ?? 'image/png';
        $logoDataUri = 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($logoPath));
    }
@endphp
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Struk Pembayaran</title>
</head>
<body style="margin:0; padding:0; background:#f7f6fc; font-family: Arial, Helvetica, sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f6fc; padding:32px 16px;">
<tr>
<td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #ece9f7;">

    <tr>
        <td style="background:linear-gradient(120deg,#4c1d95,#7c3aed); background-color:#5b21b6; padding:28px 32px; text-align:center;">
            @if($logoDataUri)
                <img src="{{ $logoDataUri }}" alt="{{ $siteName }}" width="44" height="44" style="border-radius:10px; display:block; margin:0 auto 10px;">
            @endif
            <span style="color:#ffffff; font-size:18px; font-weight:bold;">{{ strtoupper($siteName) }}</span>
        </td>
    </tr>

    <tr>
        <td style="padding:28px 32px 8px; text-align:center;">
            <div style="width:56px; height:56px; border-radius:999px; background:#dcfce7; color:#15803d; font-size:24px; line-height:56px; margin:0 auto 14px;">&#10003;</div>
            <h1 style="margin:0 0 6px; font-size:19px; color:#1b1533;">Top Up Berhasil!</h1>
            <p style="margin:0; font-size:13px; color:#8a85a3;">Terima kasih, pesanan kamu sudah kami proses.</p>
        </td>
    </tr>

    <tr>
        <td style="padding:24px 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px dashed #ece9f7; padding-top:16px; font-size:13px; color:#5b566f;">
                <tr>
                    <td style="padding:6px 0;">Nomor Invoice</td>
                    <td style="padding:6px 0; text-align:right; font-weight:bold; color:#1b1533;">{{ $transaction->invoice_number }}</td>
                </tr>
                <tr>
                    <td style="padding:6px 0;">Game</td>
                    <td style="padding:6px 0; text-align:right; color:#1b1533;">{{ $transaction->game->name }}</td>
                </tr>
                <tr>
                    <td style="padding:6px 0;">User ID</td>
                    <td style="padding:6px 0; text-align:right; color:#1b1533;">
                        {{ $transaction->user_game_id }}{{ $transaction->user_server_id ? ' (' . $transaction->user_server_id . ')' : '' }}
                    </td>
                </tr>
                <tr>
                    <td style="padding:6px 0;">Nominal</td>
                    <td style="padding:6px 0; text-align:right; color:#1b1533;">{{ $transaction->product_name }}</td>
                </tr>
                <tr>
                    <td style="padding:6px 0;">Metode Pembayaran</td>
                    <td style="padding:6px 0; text-align:right; color:#1b1533;">{{ $transaction->paymentMethod->name }}</td>
                </tr>
                <tr>
                    <td style="padding:6px 0;">Harga</td>
                    <td style="padding:6px 0; text-align:right; color:#1b1533;">{{ $formatRupiah($transaction->price) }}</td>
                </tr>
                <tr>
                    <td style="padding:6px 0;">Biaya Admin</td>
                    <td style="padding:6px 0; text-align:right; color:#1b1533;">{{ $formatRupiah($transaction->admin_fee) }}</td>
                </tr>
            </table>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #ece9f7; margin-top:10px; padding-top:14px;">
                <tr>
                    <td style="font-size:14px; font-weight:bold; color:#1b1533;">Total Dibayar</td>
                    <td style="font-size:20px; font-weight:bold; color:#7c3aed; text-align:right;">{{ $formatRupiah($transaction->total_amount) }}</td>
                </tr>
            </table>
        </td>
    </tr>

    <tr>
        <td style="padding:0 32px 32px; text-align:center;">
            <a href="{{ route('transactions.show', $transaction->invoice_number) }}"
               style="display:inline-block; background:#7c3aed; color:#ffffff; text-decoration:none; font-size:13px; font-weight:bold; padding:12px 24px; border-radius:10px;">
                Lihat Detail Transaksi
            </a>
        </td>
    </tr>

    <tr>
        <td style="background:#f7f6fc; padding:18px 32px; text-align:center; font-size:11px; color:#9691b5;">
            Email ini dikirim otomatis oleh {{ $siteName }} sebagai bukti transaksi.<br>
            Ada kendala? Hubungi tim support kami melalui halaman "Cek Transaksi".
        </td>
    </tr>

</table>
</td>
</tr>
</table>
</body>
</html>