import { Head, Link, router } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import '../../../css/welcome.css';

export default function Index({ games, search, settings }) {
    const submitSearch = (e) => {
        e.preventDefault();
        router.get(route('games.index'), { search: e.target.search.value }, { preserveState: true });
    };

    return (
        <GuestLayout settings={settings}>
            <Head title="Semua Game" />

            <div className="bc-wrap">
                <div className="bc-section" style={{ marginTop: 24 }}>
                    <div className="bc-section__head">
                        <h2>Semua Game</h2>
                    </div>

                    <form onSubmit={submitSearch} style={{ marginBottom: 20 }}>
                        <input
                            name="search"
                            defaultValue={search}
                            placeholder="Cari game..."
                            className="gp-input"
                            style={{ maxWidth: 320 }}
                        />
                    </form>

                    <div className="bc-game-grid">
                        {games.data.map((game) => (
                            <Link key={game.id} href={route('games.show', game.slug)} className="bc-game-card">
                                <div className="bc-game-card__icon">
                                    {game.icon ? (
                                        <img src={`/storage/${game.icon}`} alt={game.name} />
                                    ) : (
                                        <span style={{ fontSize: 22, fontWeight: 800, color: '#7c3aed' }}>{game.name.charAt(0)}</span>
                                    )}
                                </div>
                                <h4>{game.name}</h4>
                                <p>{game.genre}</p>
                            </Link>
                        ))}
                    </div>

                    {games.data.length === 0 && (
                        <p style={{ color: '#9691b5', marginTop: 20 }}>Game tidak ditemukan.</p>
                    )}
                </div>
            </div>
        </GuestLayout>
    );
}
