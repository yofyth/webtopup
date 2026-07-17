import { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

function formatRupiah(value) {
    return 'Rp ' + Number(value || 0).toLocaleString('id-ID');
}

const emptyForm = {
    name: '', base_amount: '', bonus_amount: 0, bonus_percent: 0,
    price: '', strike_price: '', is_popular: false, is_active: true, sort_order: 0,
};

export default function Index({ game, products }) {
    const [editingId, setEditingId] = useState(null);
    const { data, setData, post, put, processing, errors, reset } = useForm(emptyForm);

    const startEdit = (product) => {
        setEditingId(product.id);
        setData({
            name: product.name,
            base_amount: product.base_amount,
            bonus_amount: product.bonus_amount,
            bonus_percent: product.bonus_percent,
            price: product.price,
            strike_price: product.strike_price || '',
            is_popular: product.is_popular,
            is_active: product.is_active,
            sort_order: product.sort_order,
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingId) {
            put(route('admin.games.products.update', [game.id, editingId]), {
                onSuccess: () => { setEditingId(null); reset(); },
            });
        } else {
            post(route('admin.games.products.store', game.id), {
                onSuccess: () => reset(),
            });
        }
    };

    const destroy = (product) => {
        if (confirm(`Hapus nominal "${product.name}"?`)) {
            router.delete(route('admin.games.products.destroy', [game.id, product.id]));
        }
    };

    return (
        <AdminLayout title={`Nominal Top Up — ${game.name}`}>
            <Head title={`Nominal ${game.name}`} />

            <Link href={route('admin.games.edit', game.id)} className="adm-btn" style={{ marginBottom: 16, display: 'inline-block' }}>
                ← Kembali ke {game.name}
            </Link>

            <div className="adm-card">
                <h3 style={{ marginTop: 0, marginBottom: 16, fontSize: 15 }}>
                    {editingId ? 'Edit Nominal' : 'Tambah Nominal Baru'}
                </h3>
                <form onSubmit={submit}>
                    <div className="adm-form-row">
                        <div className="adm-form-group">
                            <label>Nama Nominal (mis. "100 + 5 Gold")</label>
                            <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            {errors.name && <p className="adm-error">{errors.name}</p>}
                        </div>
                        <div className="adm-form-group">
                            <label>Harga (Rp)</label>
                            <input type="number" value={data.price} onChange={(e) => setData('price', e.target.value)} />
                            {errors.price && <p className="adm-error">{errors.price}</p>}
                        </div>
                    </div>
                    <div className="adm-form-row">
                        <div className="adm-form-group">
                            <label>Jumlah Dasar ({game.currency_name})</label>
                            <input type="number" value={data.base_amount} onChange={(e) => setData('base_amount', e.target.value)} />
                        </div>
                        <div className="adm-form-group">
                            <label>Jumlah Bonus</label>
                            <input type="number" value={data.bonus_amount} onChange={(e) => setData('bonus_amount', e.target.value)} />
                        </div>
                    </div>
                    <div className="adm-form-row">
                        <div className="adm-form-group">
                            <label>Persen Bonus (badge, %)</label>
                            <input type="number" value={data.bonus_percent} onChange={(e) => setData('bonus_percent', e.target.value)} />
                        </div>
                        <div className="adm-form-group">
                            <label>Harga Coret (opsional)</label>
                            <input type="number" value={data.strike_price} onChange={(e) => setData('strike_price', e.target.value)} />
                        </div>
                    </div>

                    <div className="adm-form-group">
                        <label className="adm-checkbox">
                            <input type="checkbox" checked={data.is_popular} onChange={(e) => setData('is_popular', e.target.checked)} />
                            Tandai sebagai "MOST POPULAR"
                        </label>
                    </div>
                    <div className="adm-form-group">
                        <label className="adm-checkbox">
                            <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                            Aktif (tampil di halaman top up)
                        </label>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                        <button type="submit" disabled={processing} className="adm-btn adm-btn--primary">
                            {editingId ? 'Simpan Perubahan' : 'Tambah Nominal'}
                        </button>
                        {editingId && <button type="button" onClick={cancelEdit} className="adm-btn">Batal</button>}
                    </div>
                </form>
            </div>

            <div className="adm-card">
                <table className="adm-table">
                    <thead>
                        <tr><th>Nama</th><th>Harga</th><th>Bonus</th><th>Populer</th><th>Status</th><th></th></tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{formatRupiah(product.price)}</td>
                                <td>{product.bonus_percent > 0 ? `${product.bonus_percent}%` : '-'}</td>
                                <td>{product.is_popular ? '⭐' : '-'}</td>
                                <td><span className={`adm-badge adm-badge--${product.is_active ? 'active' : 'inactive'}`}>{product.is_active ? 'Aktif' : 'Nonaktif'}</span></td>
                                <td>
                                    <button onClick={() => startEdit(product)} className="adm-btn adm-btn--sm">Edit</button>{' '}
                                    <button onClick={() => destroy(product)} className="adm-btn adm-btn--sm adm-btn--danger">Hapus</button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr><td colSpan="6" style={{ textAlign: 'center', color: '#9691b5' }}>Belum ada nominal untuk game ini.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
