import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        image: null,
        badge_text: '',
        title: '',
        highlight_text: '',
        title_end: '',
        tagline: 'Cepat • Aman • Terpercaya',
        promo_title: '',
        promo_subtitle: '',
        promo_discount_text: '',
        promo_period_text: '',
        link_url: '',
        is_active: true,
        sort_order: 0,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.banners.store'), { forceFormData: true });
    };

    return (
        <AdminLayout title="Tambah Banner">
            <Head title="Tambah Banner" />

            <form onSubmit={submit} className="adm-card" style={{ maxWidth: 640 }}>
                <div className="adm-form-group">
                    <label>Gambar Banner (opsional — kosongkan untuk pakai gradient ungu bawaan)</label>
                    <input type="file" accept="image/*" onChange={(e) => setData('image', e.target.files[0])} />
                </div>

                <div className="adm-form-row">
                    <div className="adm-form-group">
                        <label>Badge Kecil (mis. "TOPUP GAME")</label>
                        <input type="text" value={data.badge_text} onChange={(e) => setData('badge_text', e.target.value)} />
                    </div>
                    <div className="adm-form-group">
                        <label>Tagline (mis. "Cepat • Aman • Terpercaya")</label>
                        <input type="text" value={data.tagline} onChange={(e) => setData('tagline', e.target.value)} />
                    </div>
                </div>

                <div className="adm-form-row">
                    <div className="adm-form-group">
                        <label>Baris Judul 1</label>
                        <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                    </div>
                    <div className="adm-form-group">
                        <label>Baris Judul 2 (disorot warna)</label>
                        <input type="text" value={data.highlight_text} onChange={(e) => setData('highlight_text', e.target.value)} />
                    </div>
                </div>
                <div className="adm-form-group">
                    <label>Baris Judul 3</label>
                    <input type="text" value={data.title_end} onChange={(e) => setData('title_end', e.target.value)} />
                </div>

                <p style={{ fontSize: 12, color: '#8a85a3', margin: '20px 0 8px', fontWeight: 700 }}>KOTAK PROMO (opsional, kosongkan kalau tidak perlu)</p>
                <div className="adm-form-row">
                    <div className="adm-form-group">
                        <label>Judul Kecil (mis. "EVENT SPESIAL")</label>
                        <input type="text" value={data.promo_title} onChange={(e) => setData('promo_title', e.target.value)} />
                    </div>
                    <div className="adm-form-group">
                        <label>Judul Besar</label>
                        <input type="text" value={data.promo_subtitle} onChange={(e) => setData('promo_subtitle', e.target.value)} />
                    </div>
                </div>
                <div className="adm-form-row">
                    <div className="adm-form-group">
                        <label>Teks Diskon</label>
                        <input type="text" value={data.promo_discount_text} onChange={(e) => setData('promo_discount_text', e.target.value)} />
                    </div>
                    <div className="adm-form-group">
                        <label>Teks Periode</label>
                        <input type="text" value={data.promo_period_text} onChange={(e) => setData('promo_period_text', e.target.value)} />
                    </div>
                </div>

                <div className="adm-form-row">
                    <div className="adm-form-group">
                        <label>Link Tujuan (opsional, kalau banner diklik)</label>
                        <input type="text" value={data.link_url} onChange={(e) => setData('link_url', e.target.value)} placeholder="/games/mobile-legends" />
                    </div>
                    <div className="adm-form-group">
                        <label>Urutan Tampil</label>
                        <input type="number" value={data.sort_order} onChange={(e) => setData('sort_order', e.target.value)} />
                    </div>
                </div>

                <div className="adm-form-group">
                    <label className="adm-checkbox">
                        <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                        Aktif (ikut tampil di carousel landing page)
                    </label>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                    <button type="submit" disabled={processing} className="adm-btn adm-btn--primary">Simpan Banner</button>
                    <Link href={route('admin.banners.index')} className="adm-btn">Batal</Link>
                </div>
            </form>
        </AdminLayout>
    );
}
