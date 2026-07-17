import { Link, usePage } from '@inertiajs/react';
import '../../css/admin.css';

const NAV = [
    { group: 'Utama', items: [
        { label: 'Dashboard', href: 'admin.dashboard', match: '/admin' },
    ]},
    { group: 'Katalog', items: [
        { label: 'Banner Hero', href: 'admin.banners.index', match: '/admin/banners' },
        { label: 'Flash Deal', href: 'admin.flash-deals.index', match: '/admin/flash-deals' },
        { label: 'Game', href: 'admin.games.index', match: '/admin/games' },
        { label: 'Metode Pembayaran', href: 'admin.payment-methods.index', match: '/admin/payment-methods' },
    ]},
    { group: 'Transaksi', items: [
        { label: 'Semua Transaksi', href: 'admin.transactions.index', match: '/admin/transactions' },
    ]},
    { group: 'Konten', items: [
        { label: 'Testimoni', href: 'admin.testimonials.index', match: '/admin/testimonials' },
        { label: 'Pengaturan Situs', href: 'admin.settings.index', match: '/admin/settings' },
    ]},
];

export default function AdminLayout({ title, children }) {
    const { url, props } = usePage();
    const flash = props.flash || {};

    return (
        <div className="adm-shell">
            <aside className="adm-sidebar">
                <div className="adm-sidebar__logo">
                    <span>YP</span> ADMIN YOFY 
                </div>
                <nav className="adm-nav">
                    {NAV.map((section) => (
                        <div key={section.group}>
                            <div className="adm-nav__group-label">{section.group}</div>
                            {section.items.map((item) => (
                                <Link
                                    key={item.href}
                                    href={route(item.href)}
                                    className={url.startsWith(item.match) ? 'active' : ''}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="adm-main">
                <div className="adm-topbar">
                    <h1>{title}</h1>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <Link href={route('home')} className="adm-btn adm-btn--sm">🏠 Kunjungi Beranda</Link>
                        <Link href={route('logout')} method="post" as="button" className="adm-btn adm-btn--sm">
                            Keluar
                        </Link>
                    </div>
                </div>

                <div className="adm-content">
                    {flash.success && <div className="adm-flash">{flash.success}</div>}
                    {children}
                </div>
            </div>
        </div>
    );
}
