import { Link } from '@inertiajs/react';
import '../../css/layout.css';

export default function Footer({ settings = {} }) {
    const siteName = settings.site_name || 'Yofy Topup';

    return (
        <footer className="bc-footer">
            <div className="bc-footer__grid">
                <div className="bc-footer__brand">
                    <div className="bc-navbar__logo">
                        {settings.site_logo ? (
                            <img src={`/storage/${settings.site_logo}`} alt={siteName} className="bc-navbar__logo-img" />
                        ) : (
                            <span className="bc-navbar__logo-badge">{siteName.charAt(0).toUpperCase()}</span>
                        )}
                        {siteName.toUpperCase()}
                    </div>
                    <p>Platform top up game terpercaya, cepat, aman, dan harga terbaik untuk semua pemain.</p>
                </div>

                <div className="bc-footer__col">
                    <h4>Layanan</h4>
                    <Link href={route('home')}>Top Up</Link>
                    <Link href={route('transactions.lookup')}>Cek Transaksi</Link>
                    <a href="#">Leaderboard</a>
                    <a href="#">Kalkulator</a>
                </div>

                <div className="bc-footer__col">
                    <h4>Informasi</h4>
                    <a href="#">Tentang Kami</a>
                    <a href="#">Syarat &amp; Ketentuan</a>
                    <a href="#">Kebijakan Privasi</a>
                    <a href="#">FAQ</a>
                </div>

                <div className="bc-footer__col">
                    <h4>Bantuan</h4>
                    <a href="#">Cara Top Up</a>
                    <a href="#">Metode Pembayaran</a>
                    <a href={`https://wa.me/${settings.whatsapp_cs || ''}`}>Hubungi Kami</a>
                </div>

                <div className="bc-footer__col">
                    <h4>Ikuti Kami</h4>
                    <div className="bc-footer__social">
                        <a href={settings.instagram_url || '#'} aria-label="Instagram">IG</a>
                        <a href={settings.whatsapp_url || '#'} aria-label="WhatsApp">WA</a>
                        <a href={settings.discord_url || '#'} aria-label="Discord">DC</a>
                        <a href={settings.youtube_url || '#'} aria-label="YouTube">YT</a>
                    </div>
                </div>
            </div>

            <div className="bc-footer__bottom">
                <span>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</span>
                <span>Made with 💜 for gamers</span>
            </div>
        </footer>
    );
}
