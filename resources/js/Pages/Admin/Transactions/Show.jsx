import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

function formatRupiah(value) {
    return 'Rp ' + Number(value || 0).toLocaleString('id-ID');
}

const STATUSES = ['pending', 'paid', 'processing', 'success', 'failed', 'expired'];

export default function Show({ transaction }) {
    const { data, setData, patch, processing } = useForm({ status: transaction.status });

    const submit = (e) => {
        e.preventDefault();
        patch(route('admin.transactions.update-status', transaction.id));
    };

    return (
        <AdminLayout title={`Transaksi ${transaction.invoice_number}`}>
            <Head title={transaction.invoice_number} />

            <div className="adm-card" style={{ maxWidth: 560 }}>
                <table className="adm-table">
                    <tbody>
                        <tr><td>Invoice</td><td>{transaction.invoice_number}</td></tr>
                        <tr><td>Referensi Tripay</td><td>{transaction.tripay_reference || '-'}</td></tr>
                        <tr><td>Game</td><td>{transaction.game.name}</td></tr>
                        <tr><td>Produk</td><td>{transaction.product_name}</td></tr>
                        <tr><td>User ID</td><td>{transaction.user_game_id}{transaction.user_server_id ? ` (${transaction.user_server_id})` : ''}</td></tr>
                        <tr><td>WhatsApp</td><td>{transaction.whatsapp_number}</td></tr>
                        <tr><td>Metode Pembayaran</td><td>{transaction.payment_method.name}</td></tr>
                        <tr><td>Harga</td><td>{formatRupiah(transaction.price)}</td></tr>
                        <tr><td>Biaya Admin</td><td>{formatRupiah(transaction.admin_fee)}</td></tr>
                        <tr><td>Total</td><td><strong>{formatRupiah(transaction.total_amount)}</strong></td></tr>
                        <tr><td>Dibuat</td><td>{new Date(transaction.created_at).toLocaleString('id-ID')}</td></tr>
                        <tr><td>Dibayar</td><td>{transaction.paid_at ? new Date(transaction.paid_at).toLocaleString('id-ID') : '-'}</td></tr>
                    </tbody>
                </table>
            </div>

            <div className="adm-card" style={{ maxWidth: 560 }}>
                <h3 style={{ marginTop: 0, fontSize: 15 }}>Ubah Status Manual</h3>
                <p style={{ fontSize: 12, color: '#8a85a3', marginTop: -8, marginBottom: 16 }}>
                    Gunakan hanya jika perlu verifikasi manual. Pada mode Tripay asli, status akan berubah otomatis lewat callback.
                </p>
                <form onSubmit={submit} style={{ display: 'flex', gap: 10 }}>
                    <select
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e1f5', fontSize: 13 }}
                    >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button type="submit" disabled={processing} className="adm-btn adm-btn--primary">Simpan</button>
                </form>
            </div>
        </AdminLayout>
    );
}
