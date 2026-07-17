import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ flashDeals }) {
    const destroy = (deal) => {
        if (confirm(`Hapus Flash Deal "${deal.title}"?`)) {
            router.delete(route('admin.flash-deals.destroy', deal.id));
        }
    };

    return (
        <AdminLayout title="Kelola Flash Deal">
            <Head title="Flash Deal" />

            <p style={{ fontSize: 13, color: '#8a85a3', marginBottom: 16 }}>
                Flash Deal tampil di landing page dengan hitung mundur otomatis sampai waktu berakhir
                (<code>ends_at</code>). Kalau lebih dari satu Flash Deal aktif, yang ditampilkan adalah
                yang paling baru dibuat.
            </p>

            <div className="adm-toolbar">
                <div />
                <Link href={route('admin.flash-deals.create')} className="adm-btn adm-btn--primary">+ Buat Flash Deal</Link>
            </div>

            <div className="adm-card">
                <table className="adm-table">
                    <thead>
                        <tr><th>Judul</th><th>Berakhir</th><th>Jumlah Produk</th><th>Status</th><th></th></tr>
                    </thead>
                    <tbody>
                        {flashDeals.map((deal) => (
                            <tr key={deal.id}>
                                <td>{deal.title}</td>
                                <td>{new Date(deal.ends_at).toLocaleString('id-ID')}</td>
                                <td>{deal.items_count}</td>
                                <td><span className={`adm-badge adm-badge--${deal.is_active ? 'active' : 'inactive'}`}>{deal.is_active ? 'Aktif' : 'Nonaktif'}</span></td>
                                <td>
                                    <Link href={route('admin.flash-deals.items.index', deal.id)} className="adm-btn adm-btn--sm">Kelola Produk</Link>{' '}
                                    <Link href={route('admin.flash-deals.edit', deal.id)} className="adm-btn adm-btn--sm">Edit</Link>{' '}
                                    <button onClick={() => destroy(deal)} className="adm-btn adm-btn--sm adm-btn--danger">Hapus</button>
                                </td>
                            </tr>
                        ))}
                        {flashDeals.length === 0 && (
                            <tr><td colSpan="5" style={{ textAlign: 'center', color: '#9691b5' }}>Belum ada Flash Deal.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
