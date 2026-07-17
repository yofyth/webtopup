import { Link, usePage } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import '../../css/account.css';

export default function AccountLayout({ children, active }) {
    const { url } = usePage();

    const tabs = [
        { key: 'dashboard', label: 'Dashboard', href: route('account.dashboard') },
        { key: 'transactions', label: 'Riwayat Transaksi', href: route('account.transactions') },
        { key: 'wallet', label: 'Isi Saldo Wallet', href: route('account.wallet.create') },
    ];

    return (
        <GuestLayout>
            <div className="bc-wrap" style={{ marginTop: 24, marginBottom: 48 }}>
                <div className="acc-tabs">
                    {tabs.map((tab) => (
                        <Link key={tab.key} href={tab.href} className={active === tab.key ? 'active' : ''}>
                            {tab.label}
                        </Link>
                    ))}
                </div>
                {children}
            </div>
        </GuestLayout>
    );
}
