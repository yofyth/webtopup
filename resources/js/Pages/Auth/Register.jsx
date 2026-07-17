import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import '../../../css/auth.css';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Daftar" />

            <div className="auth-wrap">
                <div className="auth-card">
                    <div className="auth-card__logo">
                        <span>BC</span>
                        <h2>Buat Akun Baru</h2>
                        <p>Opsional — kamu tetap bisa top up tanpa akun (guest checkout)</p>
                    </div>

                    <form onSubmit={submit}>
                        <div className="auth-field">
                            <label>Nama</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                autoFocus
                                autoComplete="name"
                            />
                            {errors.name && <p className="auth-error">{errors.name}</p>}
                        </div>

                        <div className="auth-field">
                            <label>Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
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
                                autoComplete="new-password"
                            />
                            {errors.password && <p className="auth-error">{errors.password}</p>}
                        </div>

                        <div className="auth-field">
                            <label>Konfirmasi Password</label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                autoComplete="new-password"
                            />
                            {errors.password_confirmation && <p className="auth-error">{errors.password_confirmation}</p>}
                        </div>

                        <button type="submit" disabled={processing} className="auth-submit" style={{ marginTop: 4 }}>
                            Daftar
                        </button>

                        <div className="auth-links" style={{ justifyContent: 'center' }}>
                            <Link href={route('login')}>Sudah punya akun? Masuk</Link>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
