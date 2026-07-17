import { Head, useForm } from '@inertiajs/react';
import '../../../css/admin.css';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f6fc' }}>
            <Head title="Masuk - Admin" />

            <div className="adm-card" style={{ width: 380 }}>
                <div style={{ textAlign: 'center', marginBottom: 22 }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 12, margin: '0 auto 12px',
                        background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800,
                    }}>BC</div>
                    <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: '#1b1533' }}>Masuk ke CMS</h2>
                    <p style={{ fontSize: 12, color: '#8a85a3', marginTop: 4 }}>BagusCoins Admin Panel</p>
                </div>

                {status && <div className="adm-flash">{status}</div>}

                <form onSubmit={submit}>
                    <div className="adm-form-group">
                        <label>Email</label>
                        <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} autoFocus />
                        {errors.email && <p className="adm-error">{errors.email}</p>}
                    </div>
                    <div className="adm-form-group">
                        <label>Password</label>
                        <input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                        {errors.password && <p className="adm-error">{errors.password}</p>}
                    </div>
                    <label className="adm-checkbox" style={{ marginBottom: 16 }}>
                        <input type="checkbox" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} />
                        Ingat saya
                    </label>
                    <button type="submit" disabled={processing} className="adm-btn adm-btn--primary" style={{ width: '100%', justifyContent: 'center' }}>
                        Masuk
                    </button>
                </form>
            </div>
        </div>
    );
}
