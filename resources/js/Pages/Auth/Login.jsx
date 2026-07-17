import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import '../../../css/auth.css';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk" />

            <div className="auth-wrap">
                <div className="auth-card">
                    <div className="auth-card__logo">
                        <span>BC</span>
                        <h2>Masuk ke Akun</h2>
                        <p>Login untuk melihat riwayat transaksi &amp; saldo wallet kamu</p>
                    </div>

                    {status && <div className="auth-status">{status}</div>}

                    <form onSubmit={submit}>
                        <div className="auth-field">
                            <label>Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                autoFocus
                                autoComplete="username"
                            />
                            {errors.email && <p className="auth-error">{errors.email}</p>}
                        </div>

                        <div className="auth-field">
                            <label>Password</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                autoComplete="current-password"
                            />
                            {errors.password && <p className="auth-error">{errors.password}</p>}
                        </div>

                        <label className="auth-checkbox">
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            Ingat saya
                        </label>

                        <button type="submit" disabled={processing} className="auth-submit">
                            Masuk
                        </button>

                        <div className="auth-links">
                            {canResetPassword && <Link href={route('password.request')}>Lupa password?</Link>}
                            <Link href={route('register')}>Belum punya akun? Daftar</Link>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
