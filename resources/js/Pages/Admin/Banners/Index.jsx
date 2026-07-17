import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ banners }) {
    const destroy = (banner) => {
        if (confirm(`Hapus banner "${banner.title || banner.id}"?`)) {
            router.delete(route('admin.banners.destroy', banner.id));
        }
    };

    return (
        <AdminLayout title="Kelola Banner Hero">
            <Head title="Banner" />

            <p style={{ fontSize: 13, color: '#8a85a3', marginBottom: 16 }}>
                Banner ini tampil bergantian otomatis tiap 3 detik di landing page. Bisa lebih dari satu,
                dan boleh diisi gambar sendiri (kalau kosong, otomatis pakai gradient ungu bawaan).
            </p>

            <div className="adm-toolbar">
                <div />
                <Link href={route('admin.banners.create')} className="adm-btn adm-btn--primary">+ Tambah Banner</Link>
            </div>

            <div className="adm-card">
                <table className="adm-table">
                    <thead>
                        <tr><th>Preview</th><th>Judul</th><th>Gambar</th><th>Urutan</th><th>Status</th><th></th></tr>
                    </thead>
                    <tbody>
                        {banners.map((banner) => (
                            <tr key={banner.id}>
                                <td>
                                    {banner.image ? (
                                        <img src={`/storage/${banner.image}`} alt={banner.title} style={{ width: 80, height: 40, objectFit: 'cover', borderRadius: 6 }} />
                                    ) : (
                                        <div style={{ width: 80, height: 40, borderRadius: 6, background: 'linear-gradient(120deg,#4c1d95,#7c3aed)' }} />
                                    )}
                                </td>
                                <td>{banner.title} {banner.highlight_text}</td>
                                <td>{banner.image ? 'Custom' : 'Gradient default'}</td>
                                <td>{banner.sort_order}</td>
                                <td><span className={`adm-badge adm-badge--${banner.is_active ? 'active' : 'inactive'}`}>{banner.is_active ? 'Aktif' : 'Nonaktif'}</span></td>
                                <td>
                                    <Link href={route('admin.banners.edit', banner.id)} className="adm-btn adm-btn--sm">Edit</Link>{' '}
                                    <button onClick={() => destroy(banner)} className="adm-btn adm-btn--sm adm-btn--danger">Hapus</button>
                                </td>
                            </tr>
                        ))}
                        {banners.length === 0 && (
                            <tr><td colSpan="6" style={{ textAlign: 'center', color: '#9691b5' }}>Belum ada banner.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
