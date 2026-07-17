import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ game, categories, selectedCategoryIds }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        name: game.name,
        publisher: game.publisher || '',
        genre: game.genre || '',
        currency_name: game.currency_name,
        rating: game.rating,
        rating_count: game.rating_count,
        needs_server_id: game.needs_server_id,
        is_active: game.is_active,
        is_featured: game.is_featured,
        sort_order: game.sort_order,
        icon: null,
        banner: null,
        currency_icon: null,
        user_id_guide_image: null,
        category_ids: selectedCategoryIds || [],
    });

    const toggleCategory = (id) => {
        setData('category_ids',
            data.category_ids.includes(id)
                ? data.category_ids.filter((c) => c !== id)
                : [...data.category_ids, id]
        );
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.games.update', game.id), { forceFormData: true });
    };

    return (
        <AdminLayout title={`Edit Game — ${game.name}`}>
            <Head title={`Edit ${game.name}`} />

            <form onSubmit={submit} className="adm-card" style={{ maxWidth: 640 }}>
                <div className="adm-form-row">
                    <div className="adm-form-group">
                        <label>Nama Game</label>
                        <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        {errors.name && <p className="adm-error">{errors.name}</p>}
                    </div>
                    <div className="adm-form-group">
                        <label>Publisher</label>
                        <input type="text" value={data.publisher} onChange={(e) => setData('publisher', e.target.value)} />
                    </div>
                </div>

                <div className="adm-form-row">
                    <div className="adm-form-group">
                        <label>Genre</label>
                        <input type="text" value={data.genre} onChange={(e) => setData('genre', e.target.value)} />
                    </div>
                    <div className="adm-form-group">
                        <label>Nama Mata Uang</label>
                        <input type="text" value={data.currency_name} onChange={(e) => setData('currency_name', e.target.value)} />
                    </div>
                </div>

                <div className="adm-form-row">
                    <div className="adm-form-group">
                        <label>Rating (0 - 5)</label>
                        <input type="number" step="0.1" value={data.rating} onChange={(e) => setData('rating', e.target.value)} />
                    </div>
                    <div className="adm-form-group">
                        <label>Jumlah Rating</label>
                        <input type="number" value={data.rating_count} onChange={(e) => setData('rating_count', e.target.value)} />
                    </div>
                </div>

                <div className="adm-form-row">
                    <div className="adm-form-group">
                        <label>Ganti Icon Game (opsional)</label>
                        <input type="file" accept="image/*" onChange={(e) => setData('icon', e.target.files[0])} />
                    </div>
                    <div className="adm-form-group">
                        <label>Ganti Banner Game (opsional)</label>
                        <input type="file" accept="image/*" onChange={(e) => setData('banner', e.target.files[0])} />
                    </div>
                </div>

                <div className="adm-form-group">
                    <label>Ganti Icon Mata Uang (opsional — kalau kosong dan belum pernah diisi, pakai emoji default)</label>
                    {game.currency_icon && (
                        <img src={`/storage/${game.currency_icon}`} alt="Icon saat ini" style={{ width: 40, height: 40, marginBottom: 8, borderRadius: 8 }} />
                    )}
                    <input type="file" accept="image/*" onChange={(e) => setData('currency_icon', e.target.files[0])} />
                </div>

                <div className="adm-form-group">
                    <label>Ganti Gambar Petunjuk Cara Menemukan User ID (opsional)</label>
                    {game.user_id_guide_image && (
                        <img src={`/storage/${game.user_id_guide_image}`} alt="Panduan saat ini" style={{ width: 160, borderRadius: 8, marginBottom: 8, display: 'block' }} />
                    )}
                    <input type="file" accept="image/*" onChange={(e) => setData('user_id_guide_image', e.target.files[0])} />
                </div>

                <div className="adm-form-group">
                    <label>Kategori (pilih 1 atau lebih — tampil sebagai tab filter di landing page)</label>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        {categories.map((cat) => (
                            <label key={cat.id} className="adm-checkbox">
                                <input
                                    type="checkbox"
                                    checked={data.category_ids.includes(cat.id)}
                                    onChange={() => toggleCategory(cat.id)}
                                />
                                {cat.name}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="adm-form-group">
                    <label className="adm-checkbox">
                        <input type="checkbox" checked={data.needs_server_id} onChange={(e) => setData('needs_server_id', e.target.checked)} />
                        Game ini butuh Zone ID / Server ID
                    </label>
                </div>
                <div className="adm-form-group">
                    <label className="adm-checkbox">
                        <input type="checkbox" checked={data.is_featured} onChange={(e) => setData('is_featured', e.target.checked)} />
                        Tampilkan di "Pilih Game Favorit"
                    </label>
                </div>
                <div className="adm-form-group">
                    <label className="adm-checkbox">
                        <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                        Aktif (tampil di situs)
                    </label>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                    <button type="submit" disabled={processing} className="adm-btn adm-btn--primary">Simpan Perubahan</button>
                    <Link href={route('admin.games.products.index', game.id)} className="adm-btn">Kelola Nominal Top Up</Link>
                    <Link href={route('admin.games.index')} className="adm-btn">Kembali</Link>
                </div>
            </form>
        </AdminLayout>
    );
}
