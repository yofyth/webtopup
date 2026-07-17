import { Head, Link } from '@inertiajs/react';
import AccountLayout from '@/Layouts/AccountLayout';

function formatRupiah(value) {
    return 'Rp ' + Number(value || 0).toLocaleString('id-ID');
}

export default function Transactions({ transactions }) {
    return (
        <AccountLayout active="transactions">
            <Head title="Riwayat Transaksi" />

            <div className="acc-card">
                <h3 style={{ marginTop: 0, marginBottom: 16, fontSize: 15 }}>Riwayat Transaksi</h3>
                <table className="acc-table">
                    <thead>
                        <tr><th>Invoice</th><th>Game</th><th>Produk</th><th>Metode</th><th>Total</th><th>Status</th><th>Waktu</th></tr>
                    </thead>
                    <tbody>
                        {transactions.data.map((tx) => (
                            <tr key={tx.id}>
                                <td>
                                    <Link href={route('transactions.show', tx.invoice_number)} style={{ color: '#7c3aed', textDecoration: 'none' }}>
                                        {tx.invoice_number}
                                    </Link>
                                </td>
                                <td>{tx.game?.name}</td>
                                <td>{tx.product?.name}</td>
                                <td>{tx.payment_method?.name}</td>
                                <td>{formatRupiah(tx.total_amount)}</td>
                                <td><span className={`acc-badge acc-badge--${tx.status}`}>{tx.status}</span></td>
                                <td>{new Date(tx.created_at).toLocaleString('id-ID')}</td>
                            </tr>
                        ))}
                        {transactions.data.length === 0 && (
                            <tr><td colSpan="7" style={{ textAlign: 'center', color: '#9691b5' }}>Belum ada transaksi.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AccountLayout>
    );
}
