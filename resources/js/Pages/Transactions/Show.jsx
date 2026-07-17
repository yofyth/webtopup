import { Head, router } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import '../../../css/transaction.css';

function formatRupiah(value) {
    return 'Rp ' + Number(value || 0).toLocaleString('id-ID');
}

const STATUS_LABEL = {
    pending: { title: 'Menunggu Pembayaran', icon: '⏳', desc: 'Selesaikan pembayaran sebelum batas waktu habis.' },
    processing: { title: 'Sedang Diproses', icon: '⚙️', desc: `${'Item sedang dikirim ke akun game kamu.'}` },
    success: { title: 'Top Up Berhasil', icon: '✅', desc: 'Terima kasih! Item sudah masuk ke akun kamu.' },
    failed: { title: 'Transaksi Gagal', icon: '✕', desc: 'Terjadi kendala pada transaksi ini. Hubungi CS jika sudah membayar.' },
    expired: { title: 'Transaksi Kedaluwarsa', icon: '⏱️', desc: 'Waktu pembayaran telah habis, silakan buat transaksi baru.' },
};

export default function Show({ transaction }) {
    const status = STATUS_LABEL[transaction.status] || STATUS_LABEL.pending;

    const simulatePay = () => {
        router.post(route('transactions.simulate-pay', transaction.invoice_number));
    };

    return (
        <GuestLayout>
            <Head title={`Transaksi ${transaction.invoice_number}`} />

            <div className="tx-wrap">
                <div className="tx-card">
                    <div className={`tx-status tx-status--${transaction.status}`}>
                        <div className="tx-status__icon">{status.icon}</div>
                        <h2>{status.title}</h2>
                        <p>{status.desc}</p>
                    </div>

                    <div className="tx-row"><span>Nomor Invoice</span><span>{transaction.invoice_number}</span></div>
                    <div className="tx-row"><span>Game</span><span>{transaction.game.name}</span></div>
                    <div className="tx-row"><span>User ID</span><span>{transaction.user_game_id}{transaction.user_server_id ? ` (${transaction.user_server_id})` : ''}</span></div>
                    <div className="tx-row"><span>Nominal</span><span>{transaction.product_name}</span></div>
                    <div className="tx-row"><span>Metode Pembayaran</span><span>{transaction.payment_method.name}</span></div>
                    <div className="tx-row"><span>Total Pembayaran</span><span>{formatRupiah(transaction.total_amount)}</span></div>

                    {transaction.status === 'success' && transaction.email && (
                        <div className="tx-note" style={{ background: '#dcfce7', borderColor: '#bbf7d0', color: '#15803d' }}>
                            📧 Struk pembayaran sudah dikirim ke {transaction.email}
                        </div>
                    )}

                    {transaction.status === 'pending' && transaction.qr_url && (
                        <div className="tx-qr">
                            <img src={transaction.qr_url} alt="QRIS" />
                            <p style={{ fontSize: 12, color: '#8a85a3', marginTop: 8 }}>Scan QRIS di atas menggunakan aplikasi e-wallet/m-banking kamu.</p>
                        </div>
                    )}

                    {transaction.status === 'pending' && transaction.pay_code && (
                        <div className="tx-paycode">
                            <span style={{ fontSize: 12, color: '#8a85a3' }}>Kode Pembayaran</span>
                            <strong>{transaction.pay_code}</strong>
                        </div>
                    )}

                    {transaction.status === 'pending' && (
                        <>
                            <div className="tx-note">
                                Mode simulasi aktif: pembayaran belum terhubung ke Tripay asli. Klik tombol di bawah
                                untuk mensimulasikan pembayaran berhasil (khusus development).
                            </div>
                            <button
                                onClick={simulatePay}
                                className="bc-btn-primary"
                                style={{ width: '100%', marginTop: 16, padding: 14 }}
                            >
                                Simulasikan Pembayaran Berhasil
                            </button>
                        </>
                    )}
                </div>
            </div>
        </GuestLayout>
    );
}
