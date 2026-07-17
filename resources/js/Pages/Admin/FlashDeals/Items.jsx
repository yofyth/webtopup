import { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

function formatRupiah(value) {
    return 'Rp ' + Number(value || 0).toLocaleString('id-ID');
}

export default function Items({ flashDeal, items, games }) {
    const [selectedGameId, setSelectedGameId] = useState('');
    const { data, setData, post, processing, errors, reset } = useForm({
        product_id: '',
        image: null,
        flash_price: '',
        stock: '',
        sort_order: 0,
    });

    const selectedGame = games.find((g) => g.id === Number(selectedGameId));

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.flash-deals.items.store', flashDeal.id), {
            forceFormData: true,
            onSuccess: () => { reset(); setSelectedGameId(''); },
        });
    };

    const destroy = (item) => {
        if (confirm(`Hapus "${item.product.name}" dari Flash Deal ini?`)) {
            router.delete(route('admin.flash-deals.items.destroy', [flashDeal.id, item.id]));
        }
    };

    return (
        <AdminLayout title={`Produk Flash Deal — ${flashDeal.title}`}>
            <Head title={`Produk ${flashDeal.title}`} />

            <Link href={route('admin.flash-deals.index')} className="adm-btn" style={{ marginBottom: 16, display: 'inline-block' }}>
                ← Kembali ke Flash Deal
            </Link>

            <div className="adm-card">
                <h3 style={{ marginTop: 0, marginBottom: 16, fontSize: 15 }}>Tambah Produk ke Flash Deal</h3>
                <form onSubmit={submit}>
                    <div className="adm-form-row">
                        <div className="adm-form-group">
                            <label>Pilih Game</label>
                            <select value={selectedGameId} onChange={(e) => { setSelectedGameId(e.target.value); setData('product_id', ''); }}>
                                <option value="">-- Pilih Game --</option>
                                {games.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                            </select>
                        </div>
                        <div className="adm-form-group">
                            <label>Pilih Nominal</label>
                            <select value={data.product_id} onChange={(e) => setData('product_id', e.target.value)} disabled={!selectedGame}>
                                <option value="">-- Pilih Nominal --</option>
                                {selectedGame?.products.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name} ({formatRupiah(p.price)})</option>
                                ))}
                            </select>
                            {errors.product_id && <p className="adm-error">{errors.product_id}</p>}
                        </div>
                    </div>

                    <div className="adm-form-row">
                        <div className="adm-form-group">
                            <label>Harga Flash Deal (Rp)</label>
                            <input type="number" value={data.flash_price} onChange={(e) => setData('flash_price', e.target.value)} />
                            {errors.flash_price && <p className="adm-error">{errors.flash_price}</p>}
                        </div>
                        <div className="adm-form-group">
                            <label>Stok / "Tersisa" (opsional, kosongkan kalau tidak dibatasi)</label>
                            <input type="number" value={data.stock} onChange={(e) => setData('stock', e.target.value)} />
                        </div>
                    </div>

                    <div className="adm-form-group">
                        <label>Gambar Kustom (opsional — kalau kosong, pakai icon mata uang game secara otomatis)</label>
                        <input type="file" accept="image/*" onChange={(e) => setData('image', e.target.files[0])} />
                    </div>

                    <button type="submit" disabled={processing} className="adm-btn adm-btn--primary">Tambahkan</button>
                </form>
            </div>

            <div className="adm-card">
                <table className="adm-table">
                    <thead>
                        <tr><th>Gambar</th><th>Game</th><th>Nominal</th><th>Harga Normal</th><th>Harga Flash Deal</th><th>Stok</th><th></th></tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    {item.image ? (
                                        <img src={`/storage/${item.image}`} alt={item.product.name} style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />
                                    ) : '-'}
                                </td>
                                <td>{item.product.game.name}</td>
                                <td>{item.product.name}</td>
                                <td style={{ textDecoration: 'line-through', color: '#9691b5' }}>{formatRupiah(item.product.price)}</td>
                                <td style={{ fontWeight: 700, color: '#15803d' }}>{formatRupiah(item.flash_price)}</td>
                                <td>{item.stock ?? '∞'}</td>
                                <td><button onClick={() => destroy(item)} className="adm-btn adm-btn--sm adm-btn--danger">Hapus</button></td>
                            </tr>
                        ))}
                        {items.length === 0 && (
                            <tr><td colSpan="7" style={{ textAlign: 'center', color: '#9691b5' }}>Belum ada produk di Flash Deal ini.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
