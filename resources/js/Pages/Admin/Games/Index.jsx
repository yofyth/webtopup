import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ games }) {
    const destroy = (game) => {
        if (confirm(`Hapus game "${game.name}"? Semua nominal top up terkait juga akan terhapus.`)) {
            router.delete(route('admin.games.destroy', game.id));
        }
    };

    return (
        <AdminLayout title="Kelola Game">
            <Head title="Kelola Game" />

            <div className="adm-toolbar">
                <div />
                <Link href={route('admin.games.create')} className="adm-btn adm-btn--primary">+ Tambah Game</Link>
            </div>

            <div className="adm-card">
                <table className="adm-table">
                    <thead>
                        <tr>
                            <th>Nama</th><th>Publisher</th><th>Genre</th><th>Kategori</th><th>Jumlah Nominal</th><th>Status</th><th>Featured</th><th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {games.data.map((game) => (
                            <tr key={game.id}>
                                <td>{game.name}</td>
                                <td>{game.publisher}</td>
                                <td>{game.genre}</td>
                                <td>{game.categories?.map((c) => c.name).join(', ') || '-'}</td>
                                <td>{game.products_count}</td>
                                <td><span className={`adm-badge adm-badge--${game.is_active ? 'active' : 'inactive'}`}>{game.is_active ? 'Aktif' : 'Nonaktif'}</span></td>
                                <td>{game.is_featured ? '✅' : '—'}</td>
                                <td>
                                    <Link href={route('admin.games.products.index', game.id)} className="adm-btn adm-btn--sm">Nominal</Link>{' '}
                                    <Link href={route('admin.games.edit', game.id)} className="adm-btn adm-btn--sm">Edit</Link>{' '}
                                    <button onClick={() => destroy(game)} className="adm-btn adm-btn--sm adm-btn--danger">Hapus</button>
                                </td>
                            </tr>
                        ))}
                        {games.data.length === 0 && (
                            <tr><td colSpan="8" style={{ textAlign: 'center', color: '#9691b5' }}>Belum ada game.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
