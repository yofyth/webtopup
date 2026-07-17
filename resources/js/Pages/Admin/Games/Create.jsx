import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Create({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        publisher: '',
        genre: '',
        currency_name: 'Diamond',
        rating: 4.8,
        rating_count: 0,
        needs_server_id: false,
        is_active: true,
        is_featured: true,
        sort_order: 0,
        icon: null,
        banner: null,
        currency_icon: null,
        user_id_guide_image: null,
        category_ids: [],
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
        post(route('admin.games.store'), { forceFormData: true });
    };

    return (
        <AdminLayout title="Tambah Game">
            <Head title="Tambah Game" />

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
                        <label>Nama Mata Uang (Diamond/Gold/UC, dst)</label>
                        <input type="text" value={data.currency_name} onChange={(e) => setData('currency_name', e.target.value)} />
                        {errors.currency_name && <p className="adm-error">{errors.currency_name}</p>}
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
                        <label>Icon Game (kotak, untuk grid)</label>
                        <input type="file" accept="image/*" onChange={(e) => setData('icon', e.target.files[0])} />
                    </div>
                    <div className="adm-form-group">
                        <label>Banner Game (untuk halaman detail)</label>
                        <input type="file" accept="image/*" onChange={(e) => setData('banner', e.target.files[0])} />
                    </div>
                </div>

                <div className="adm-form-group">
                    <label>Icon Mata Uang (tampil di kartu nominal — kalau kosong, pakai emoji default sesuai nama mata uang)</label>
                    <input type="file" accept="image/*" onChange={(e) => setData('currency_icon', e.target.files[0])} />
                </div>

                <div className="adm-form-group">
                    <label>Gambar Petunjuk Cara Menemukan User ID (screenshot lokasi User ID di dalam game — muncul sebagai popup saat pembeli klik "?" di halaman top up)</label>
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
                        Game ini butuh Zone ID / Server ID (mis. Mobile Legends)
                    </label>
                </div>
                <div className="adm-form-group">
                    <label className="adm-checkbox">
                        <input type="checkbox" checked={data.is_featured} onChange={(e) => setData('is_featured', e.target.checked)} />
                        Tampilkan di "Pilih Game Favorit" pada landing page
                    </label>
                </div>
                <div className="adm-form-group">
                    <label className="adm-checkbox">
                        <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                        Aktif (tampil di situs)
                    </label>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                    <button type="submit" disabled={processing} className="adm-btn adm-btn--primary">Simpan Game</button>
                    <Link href={route('admin.games.index')} className="adm-btn">Batal</Link>
                </div>
            </form>
        </AdminLayout>
    );
}
