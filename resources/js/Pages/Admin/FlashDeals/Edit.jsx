import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ flashDeal }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        title: flashDeal.title,
        banner_image: null,
        ends_at: flashDeal.ends_at.slice(0, 16),
        is_active: flashDeal.is_active,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.flash-deals.update', flashDeal.id), { forceFormData: true });
    };

    return (
        <AdminLayout title="Edit Flash Deal">
            <Head title="Edit Flash Deal" />

            <form onSubmit={submit} className="adm-card" style={{ maxWidth: 560 }}>
                <div className="adm-form-group">
                    <label>Judul</label>
                    <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                    {errors.title && <p className="adm-error">{errors.title}</p>}
                </div>

                <div className="adm-form-group">
                    <label>Ganti Banner (opsional)</label>
                    {flashDeal.banner_image && (
                        <img src={`/storage/${flashDeal.banner_image}`} alt={flashDeal.title} style={{ width: 200, borderRadius: 8, marginBottom: 8, display: 'block' }} />
                    )}
                    <input type="file" accept="image/*" onChange={(e) => setData('banner_image', e.target.files[0])} />
                </div>

                <div className="adm-form-group">
                    <label>Berakhir Pada (target hitung mundur)</label>
                    <input type="datetime-local" value={data.ends_at} onChange={(e) => setData('ends_at', e.target.value)} />
                    {errors.ends_at && <p className="adm-error">{errors.ends_at}</p>}
                </div>

                <div className="adm-form-group">
                    <label className="adm-checkbox">
                        <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                        Aktif (tampil di landing page)
                    </label>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                    <button type="submit" disabled={processing} className="adm-btn adm-btn--primary">Simpan Perubahan</button>
                    <Link href={route('admin.flash-deals.items.index', flashDeal.id)} className="adm-btn">Kelola Produk</Link>
                    <Link href={route('admin.flash-deals.index')} className="adm-btn">Kembali</Link>
                </div>
            </form>
        </AdminLayout>
    );
}
