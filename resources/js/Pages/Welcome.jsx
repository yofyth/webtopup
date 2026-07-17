import { useEffect, useMemo, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import '../../css/welcome.css';

const FEATURES = [
    { title: 'Proses Cepat', desc: 'Hitungan detik', icon: '⏱️' },
    { title: 'Aman & Terpercaya', desc: '100% dijamin aman', icon: '🛡️' },
    { title: 'Harga Terbaik', desc: 'Lebih hemat tiap topup', icon: '✨' },
    { title: '24/7 Support', desc: 'Kami siap membantu', icon: '🎧' },
];

// Fallback emoji berdasarkan nama mata uang, dipakai kalau game belum di-upload icon mata uangnya
const CURRENCY_EMOJI = {
    diamond: '💎',
    gold: '🪙',
    uc: '🎫',
    genesis: '💠',
    token: '🎟️',
    points: '🔹',
};

function getCurrencyEmoji(currencyName = '') {
    const key = Object.keys(CURRENCY_EMOJI).find((k) => currencyName.toLowerCase().includes(k));
    return CURRENCY_EMOJI[key] || '💎';
}

function CurrencyIcon({ game }) {
    if (game?.currency_icon) {
        return <img src={`/storage/${game.currency_icon}`} alt={game.currency_name} style={{ width: 32, height: 32, objectFit: 'contain' }} />;
    }
    return <span>{getCurrencyEmoji(game?.currency_name)}</span>;
}

function formatRupiah(value) {
    return 'Rp ' + Number(value).toLocaleString('id-ID');
}

const PRODUCTS_PER_PAGE = 5;
const AUTOPLAY_INTERVAL = 2000;
const BANNER_INTERVAL = 3000;

export default function Welcome({ banners, flashDeal, categories, games, popularProducts, testimonials, settings }) {
    const newsletterForm = useForm({ email: '' });
    const [activeCategory, setActiveCategory] = useState('semua');
    const [currentPage, setCurrentPage] = useState(0);
    const [currentBanner, setCurrentBanner] = useState(0);
    const [countdown, setCountdown] = useState(null);

    // Hitung mundur Flash Deal, update tiap detik
    useEffect(() => {
        if (!flashDeal) return;

        const target = new Date(flashDeal.ends_at).getTime();

        const tick = () => {
            const diff = target - Date.now();
            if (diff <= 0) {
                setCountdown({ h: 0, m: 0, s: 0 });
                return;
            }
            setCountdown({
                h: Math.floor(diff / 3600000),
                m: Math.floor((diff % 3600000) / 60000),
                s: Math.floor((diff % 60000) / 1000),
            });
        };

        tick();
        const timer = setInterval(tick, 1000);
        return () => clearInterval(timer);
    }, [flashDeal]);

    // Fallback: kalau belum ada banner sama sekali di database, tampilkan 1 banner default dari settings
    const slides = banners && banners.length > 0 ? banners : [{
        id: 'default',
        image: null,
        badge_text: settings.hero_badge || 'TOPUP GAME',
        title: settings.hero_title || 'TOP UP GAME',
        highlight_text: settings.hero_highlight || 'FAVORITMU',
        title_end: settings.hero_title_end || 'DISINI',
        tagline: settings.hero_tagline || 'Cepat • Aman • Terpercaya',
        promo_title: settings.promo_title || 'EVENT SPESIAL',
        promo_subtitle: settings.promo_subtitle || 'STARLIGHT JULI 2026',
        promo_discount_text: settings.promo_discount_text || 'DISKON HINGGA 20%',
        promo_period_text: settings.promo_period_text || 'PERIODE TERBATAS!',
        link_url: null,
    }];

    // Hero banner bergeser otomatis tiap 3 detik (kalau lebih dari 1 slide)
    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentBanner((i) => (i + 1) % slides.length);
        }, BANNER_INTERVAL);
        return () => clearInterval(timer);
    }, [slides.length]);

    const filteredGames = useMemo(() => {
        if (activeCategory === 'semua') return games;
        return games.filter((game) => game.category_slugs?.includes(activeCategory));
    }, [games, activeCategory]);

    const totalPages = Math.max(1, Math.ceil(popularProducts.length / PRODUCTS_PER_PAGE));
    const visibleProducts = popularProducts.slice(
        currentPage * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE + PRODUCTS_PER_PAGE
    );

    // Carousel "Top Up Populer" otomatis bergeser setiap 2 detik
    useEffect(() => {
        if (totalPages <= 1) return;
        const timer = setInterval(() => {
            setCurrentPage((page) => (page + 1) % totalPages);
        }, AUTOPLAY_INTERVAL);
        return () => clearInterval(timer);
    }, [totalPages]);

    const submitNewsletter = (e) => {
        e.preventDefault();
        // Endpoint newsletter belum diimplementasikan backend-nya, tinggal ditambahkan sesuai kebutuhan.
        newsletterForm.reset();
    };

    return (
        <GuestLayout settings={settings}>
            <Head title={`${settings.site_name || 'BagusCoins'} - Top Up Game Terpercaya`} />

            <div className="bc-wrap">
                {/* ===== Hero (carousel banner) ===== */}
                <section className="bc-hero-carousel">
                    {slides.map((slide, i) => {
                        const content = (
                            <>
                                <div>
                                    {slide.badge_text && <span className="bc-hero__badge">{slide.badge_text}</span>}
                                    <h1 className="bc-hero__title">
                                        {slide.title}<br />
                                        {slide.highlight_text && <><span>{slide.highlight_text}</span><br /></>}
                                        {slide.title_end}
                                    </h1>
                                    {slide.tagline && <div className="bc-hero__tagline">🛡️ {slide.tagline}</div>}
                                </div>

                                {slide.promo_subtitle && (
                                    <div className="bc-hero__promo">
                                        <p>{slide.promo_title}</p>
                                        <h3>{slide.promo_subtitle}</h3>
                                        <div className="discount">
                                            {(slide.promo_discount_text || '').replace(/\d+%/g, '').trim()}
                                            <strong>{(slide.promo_discount_text || '').match(/\d+%|Rp[\d.,]+/)?.[0]}</strong>
                                        </div>
                                        <p className="period">{slide.promo_period_text}</p>
                                    </div>
                                )}
                            </>
                        );

                        const slideStyle = slide.image
                            ? { backgroundImage: `linear-gradient(120deg, rgba(27,17,64,.75), rgba(76,29,149,.55)), url(/storage/${slide.image})` }
                            : {};

                        return i === currentBanner ? (
                            slide.link_url ? (
                                <Link key={slide.id} href={slide.link_url} className="bc-hero" style={slideStyle}>
                                    {content}
                                </Link>
                            ) : (
                                <div key={slide.id} className="bc-hero" style={slideStyle}>
                                    {content}
                                </div>
                            )
                        ) : null;
                    })}

                    {slides.length > 1 && (
                        <div className="bc-hero-dots">
                            {slides.map((_, i) => (
                                <span
                                    key={i}
                                    className={i === currentBanner ? 'active' : ''}
                                    onClick={() => setCurrentBanner(i)}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* ===== Feature strip ===== */}
                <section className="bc-features">
                    {FEATURES.map((f) => (
                        <div key={f.title} className="bc-feature-card">
                            <div className="bc-feature-card__icon">{f.icon}</div>
                            <div>
                                <h4>{f.title}</h4>
                                <p>{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </section>

                {/* ===== Flash Deal ===== */}
                {flashDeal && countdown && (
                    <section className="fd-section" style={flashDeal.banner_image ? { backgroundImage: `linear-gradient(rgba(255,255,255,.92), rgba(255,255,255,.92)), url(/storage/${flashDeal.banner_image})` } : {}}>
                        <div className="fd-header">
                            <h2>⚡ {flashDeal.title.toUpperCase()}</h2>
                            <div className="fd-countdown">
                                🕐 {String(countdown.h).padStart(2, '0')}:{String(countdown.m).padStart(2, '0')}:{String(countdown.s).padStart(2, '0')}
                            </div>
                        </div>

                        <div className="fd-grid">
                            {flashDeal.items.map((item) => {
                                const discount = Math.round(100 - (item.flash_price / item.product.price) * 100);
                                return (
                                    <Link key={item.id} href={route('games.show', item.product.game.slug)} className="fd-card">
                                        {item.stock !== null && <span className="fd-card__stock">TERSISA: {item.stock}</span>}
                                        {item.image ? (
                                            <img src={`/storage/${item.image}`} alt={item.product.name} className="fd-card__img" />
                                        ) : (
                                            <div className="fd-card__icon"><CurrencyIcon game={item.product.game} /></div>
                                        )}
                                        <div className="fd-card__strike">{formatRupiah(item.product.price)}</div>
                                        <h4>{item.product.name}</h4>
                                        <p>{item.product.game.name}</p>
                                        <div className="fd-card__footer">
                                            <span className="fd-card__price">{formatRupiah(item.flash_price)}</span>
                                            {discount > 0 && <span className="fd-card__badge">🔥 -{discount}%</span>}
                                        </div>
                                    </Link>
                                );
                            })}
                            {flashDeal.items.length === 0 && (
                                <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#9691b5' }}>Belum ada produk di Flash Deal ini.</p>
                            )}
                        </div>
                    </section>
                )}

                {/* ===== Pilih Game Favorit ===== */}
                <section className="bc-section">
                    <div className="bc-section__head">
                        <h2>🔥 PILIH GAME FAVORIT ✨</h2>
                        <Link href={route('games.index')} className="bc-section__link">Lihat Semua Game →</Link>
                    </div>

                    <div className="bc-category-tabs">
                        <button
                            type="button"
                            className={activeCategory === 'semua' ? 'active' : ''}
                            onClick={() => setActiveCategory('semua')}
                        >
                            Semua
                        </button>
                        {categories.map((cat) => (
                            <button
                                type="button"
                                key={cat.id}
                                className={activeCategory === cat.slug ? 'active' : ''}
                                onClick={() => setActiveCategory(cat.slug)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    <div className="bc-game-grid">
                        {filteredGames.map((game) => (
                            <Link key={game.id} href={route('games.show', game.slug)} className="bc-game-card">
                                <div className="bc-game-card__icon">
                                    {game.icon ? (
                                        <img src={`/storage/${game.icon}`} alt={game.name} />
                                    ) : (
                                        <span style={{ fontSize: 22, fontWeight: 800, color: '#7c3aed' }}>
                                            {game.name.charAt(0)}
                                        </span>
                                    )}
                                </div>
                                <h4>{game.name}</h4>
                                <p>{game.genre}</p>
                            </Link>
                        ))}
                        {filteredGames.length === 0 && (
                            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#9691b5' }}>
                                Belum ada game di kategori ini.
                            </p>
                        )}
                    </div>
                </section>

                {/* ===== Top Up Populer (carousel otomatis) ===== */}
                <section className="bc-section">
                    <div className="bc-section__head">
                        <div>
                            <h2>🔥 TOP UP POPULER</h2>
                            <p>Produk yang paling banyak dicari hari ini.</p>
                        </div>
                    </div>

                    <div className="bc-product-row" key={currentPage}>
                        {visibleProducts.map((product) => (
                            <Link
                                key={product.id}
                                href={route('games.show', product.game.slug)}
                                className={`bc-product-card ${product.is_popular ? 'bc-product-card--popular' : ''}`}
                                style={{ textDecoration: 'none' }}
                            >
                                {product.is_popular && <span className="bc-product-card__badge">MOST POPULAR</span>}
                                <div className="bc-product-card__icon"><CurrencyIcon game={product.game} /></div>
                                <h4>{product.name}</h4>
                                <p className="game-name">{product.game.name}</p>
                                <div className="bc-product-card__footer">
                                    <div>
                                        {product.strike_price > 0 && product.strike_price > product.price && (
                                            <div className="bc-product-card__strike">{formatRupiah(product.strike_price)}</div>
                                        )}
                                        <span className="bc-product-card__price">{formatRupiah(product.price)}</span>
                                    </div>
                                    <span className="bc-product-card__cart">🛒</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="bc-carousel-dots">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <span
                                    key={i}
                                    className={i === currentPage ? 'active' : ''}
                                    onClick={() => setCurrentPage(i)}
                                    style={{ cursor: 'pointer' }}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* ===== CTA + Stats ===== */}
                <section className="bc-cta">
                    <div className="bc-cta__promo">
                        <div>
                            <h3>Top Up Sekarang,<br />Main Game Makin Seru!</h3>
                            <p>Gabung bersama ribuan pemain lainnya yang sudah percaya dengan layanan kami.</p>
                            <Link href={route('games.index')} className="bc-btn-white">Top Up Sekarang →</Link>
                        </div>
                        <div style={{ fontSize: 56 }}>💎</div>
                    </div>

                    <div className="bc-cta__stats">
                        <div className="bc-cta__stat">
                            <strong>{settings.stat_active_users || '50K+'}</strong>
                            <span>Pelanggan Aktif</span>
                        </div>
                        <div className="bc-cta__stat">
                            <strong>{settings.stat_success_rate || '99.9%'}</strong>
                            <span>Transaksi Berhasil</span>
                        </div>
                        <div className="bc-cta__stat">
                            <strong>24/7</strong>
                            <span>Support Online</span>
                        </div>
                    </div>
                </section>

                {/* ===== Testimoni ===== */}
                {testimonials?.length > 0 && (
                    <section className="bc-section">
                        <div className="bc-section__head">
                            <h2>💬 Apa Kata Mereka</h2>
                        </div>
                        <div className="bc-testimonial-row">
                            {testimonials.slice(0, 3).map((t) => (
                                <div key={t.id} className="bc-product-card" style={{ textAlign: 'left' }}>
                                    <div style={{ color: '#f59e0b', marginBottom: 8 }}>{'★'.repeat(t.rating)}</div>
                                    <p style={{ fontSize: 13, color: '#5b566f', margin: '0 0 14px' }}>&ldquo;{t.message}&rdquo;</p>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1b1533' }}>{t.name}</div>
                                    <div style={{ fontSize: 11, color: '#9691b5' }}>{t.game_name}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ===== Newsletter ===== */}
                <section className="bc-newsletter">
                    <div className="bc-newsletter__left">
                        <span style={{ fontSize: 28 }}>🎁</span>
                        <h4>Jadi yang pertama dapatkan<br />info promo &amp; event terbaru!</h4>
                    </div>
                    <form onSubmit={submitNewsletter}>
                        <input
                            type="email"
                            placeholder="Masukkan email kamu"
                            value={newsletterForm.data.email}
                            onChange={(e) => newsletterForm.setData('email', e.target.value)}
                        />
                        <button type="submit" className="bc-btn-primary">Langganan</button>
                    </form>
                </section>
            </div>
        </GuestLayout>
    );
}
