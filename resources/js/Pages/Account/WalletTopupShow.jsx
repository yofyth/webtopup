import { Head, Link, router } from '@inertiajs/react';
import AccountLayout from '@/Layouts/AccountLayout';
import '../../../css/transaction.css';
import '../../../css/layout.css';

function formatRupiah(value) {
    return 'Rp ' + Number(value || 0).toLocaleString('id-ID');
}

const STATUS_LABEL = {
    pending: { title: 'Menunggu Pembayaran', icon: '⏳', desc: 'Selesaikan pembayaran sebelum batas waktu habis.' },
    success: { title: 'Isi Saldo Berhasil', icon: '✅', desc: 'Saldo sudah ditambahkan ke BagusCoins Wallet kamu.' },
    failed: { title: 'Transaksi Gagal', icon: '✕', desc: 'Terjadi kendala. Hubungi CS jika sudah membayar.' },
    expired: { title: 'Transaksi Kedaluwarsa', icon: '⏱️', desc: 'Waktu pembayaran telah habis, silakan isi ulang.' },
};

export default function WalletTopupShow({ topup }) {
    const status = STATUS_LABEL[topup.status] || STATUS_LABEL.pending;

    const simulatePay = () => {
        router.post(route('account.wallet.simulate-pay', topup.invoice_number));
    };

    return (
        <AccountLayout active="wallet">
            <Head title={`Isi Saldo ${topup.invoice_number}`} />

            <div className="tx-card" style={{ maxWidth: 480, margin: '0 auto' }}>
                <div className={`tx-status tx-status--${topup.status}`}>
                    <div className="tx-status__icon">{status.icon}</div>
                    <h2>{status.title}</h2>
                    <p>{status.desc}</p>
                </div>

                <div className="tx-row"><span>Nomor Invoice</span><span>{topup.invoice_number}</span></div>
                <div className="tx-row"><span>Nominal Isi Saldo</span><span>{formatRupiah(topup.amount)}</span></div>
                <div className="tx-row"><span>Metode Pembayaran</span><span>{topup.payment_method.name}</span></div>
                <div className="tx-row"><span>Total Pembayaran</span><span>{formatRupiah(topup.total_amount)}</span></div>

                {topup.status === 'pending' && topup.qr_url && (
                    <div className="tx-qr">
                        <img src={topup.qr_url} alt="QRIS" />
                    </div>
                )}

                {topup.status === 'pending' && topup.pay_code && (
                    <div className="tx-paycode">
                        <span style={{ fontSize: 12, color: '#8a85a3' }}>Kode Pembayaran</span>
                        <strong>{topup.pay_code}</strong>
                    </div>
                )}

                {topup.status === 'pending' && (
                    <>
                        <div className="tx-note">
                            Mode simulasi aktif. Klik tombol di bawah untuk mensimulasikan pembayaran berhasil
                            (saldo akan otomatis bertambah).
                        </div>
                        <button onClick={simulatePay} className="bc-btn-primary" style={{ width: '100%', marginTop: 16, padding: 14 }}>
                            Simulasikan Pembayaran Berhasil
                        </button>
                    </>
                )}

                {topup.status === 'success' && (
                    <Link href={route('account.dashboard')} className="bc-btn-primary" style={{ width: '100%', marginTop: 16, padding: 14, display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                        Kembali ke Dashboard
                    </Link>
                )}
            </div>
        </AccountLayout>
    );
}
