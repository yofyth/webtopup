import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

function formatRupiah(value) {
    return 'Rp ' + Number(value || 0).toLocaleString('id-ID');
}

const STATUSES = ['pending', 'paid', 'processing', 'success', 'failed', 'expired'];

export default function Index({ transactions, filters }) {
    const applyFilter = (status) => {
        router.get(route('admin.transactions.index'), { ...filters, status }, { preserveState: true });
    };

    const submitSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.transactions.index'), { ...filters, search: e.target.search.value }, { preserveState: true });
    };

    return (
        <AdminLayout title="Semua Transaksi">
            <Head title="Transaksi" />

            <div className="adm-toolbar">
                <form onSubmit={submitSearch}>
                    <input
                        name="search"
                        defaultValue={filters.search}
                        placeholder="Cari invoice / User ID / No. WhatsApp"
                        className="adm-form-group"
                        style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e1f5', fontSize: 13, minWidth: 280 }}
                    />
                </form>

                <select
                    value={filters.status || ''}
                    onChange={(e) => applyFilter(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e1f5', fontSize: 13 }}
                >
                    <option value="">Semua Status</option>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div className="adm-card">
                <table className="adm-table">
                    <thead>
                        <tr><th>Invoice</th><th>Pembeli</th><th>Game</th><th>Produk</th><th>WhatsApp</th><th>Total</th><th>Status</th><th>Waktu</th><th></th></tr>
                    </thead>
                    <tbody>
                        {transactions.data.map((tx) => (
                            <tr key={tx.id}>
                                <td>{tx.invoice_number}</td>
                                <td>{tx.user ? tx.user.name : <span style={{ color: '#9691b5' }}>Guest</span>}</td>
                                <td>{tx.game?.name}</td>
                                <td>{tx.product?.name}</td>
                                <td>{tx.whatsapp_number}</td>
                                <td>{formatRupiah(tx.total_amount)}</td>
                                <td><span className={`adm-badge adm-badge--${tx.status}`}>{tx.status}</span></td>
                                <td>{new Date(tx.created_at).toLocaleString('id-ID')}</td>
                                <td><Link href={route('admin.transactions.show', tx.id)} className="adm-btn adm-btn--sm">Detail</Link></td>
                            </tr>
                        ))}
                        {transactions.data.length === 0 && (
                            <tr><td colSpan="9" style={{ textAlign: 'center', color: '#9691b5' }}>Tidak ada transaksi.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
