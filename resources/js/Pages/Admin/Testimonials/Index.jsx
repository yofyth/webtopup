import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const emptyForm = { name: '', game_name: '', rating: 5, message: '', is_active: true, sort_order: 0, avatar: null };

export default function Index({ testimonials }) {
    const [editingId, setEditingId] = useState(null);
    const { data, setData, post, put, processing, errors, reset } = useForm(emptyForm);

    const startEdit = (t) => {
        setEditingId(t.id);
        setData({ name: t.name, game_name: t.game_name || '', rating: t.rating, message: t.message, is_active: t.is_active, sort_order: t.sort_order, avatar: null });
    };

    const cancelEdit = () => { setEditingId(null); reset(); };

    const submit = (e) => {
        e.preventDefault();
        if (editingId) {
            router.post(route('admin.testimonials.update', editingId), { ...data, _method: 'put' }, {
                forceFormData: true,
                onSuccess: () => { setEditingId(null); reset(); },
            });
        } else {
            post(route('admin.testimonials.store'), { forceFormData: true, onSuccess: () => reset() });
        }
    };

    const destroy = (t) => {
        if (confirm(`Hapus testimoni dari "${t.name}"?`)) {
            router.delete(route('admin.testimonials.destroy', t.id));
        }
    };

    return (
        <AdminLayout title="Kelola Testimoni">
            <Head title="Testimoni" />

            <div className="adm-card">
                <h3 style={{ marginTop: 0, marginBottom: 16, fontSize: 15 }}>{editingId ? 'Edit Testimoni' : 'Tambah Testimoni'}</h3>
                <form onSubmit={submit}>
                    <div className="adm-form-row">
                        <div className="adm-form-group">
                            <label>Nama</label>
                            <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            {errors.name && <p className="adm-error">{errors.name}</p>}
                        </div>
                        <div className="adm-form-group">
                            <label>Nama Game</label>
                            <input type="text" value={data.game_name} onChange={(e) => setData('game_name', e.target.value)} />
                        </div>
                    </div>
                    <div className="adm-form-row">
                        <div className="adm-form-group">
                            <label>Rating (1-5)</label>
                            <input type="number" min="1" max="5" value={data.rating} onChange={(e) => setData('rating', e.target.value)} />
                        </div>
                        <div className="adm-form-group">
                            <label>Foto (opsional)</label>
                            <input type="file" accept="image/*" onChange={(e) => setData('avatar', e.target.files[0])} />
                        </div>
                    </div>
                    <div className="adm-form-group">
                        <label>Pesan Testimoni</label>
                        <textarea rows="3" value={data.message} onChange={(e) => setData('message', e.target.value)} />
                        {errors.message && <p className="adm-error">{errors.message}</p>}
                    </div>
                    <div className="adm-form-group">
                        <label className="adm-checkbox">
                            <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                            Tampilkan di landing page
                        </label>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button type="submit" disabled={processing} className="adm-btn adm-btn--primary">{editingId ? 'Simpan' : 'Tambah'}</button>
                        {editingId && <button type="button" onClick={cancelEdit} className="adm-btn">Batal</button>}
                    </div>
                </form>
            </div>

            <div className="adm-card">
                <table className="adm-table">
                    <thead><tr><th>Nama</th><th>Game</th><th>Rating</th><th>Pesan</th><th>Status</th><th></th></tr></thead>
                    <tbody>
                        {testimonials.data.map((t) => (
                            <tr key={t.id}>
                                <td>{t.name}</td>
                                <td>{t.game_name}</td>
                                <td>{'★'.repeat(t.rating)}</td>
                                <td style={{ maxWidth: 280 }}>{t.message}</td>
                                <td><span className={`adm-badge adm-badge--${t.is_active ? 'active' : 'inactive'}`}>{t.is_active ? 'Aktif' : 'Nonaktif'}</span></td>
                                <td>
                                    <button onClick={() => startEdit(t)} className="adm-btn adm-btn--sm">Edit</button>{' '}
                                    <button onClick={() => destroy(t)} className="adm-btn adm-btn--sm adm-btn--danger">Hapus</button>
                                </td>
                            </tr>
                        ))}
                        {testimonials.data.length === 0 && (
                            <tr><td colSpan="6" style={{ textAlign: 'center', color: '#9691b5' }}>Belum ada testimoni.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
