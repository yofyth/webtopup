import { useMemo, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AccountLayout from '@/Layouts/AccountLayout';
import '../../../css/game-show.css';
import '../../../css/layout.css';

const PAY_GROUP_LABELS = {
    ewallet: 'E-Wallet',
    virtual_account: 'Virtual Account',
    convenience_store: 'Convenience Store',
    qris: 'QRIS (All Payment)',
};

const QUICK_AMOUNTS = [20000, 50000, 100000, 200000, 500000, 1000000];

function formatRupiah(value) {
    return 'Rp ' + Number(value || 0).toLocaleString('id-ID');
}

export default function WalletTopup({ paymentMethods, walletBalance }) {
    const [selectedMethod, setSelectedMethod] = useState(null);
    const { data, setData, post, processing, errors } = useForm({
        amount: '',
        payment_method_id: '',
    });

    const adminFee = useMemo(() => {
        if (!selectedMethod || !data.amount) return 0;
        const flat = Number(selectedMethod.fee_flat || 0);
        const percent = Number(selectedMethod.fee_percent || 0);
        return Math.round(flat + Number(data.amount) * (percent / 100));
    }, [selectedMethod, data.amount]);

    const total = Number(data.amount || 0) + adminFee;

    const submit = (e) => {
        e.preventDefault();
        post(route('account.wallet.store'));
    };

    return (
        <AccountLayout active="wallet">
            <Head title="Isi Saldo Wallet" />

            <div className="acc-wallet-layout">
                <form onSubmit={submit}>
                    <div className="acc-card">
                        <h3 style={{ marginTop: 0, marginBottom: 4, fontSize: 15 }}>Isi Saldo BagusCoins Wallet</h3>
                        <p style={{ fontSize: 12, color: '#8a85a3', marginTop: 0, marginBottom: 16 }}>
                            Saldo saat ini: <strong>{formatRupiah(walletBalance)}</strong>
                        </p>

                        <div className="acc-amount-grid">
                            {QUICK_AMOUNTS.map((amt) => (
                                <button
                                    type="button"
                                    key={amt}
                                    className={`acc-amount-option ${Number(data.amount) === amt ? 'selected' : ''}`}
                                    onClick={() => setData('amount', amt)}
                                >
                                    {formatRupiah(amt)}
                                </button>
                            ))}
                        </div>

                        <input
                            type="number"
                            min="10000"
                            className="gp-input"
                            placeholder="Atau masukkan nominal lain (min. Rp 10.000)"
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                        />
                        {errors.amount && <p className="gp-error">{errors.amount}</p>}
                    </div>

                    <div className="acc-card">
                        <h3 style={{ marginTop: 0, marginBottom: 16, fontSize: 15 }}>Pilih Metode Pembayaran</h3>
                        {Object.entries(paymentMethods).map(([group, methods]) => (
                            <div key={group}>
                                <div className="gp-pay-group-label">{PAY_GROUP_LABELS[group] || group}</div>
                                <div className="gp-pay-grid">
                                    {methods.map((method) => (
                                        <button
                                            type="button"
                                            key={method.id}
                                            className={`gp-pay-option ${selectedMethod?.id === method.id ? 'selected' : ''}`}
                                            onClick={() => { setSelectedMethod(method); setData('payment_method_id', method.id); }}
                                        >
                                            {method.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {errors.payment_method_id && <p className="gp-error">{errors.payment_method_id}</p>}
                    </div>
                </form>

                <div className="acc-card">
                    <h3 style={{ marginTop: 0, marginBottom: 16, fontSize: 15 }}>Ringkasan</h3>
                    <div className="gp-summary-row"><span>Nominal Isi Saldo</span><span>{formatRupiah(data.amount)}</span></div>
                    <div className="gp-summary-row"><span>Biaya Admin</span><span>{formatRupiah(adminFee)}</span></div>
                    <div className="gp-summary-total">
                        <span>Total Bayar</span>
                        <strong>{formatRupiah(total)}</strong>
                    </div>
                    <button
                        onClick={submit}
                        disabled={processing || !data.amount || !selectedMethod}
                        className="bc-btn-primary"
                        style={{ width: '100%', marginTop: 16, padding: 12 }}
                    >
                        Isi Saldo Sekarang
                    </button>
                </div>
            </div>
        </AccountLayout>
    );
}
