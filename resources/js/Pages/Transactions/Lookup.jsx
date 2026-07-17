import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import '../../../css/transaction.css';
import '../../../css/game-show.css';
import '../../../css/layout.css';

export default function Lookup({ notFound }) {
    const { data, setData, get, processing } = useForm({
        invoice_number: '',
    });

    const submit = (e) => {
        e.preventDefault();
        get(route('transactions.lookup'), { preserveState: true });
    };

    return (
        <GuestLayout>
            <Head title="Cek Transaksi" />

            <div className="tx-wrap">
                <div className="tx-card">
                    <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Cek Transaksi</h2>
                    <p style={{ fontSize: 13, color: '#8a85a3', marginBottom: 20 }}>
                        Masukkan nomor invoice untuk melacak status pesanan kamu (sudah masuk atau masih pending).
                    </p>

                    <form onSubmit={submit} className="tx-lookup-form">
                        <input
                            className="gp-input"
                            placeholder="Nomor Invoice (contoh: BC-20260706-ABCDEF)"
                            value={data.invoice_number}
                            onChange={(e) => setData('invoice_number', e.target.value)}
                            autoFocus
                        />
                        <button type="submit" className="bc-btn-primary" disabled={processing} style={{ padding: 12 }}>
                            Cari Transaksi
                        </button>
                    </form>

                    {notFound && (
                        <div className="tx-note">Transaksi tidak ditemukan. Pastikan nomor invoice sudah benar.</div>
                    )}
                </div>
            </div>
        </GuestLayout>
    );
}
