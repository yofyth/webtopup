import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

function formatRupiah(value) {
    return 'Rp ' + Number(value || 0).toLocaleString('id-ID');
}

export default function Dashboard({ stats, recentTransactions, topGames }) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard Admin" />

            <div className="adm-stats-grid">
                <div className="adm-stat-card"><span>Total Game</span><strong>{stats.total_games}</strong></div>
                <div className="adm-stat-card"><span>Transaksi Hari Ini</span><strong>{stats.transactions_today}</strong></div>
                <div className="adm-stat-card"><span>Pendapatan Hari Ini</span><strong>{formatRupiah(stats.revenue_today)}</strong></div>
                <div className="adm-stat-card"><span>Pendapatan Bulan Ini</span><strong>{formatRupiah(stats.revenue_month)}</strong></div>
            </div>

            <div className="adm-card">
                <h3 style={{ marginTop: 0, marginBottom: 16, fontSize: 15 }}>Transaksi Terbaru</h3>
                <table className="adm-table">
                    <thead>
                        <tr>
                            <th>Invoice</th><th>Game</th><th>Produk</th><th>Total</th><th>Status</th><th>Waktu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentTransactions.map((tx) => (
                            <tr key={tx.id}>
                                <td>
                                    <Link href={route('admin.transactions.show', tx.id)} style={{ color: '#7c3aed' }}>
                                        {tx.invoice_number}
                                    </Link>
                                </td>
                                <td>{tx.game?.name}</td>
                                <td>{tx.product?.name}</td>
                                <td>{formatRupiah(tx.total_amount)}</td>
                                <td><span className={`adm-badge adm-badge--${tx.status}`}>{tx.status}</span></td>
                                <td>{new Date(tx.created_at).toLocaleString('id-ID')}</td>
                            </tr>
                        ))}
                        {recentTransactions.length === 0 && (
                            <tr><td colSpan="6" style={{ textAlign: 'center', color: '#9691b5' }}>Belum ada transaksi.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="adm-card">
                <h3 style={{ marginTop: 0, marginBottom: 16, fontSize: 15 }}>Game Terpopuler</h3>
                <table className="adm-table">
                    <thead><tr><th>Game</th><th>Jumlah Transaksi Sukses</th></tr></thead>
                    <tbody>
                        {topGames.map((row) => (
                            <tr key={row.game_id}><td>{row.game?.name}</td><td>{row.total}</td></tr>
                        ))}
                        {topGames.length === 0 && (
                            <tr><td colSpan="2" style={{ textAlign: 'center', color: '#9691b5' }}>Belum ada data.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
