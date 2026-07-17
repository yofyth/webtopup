import { Head, Link, usePage } from '@inertiajs/react';
import AccountLayout from '@/Layouts/AccountLayout';

function formatRupiah(value) {
    return 'Rp ' + Number(value || 0).toLocaleString('id-ID');
}

export default function Dashboard({ recentTransactions, totalTransactions }) {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <AccountLayout active="dashboard">
            <Head title="Akun Saya" />

            <div className="acc-wallet-card">
                <div>
                    <p>Halo, {user.name} 👋</p>
                    <strong>{formatRupiah(user.wallet_balance)}</strong>
                </div>
                <Link href={route('account.wallet.create')}>+ Isi Saldo</Link>
            </div>

            <div className="acc-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <h3 style={{ margin: 0, fontSize: 15 }}>Transaksi Terbaru</h3>
                    <Link href={route('account.transactions')} style={{ fontSize: 13, color: '#7c3aed', textDecoration: 'none', fontWeight: 600 }}>
                        Lihat Semua ({totalTransactions}) →
                    </Link>
                </div>

                <table className="acc-table">
                    <thead>
                        <tr><th>Invoice</th><th>Game</th><th>Produk</th><th>Total</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                        {recentTransactions.map((tx) => (
                            <tr key={tx.id}>
                                <td>
                                    <Link href={route('transactions.show', tx.invoice_number)} style={{ color: '#7c3aed', textDecoration: 'none' }}>
                                        {tx.invoice_number}
                                    </Link>
                                </td>
                                <td>{tx.game?.name}</td>
                                <td>{tx.product?.name}</td>
                                <td>{formatRupiah(tx.total_amount)}</td>
                                <td><span className={`acc-badge acc-badge--${tx.status}`}>{tx.status}</span></td>
                            </tr>
                        ))}
                        {recentTransactions.length === 0 && (
                            <tr><td colSpan="5" style={{ textAlign: 'center', color: '#9691b5' }}>Belum ada transaksi. Yuk top up game favoritmu!</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AccountLayout>
    );
}
