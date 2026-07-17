import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LOCALES, useLocale } from '@/i18n';
import '../../css/layout.css';

function formatRupiah(value) {
    return 'Rp ' + Number(value || 0).toLocaleString('id-ID');
}

const NAV_ICONS = {
    topup: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
    ),
    cek: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
    ),
    leaderboard: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 20V10M12 20V4M6 20v-6" />
        </svg>
    ),
    kalkulator: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="8" y2="10" /><line x1="12" y1="10" x2="12" y2="10" /><line x1="16" y1="10" x2="16" y2="10" />
        </svg>
    ),
};

export default function Navbar() {
    const { url, props } = usePage();
    const settings = props.settings || {};
    const user = props.auth?.user;
    const siteName = settings.site_name || 'BagusCoins';
    const isAdminUser = user && (user.role === 'admin' || user.role === 'staff');
    const isCustomerUser = user && user.role === 'customer';
    const { locale, changeLocale, t } = useLocale();
    const [localeOpen, setLocaleOpen] = useState(false);

    const menu = [
        { key: 'topup', label: t('topup'), href: route('home'), match: '/' },
        { key: 'cek', label: t('cek_transaksi'), href: route('transactions.lookup'), match: '/cek-transaksi' },
        { key: 'leaderboard', label: t('leaderboard'), href: '#', match: '/leaderboard' },
        { key: 'kalkulator', label: t('kalkulator'), href: '#', match: '/kalkulator' },
    ];

    const selectLocale = (code) => {
        changeLocale(code);
        setLocaleOpen(false);
    };

    return (
        <header className="bc-navbar">
            {/* ===== Baris 1: Logo, pencarian, selector bahasa ===== */}
            <div className="bc-navbar__row1">
                <Link href={route('home')} className="bc-navbar__logo">
                    {settings.site_logo ? (
                        <img src={`/storage/${settings.site_logo}`} alt={siteName} className="bc-navbar__logo-img" />
                    ) : (
                        <span className="bc-navbar__logo-badge">{siteName.charAt(0).toUpperCase()}</span>
                    )}
                    {siteName.toUpperCase()}
                </Link>

                <div className="bc-navbar__search">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="7" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input type="text" placeholder={t('cari_placeholder')} />
                </div>

                <div className="bc-navbar__locale-wrap">
                    <button
                        type="button"
                        className="bc-navbar__locale"
                        onClick={() => setLocaleOpen((v) => !v)}
                    >
                        {LOCALES[locale].flag} <span className="locale-text">{LOCALES[locale].label}</span> ▾
                    </button>
                    {localeOpen && (
                        <div className="bc-navbar__locale-menu">
                            {Object.entries(LOCALES).map(([code, l]) => (
                                <button
                                    type="button"
                                    key={code}
                                    className={code === locale ? 'active' : ''}
                                    onClick={() => selectLocale(code)}
                                >
                                    {l.flag} {l.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ===== Baris 2: Menu navigasi & tombol akun ===== */}
            <div className="bc-navbar__row2">
                <nav className="bc-navbar__menu">
                    {menu.map((item) => (
                        <Link
                            key={item.key}
                            href={item.href}
                            className={url.startsWith(item.match) && item.match !== '/' ? 'active' : (url === '/' && item.match === '/' ? 'active' : '')}
                        >
                            {NAV_ICONS[item.key]} {item.label}
                        </Link>
                    ))}
                    {isCustomerUser && (
                        <Link href={route('account.transactions')} className={url.startsWith('/akun/transaksi') ? 'active' : ''}>
                            {NAV_ICONS.cek} {t('riwayat_transaksi')}
                        </Link>
                    )}
                </nav>

                <div className="bc-navbar__actions">
                    {!user && (
                        <>
                            <Link href={route('login')} className="bc-btn-outline" style={{ textDecoration: 'none' }}>{t('masuk')}</Link>
                            <Link href={route('register')} className="bc-btn-primary">{t('daftar')}</Link>
                        </>
                    )}

                    {isAdminUser && (
                        <>
                            <Link href={route('admin.dashboard')} className="bc-btn-outline" style={{ textDecoration: 'none' }}>
                                🛠️ {t('panel_admin')}
                            </Link>
                            <Link href={route('logout')} method="post" as="button" className="bc-btn-primary">{t('keluar')}</Link>
                        </>
                    )}

                    {isCustomerUser && (
                        <>
                            <Link href={route('account.dashboard')} className="bc-btn-outline" style={{ textDecoration: 'none' }}>
                                💰 {formatRupiah(user.wallet_balance)}
                            </Link>
                            <Link href={route('logout')} method="post" as="button" className="bc-btn-primary">{t('keluar')}</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
