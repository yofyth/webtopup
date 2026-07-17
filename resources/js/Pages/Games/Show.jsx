import { useMemo, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import '../../../css/game-show.css';

const PAY_GROUP_LABELS = {
    wallet: 'BagusCoins Wallet',
    ewallet: 'E-Wallet',
    virtual_account: 'Virtual Account',
    convenience_store: 'Convenience Store',
    qris: 'QRIS (All Payment)',
};

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
        return <img src={`/storage/${game.currency_icon}`} alt={game.currency_name} style={{ width: 22, height: 22, objectFit: 'contain' }} />;
    }
    return <span>{getCurrencyEmoji(game?.currency_name)}</span>;
}

function formatRupiah(value) {
    return 'Rp ' + Number(value || 0).toLocaleString('id-ID');
}

export default function Show({ game, products, paymentMethods, settings }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const isCustomer = user && user.role === 'customer';
    const [showGuide, setShowGuide] = useState(false);

    // Kelompok "wallet" hanya ditampilkan untuk pembeli yang sudah login.
    const visiblePaymentMethods = Object.fromEntries(
        Object.entries(paymentMethods).filter(([group]) => group !== 'wallet' || isCustomer)
    );

    const [selectedProduct, setSelectedProduct] = useState(products[0] ?? null);
    const [selectedMethod, setSelectedMethod] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        product_id: products[0]?.id ?? '',
        payment_method_id: '',
        user_game_id: '',
        user_server_id: '',
        whatsapp_number: '',
        email: '',
        promo_code: '',
    });

    const effectivePrice = (product) => (product?.flash_price ?? product?.price ?? 0);

    const adminFee = useMemo(() => {
        if (!selectedMethod || !selectedProduct) return 0;
        const flat = Number(selectedMethod.fee_flat || 0);
        const percent = Number(selectedMethod.fee_percent || 0);
        return Math.round(flat + effectivePrice(selectedProduct) * (percent / 100));
    }, [selectedMethod, selectedProduct]);

    const total = effectivePrice(selectedProduct) + adminFee;

    const chooseProduct = (product) => {
        setSelectedProduct(product);
        setData('product_id', product.id);
    };

    const choosePaymentMethod = (method) => {
        setSelectedMethod(method);
        setData('payment_method_id', method.id);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('transactions.store'));
    };

    return (
        <GuestLayout settings={settings}>
            <Head title={`Top Up ${game.name}`} />

            <div className="bc-wrap">
                <div className="gp-breadcrumb">
                    <Link href={route('home')}>Beranda</Link> &gt; <Link href={route('games.index')}>Top Up</Link> &gt; {game.name}
                </div>

                {/* ===== Banner ===== */}
                <div className="gp-banner">
                    <div className="gp-banner__icon">
                        {game.icon ? <img src={`/storage/${game.icon}`} alt={game.name} /> : game.name.charAt(0)}
                    </div>
                    <div className="gp-banner__info">
                        <h1>{game.name}</h1>
                        <div className="gp-banner__meta">
                            <span>{game.publisher}</span>
                            <span>{game.genre}</span>
                            <span>⭐ {Number(game.rating).toFixed(1)}</span>
                            <span>👥 {(game.rating_count / 1000).toFixed(2)}rb Rating</span>
                        </div>
                        <div className="gp-banner__badges">
                            <div>⚡<div><div>Proses Cepat</div><small>1-5 menit</small></div></div>
                            <div>🛡️<div><div>Aman 100%</div><small>Garansi layanan</small></div></div>
                            <div>🎧<div><div>24/7 Support</div><small>CS siap membantu</small></div></div>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="gp-layout">
                    <div>
                        {/* ===== Step 1: Data Akun ===== */}
                        <div className="gp-card">
                            <div className="gp-step-title">
                                <span className="gp-step-num">1</span>
                                <div>
                                    <h3>Masukkan Data Akun</h3>
                                    <p>Pastikan data akun kamu benar</p>
                                </div>
                            </div>

                            <div className="gp-input-row">
                                <input
                                    className="gp-input"
                                    placeholder="Masukkan User ID"
                                    value={data.user_game_id}
                                    onChange={(e) => setData('user_game_id', e.target.value)}
                                />
                                {game.needs_server_id && (
                                    <input
                                        className="gp-input"
                                        style={{ maxWidth: 160 }}
                                        placeholder="Zone ID"
                                        value={data.user_server_id}
                                        onChange={(e) => setData('user_server_id', e.target.value)}
                                    />
                                )}

                                <div
                                    className="gp-help-wrap"
                                    onMouseEnter={() => setShowGuide(true)}
                                    onMouseLeave={() => setShowGuide(false)}
                                >
                                    <button type="button" className="gp-help-icon-btn" aria-label="Bantuan menemukan User ID">?</button>
                                    {showGuide && (
                                        <div className="gp-guide-popover">
                                            {game.user_id_guide_image ? (
                                                <img src={`/storage/${game.user_id_guide_image}`} alt="Panduan User ID" />
                                            ) : (
                                                <p className="gp-guide-empty">Panduan untuk game ini belum tersedia.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {errors.user_game_id && <p className="gp-error">{errors.user_game_id}</p>}

                            <div className="gp-form-grid-2" style={{ marginTop: 12 }}>
                                <input
                                    className="gp-input"
                                    placeholder="Nomor WhatsApp (untuk cek transaksi & notifikasi)"
                                    value={data.whatsapp_number}
                                    onChange={(e) => setData('whatsapp_number', e.target.value)}
                                />
                                <input
                                    className="gp-input"
                                    type="email"
                                    placeholder="Email (opsional, untuk bukti transaksi)"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                            </div>
                            {errors.whatsapp_number && <p className="gp-error">{errors.whatsapp_number}</p>}
                            {errors.email && <p className="gp-error">{errors.email}</p>}
                        </div>

                        {/* ===== Step 2: Nominal ===== */}
                        <div className="gp-card">
                            <div className="gp-step-title">
                                <span className="gp-step-num">2</span>
                                <div>
                                    <h3>Pilih Nominal Top Up</h3>
                                    <p>Pilih jumlah {game.currency_name} sesuai kebutuhanmu</p>
                                </div>
                            </div>

                            <div className="gp-nominal-grid">
                                {products.map((product) => (
                                    <button
                                        type="button"
                                        key={product.id}
                                        className={`gp-nominal-card ${selectedProduct?.id === product.id ? 'selected' : ''} ${product.flash_price ? 'gp-nominal-card--flash' : ''}`}
                                        onClick={() => chooseProduct(product)}
                                    >
                                        {product.flash_price ? (
                                            <span className="gp-nominal-card__bonus gp-nominal-card__bonus--flash">⚡ FLASH DEAL</span>
                                        ) : product.bonus_percent > 0 && (
                                            <span className="gp-nominal-card__bonus">{product.bonus_percent}% BONUS</span>
                                        )}
                                        <div className="gp-nominal-card__amount"><CurrencyIcon game={game} /> {product.name}</div>
                                        {product.flash_price ? (
                                            <div className="gp-nominal-card__strike">{formatRupiah(product.price)}</div>
                                        ) : product.strike_price > 0 && product.strike_price > product.price && (
                                            <div className="gp-nominal-card__strike">{formatRupiah(product.strike_price)}</div>
                                        )}
                                        <div className="gp-nominal-card__price">{formatRupiah(effectivePrice(product))}</div>
                                        {selectedProduct?.id === product.id && <span className="gp-nominal-card__check">✓</span>}
                                    </button>
                                ))}
                            </div>
                            {errors.product_id && <p className="gp-error">{errors.product_id}</p>}
                        </div>

                        {/* ===== Step 3: Pembayaran ===== */}
                        <div className="gp-card">
                            <div className="gp-step-title">
                                <span className="gp-step-num">3</span>
                                <div>
                                    <h3>Pilih Pembayaran</h3>
                                    <p>Pilih metode pembayaran yang kamu inginkan</p>
                                </div>
                            </div>

                            {!isCustomer && (
                                <p style={{ fontSize: 12, color: '#8a85a3', marginTop: -8, marginBottom: 14 }}>
                                    💡 <Link href={route('login')} style={{ color: '#7c3aed', fontWeight: 600 }}>Masuk</Link> untuk bisa bayar pakai BagusCoins Wallet.
                                </p>
                            )}

                            {Object.entries(visiblePaymentMethods).map(([group, methods]) => (
                                <div key={group}>
                                    <div className="gp-pay-group-label">
                                        {PAY_GROUP_LABELS[group] || group}
                                        {group === 'wallet' && ` (Saldo: ${formatRupiah(user.wallet_balance)})`}
                                    </div>
                                    <div className="gp-pay-grid">
                                        {methods.map((method) => (
                                            <button
                                                type="button"
                                                key={method.id}
                                                className={`gp-pay-option ${selectedMethod?.id === method.id ? 'selected' : ''}`}
                                                onClick={() => choosePaymentMethod(method)}
                                            >
                                                {method.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {errors.payment_method_id && <p className="gp-error">{errors.payment_method_id}</p>}
                        </div>

                        {/* ===== Step 4: Promo ===== */}
                        <div className="gp-card">
                            <div className="gp-step-title">
                                <span className="gp-step-num">4</span>
                                <div>
                                    <h3>Kode Promo (Opsional)</h3>
                                    <p>Punya kode promo? Masukkan untuk dapatkan diskon</p>
                                </div>
                            </div>
                            <div className="gp-promo-row">
                                <input
                                    className="gp-input"
                                    placeholder="Masukkan kode promo"
                                    value={data.promo_code}
                                    onChange={(e) => setData('promo_code', e.target.value)}
                                />
                                <button type="button" className="bc-btn-primary">Gunakan</button>
                            </div>
                        </div>
                    </div>

                    {/* ===== Sidebar Ringkasan ===== */}
                    <div className="gp-summary">
                        <div className="gp-card">
                            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 16px' }}>Rincian Top Up</h3>

                            <div className="gp-summary-header">
                                {game.icon ? <img src={`/storage/${game.icon}`} alt={game.name} /> : <div className="placeholder" />}
                                <div>
                                    <h4>{game.name}</h4>
                                    <p>{game.publisher}</p>
                                </div>
                            </div>

                            <div className="gp-summary-row"><span>User ID</span><span>{data.user_game_id || '-'}</span></div>
                            <div className="gp-summary-row"><span>Nominal</span><span>{selectedProduct?.name || '-'}</span></div>
                            <div className="gp-summary-row"><span>Harga</span><span>{formatRupiah(effectivePrice(selectedProduct))}</span></div>
                            <div className="gp-summary-row"><span>Biaya Admin</span><span>{formatRupiah(adminFee)}</span></div>

                            <div className="gp-summary-total">
                                <span>Total Pembayaran</span>
                                <strong>{formatRupiah(total)}</strong>
                            </div>
                        </div>

                        <div className="gp-info-box">
                            <span>⚡</span>
                            <div>
                                <h5>Proses Instan</h5>
                                <p>Top up diproses otomatis dan {game.currency_name} akan langsung masuk ke akun kamu.</p>
                            </div>
                        </div>

                        <div className="gp-info-box">
                            <span>🛡️</span>
                            <div>
                                <h5>Aman &amp; Terpercaya</h5>
                                <p>Semua transaksi dijamin aman dengan sistem enkripsi terbaik.</p>
                            </div>
                        </div>

                        <div className="gp-info-box">
                            <span>🎧</span>
                            <div>
                                <h5>Butuh Bantuan?</h5>
                                <p>Hubungi CS kami 24/7 jika ada kendala atau pertanyaan.</p>
                            </div>
                        </div>

                        <div className="gp-cta-box">
                            <h4>Siap Top Up?</h4>
                            <p>Pastikan data sudah benar, lalu klik tombol di bawah untuk melanjutkan pembayaran.</p>
                            <button type="submit" disabled={processing || !selectedProduct || !selectedMethod}>
                                Bayar Sekarang →
                            </button>
                            <div className="lock">🔒 Transaksi aman &amp; terenkripsi</div>
                        </div>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
