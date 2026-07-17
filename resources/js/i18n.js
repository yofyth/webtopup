import { useEffect, useState } from 'react';

export const LOCALES = {
    id: { flag: '🇮🇩', label: 'ID / IDR' },
    en: { flag: '🇬🇧', label: 'EN / USD' },
};

const DICTIONARY = {
    id: {
        topup: 'Top Up',
        cek_transaksi: 'Cek Transaksi',
        leaderboard: 'Leaderboard',
        kalkulator: 'Kalkulator',
        riwayat_transaksi: 'Riwayat Transaksi',
        masuk: 'Masuk',
        daftar: 'Daftar',
        keluar: 'Keluar',
        panel_admin: 'Panel Admin',
        cari_placeholder: 'Cari game atau voucher...',
    },
    en: {
        topup: 'Top Up',
        cek_transaksi: 'Check Order',
        leaderboard: 'Leaderboard',
        kalkulator: 'Calculator',
        riwayat_transaksi: 'Order History',
        masuk: 'Log In',
        daftar: 'Sign Up',
        keluar: 'Log Out',
        panel_admin: 'Admin Panel',
        cari_placeholder: 'Search game or voucher...',
    },
};

/**
 * Hook bahasa ringan (client-side saja, disimpan di localStorage).
 * Catatan: baru menerjemahkan label navbar. Konten lain (nama game, deskripsi,
 * dst) masih Bahasa Indonesia — bisa diperluas nanti dengan menambah key baru
 * ke DICTIONARY di atas dan memakai t('key_baru') di komponen yang perlu.
 */
export function useLocale() {
    const [locale, setLocale] = useState('id');

    useEffect(() => {
        const saved = window.localStorage.getItem('bc_locale');
        if (saved && DICTIONARY[saved]) setLocale(saved);
    }, []);

    const changeLocale = (newLocale) => {
        setLocale(newLocale);
        window.localStorage.setItem('bc_locale', newLocale);
    };

    const t = (key) => DICTIONARY[locale]?.[key] || DICTIONARY.id[key] || key;

    return { locale, changeLocale, t };
}
