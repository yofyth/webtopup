import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const GROUPS = [
    { value: 'ewallet', label: 'E-Wallet' },
    { value: 'virtual_account', label: 'Virtual Account' },
    { value: 'convenience_store', label: 'Convenience Store' },
    { value: 'qris', label: 'QRIS' },
];

const emptyForm = { code: '', name: '', group: 'ewallet', fee_flat: 0, fee_percent: 0, is_active: true, sort_order: 0, logo: null };

export default function Index({ paymentMethods }) {
    const [editingId, setEditingId] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm(emptyForm);

    const startEdit = (m) => {
        setEditingId(m.id);
        setData({ code: m.code, name: m.name, group: m.group, fee_flat: m.fee_flat, fee_percent: m.fee_percent, is_active: m.is_active, sort_order: m.sort_order, logo: null });
    };

    const cancelEdit = () => { setEditingId(null); reset(); };

    const submit = (e) => {
        e.preventDefault();
        if (editingId) {
            router.post(route('admin.payment-methods.update', editingId), { ...data, _method: 'put' }, {
                forceFormData: true,
                onSuccess: () => { setEditingId(null); reset(); },
            });
        } else {
            post(route('admin.payment-methods.store'), { forceFormData: true, onSuccess: () => reset() });
        }
    };

    const destroy = (m) => {
        if (confirm(`Hapus metode pembayaran "${m.name}"?`)) {
            router.delete(route('admin.payment-methods.destroy', m.id));
        }
    };

    return (
        <AdminLayout title="Metode Pembayaran">
            <Head title="Metode Pembayaran" />

            <div className="adm-card">
                <h3 style={{ marginTop: 0, marginBottom: 16, fontSize: 15 }}>{editingId ? 'Edit Metode' : 'Tambah Metode Pembayaran'}</h3>
                <form onSubmit={submit}>
                    <div className="adm-form-row">
                        <div className="adm-form-group">
                            <label>Kode (unik, mis. DANA, BCAVA)</label>
                            <input type="text" value={data.code} onChange={(e) => setData('code', e.target.value.toUpperCase())} />
                            {errors.code && <p className="adm-error">{errors.code}</p>}
                        </div>
                        <div className="adm-form-group">
                            <label>Nama Tampil</label>
                            <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            {errors.name && <p className="adm-error">{errors.name}</p>}
                        </div>
                    </div>
                    <div className="adm-form-row">
                        <div className="adm-form-group">
                            <label>Kelompok</label>
                            <select value={data.group} onChange={(e) => setData('group', e.target.value)}>
                                {GROUPS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
                            </select>
                        </div>
                        <div className="adm-form-group">
                            <label>Logo (opsional)</label>
                            <input type="file" accept="image/*" onChange={(e) => setData('logo', e.target.files[0])} />
                        </div>
                    </div>
                    <div className="adm-form-row">
                        <div className="adm-form-group">
                            <label>Biaya Admin Flat (Rp)</label>
                            <input type="number" value={data.fee_flat} onChange={(e) => setData('fee_flat', e.target.value)} />
                        </div>
                        <div className="adm-form-group">
                            <label>Biaya Admin Persen (%)</label>
                            <input type="number" step="0.01" value={data.fee_percent} onChange={(e) => setData('fee_percent', e.target.value)} />
                        </div>
                    </div>
                    <div className="adm-form-group">
                        <label className="adm-checkbox">
                            <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                            Aktif (tampil di halaman top up)
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
                    <thead><tr><th>Kode</th><th>Nama</th><th>Kelompok</th><th>Biaya</th><th>Status</th><th></th></tr></thead>
                    <tbody>
                        {paymentMethods.map((m) => (
                            <tr key={m.id}>
                                <td>{m.code}</td>
                                <td>{m.name}</td>
                                <td>{GROUPS.find((g) => g.value === m.group)?.label}</td>
                                <td>{m.fee_flat > 0 ? `Rp ${m.fee_flat}` : `${m.fee_percent}%`}</td>
                                <td><span className={`adm-badge adm-badge--${m.is_active ? 'active' : 'inactive'}`}>{m.is_active ? 'Aktif' : 'Nonaktif'}</span></td>
                                <td>
                                    <button onClick={() => startEdit(m)} className="adm-btn adm-btn--sm">Edit</button>{' '}
                                    <button onClick={() => destroy(m)} className="adm-btn adm-btn--sm adm-btn--danger">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
