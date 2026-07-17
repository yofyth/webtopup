import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ banner }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        image: null,
        badge_text: banner.badge_text || '',
        title: banner.title || '',
        highlight_text: banner.highlight_text || '',
        title_end: banner.title_end || '',
        tagline: banner.tagline || '',
        promo_title: banner.promo_title || '',
        promo_subtitle: banner.promo_subtitle || '',
        promo_discount_text: banner.promo_discount_text || '',
        promo_period_text: banner.promo_period_text || '',
        link_url: banner.link_url || '',
        is_active: banner.is_active,
        sort_order: banner.sort_order,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.banners.update', banner.id), { forceFormData: true });
    };

    return (
        <AdminLayout title="Edit Banner">
            <Head title="Edit Banner" />

            <form onSubmit={submit} className="adm-card" style={{ maxWidth: 640 }}>
                <div className="adm-form-group">
                    <label>Ganti Gambar Banner (opsional)</label>
                    {banner.image && (
                        <img src={`/storage/${banner.image}`} alt={banner.title} style={{ width: 160, height: 80, objectFit: 'cover', borderRadius: 8, marginBottom: 8, display: 'block' }} />
                    )}
                    <input type="file" accept="image/*" onChange={(e) => setData('image', e.target.files[0])} />
                </div>

                <div className="adm-form-row">
                    <div className="adm-form-group">
                        <label>Badge Kecil</label>
                        <input type="text" value={data.badge_text} onChange={(e) => setData('badge_text', e.target.value)} />
                    </div>
                    <div className="adm-form-group">
                        <label>Tagline</label>
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

                <p style={{ fontSize: 12, color: '#8a85a3', margin: '20px 0 8px', fontWeight: 700 }}>KOTAK PROMO (opsional)</p>
                <div className="adm-form-row">
                    <div className="adm-form-group">
                        <label>Judul Kecil</label>
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
                        <label>Link Tujuan (opsional)</label>
                        <input type="text" value={data.link_url} onChange={(e) => setData('link_url', e.target.value)} />
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
                    <button type="submit" disabled={processing} className="adm-btn adm-btn--primary">Simpan Perubahan</button>
                    <Link href={route('admin.banners.index')} className="adm-btn">Kembali</Link>
                </div>
            </form>
        </AdminLayout>
    );
}
