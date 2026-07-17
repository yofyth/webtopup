import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ settings }) {
    const { data, setData, post, processing } = useForm({
        _method: 'patch',
        site_name: settings.site_name || '',
        site_logo: null,
        hero_badge: settings.hero_badge || '',
        hero_title: settings.hero_title || '',
        hero_highlight: settings.hero_highlight || '',
        hero_title_end: settings.hero_title_end || '',
        hero_tagline: settings.hero_tagline || '',
        promo_title: settings.promo_title || '',
        promo_subtitle: settings.promo_subtitle || '',
        promo_discount_text: settings.promo_discount_text || '',
        promo_period_text: settings.promo_period_text || '',
        stat_active_users: settings.stat_active_users || '',
        stat_success_rate: settings.stat_success_rate || '',
        whatsapp_cs: settings.whatsapp_cs || '',
        instagram_url: settings.instagram_url || '',
        whatsapp_url: settings.whatsapp_url || '',
        discord_url: settings.discord_url || '',
        youtube_url: settings.youtube_url || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'), { forceFormData: true });
    };

    const field = (key, label) => (
        <div className="adm-form-group">
            <label>{label}</label>
            <input type="text" value={data[key]} onChange={(e) => setData(key, e.target.value)} />
        </div>
    );

    return (
        <AdminLayout title="Pengaturan Situs">
            <Head title="Pengaturan" />

            <form onSubmit={submit}>
                <div className="adm-card">
                    <h3 style={{ marginTop: 0, fontSize: 15 }}>Umum</h3>
                    {field('site_name', 'Nama Situs')}
                    <div className="adm-form-group">
                        <label>Logo Situs (opsional — kalau kosong, pakai lambang huruf pertama nama situs)</label>
                        {settings.site_logo && (
                            <img src={`/storage/${settings.site_logo}`} alt="Logo saat ini" style={{ width: 48, height: 48, borderRadius: 10, marginBottom: 8, display: 'block' }} />
                        )}
                        <input type="file" accept="image/*" onChange={(e) => setData('site_logo', e.target.files[0])} />
                    </div>
                </div>

                <div className="adm-card">
                    <h3 style={{ marginTop: 0, fontSize: 15 }}>Hero / Banner Utama</h3>
                    <div className="adm-form-row">
                        {field('hero_badge', 'Badge (mis. "TOPUP GAME")')}
                        {field('hero_tagline', 'Tagline (mis. "Cepat • Aman • Terpercaya")')}
                    </div>
                    <div className="adm-form-row">
                        {field('hero_title', 'Baris judul 1')}
                        {field('hero_highlight', 'Baris judul 2 (disorot warna)')}
                    </div>
                    {field('hero_title_end', 'Baris judul 3')}
                </div>

                <div className="adm-card">
                    <h3 style={{ marginTop: 0, fontSize: 15 }}>Kartu Promo (kanan hero)</h3>
                    <div className="adm-form-row">
                        {field('promo_title', 'Judul Kecil (mis. "EVENT SPESIAL")')}
                        {field('promo_subtitle', 'Judul Besar (mis. "STARLIGHT JULI 2026")')}
                    </div>
                    <div className="adm-form-row">
                        {field('promo_discount_text', 'Teks Diskon (mis. "DISKON HINGGA 20%")')}
                        {field('promo_period_text', 'Teks Periode (mis. "PERIODE TERBATAS!")')}
                    </div>
                </div>

                <div className="adm-card">
                    <h3 style={{ marginTop: 0, fontSize: 15 }}>Statistik</h3>
                    <div className="adm-form-row">
                        {field('stat_active_users', 'Pelanggan Aktif (mis. "50K+")')}
                        {field('stat_success_rate', 'Transaksi Berhasil (mis. "99.9%")')}
                    </div>
                </div>

                <div className="adm-card">
                    <h3 style={{ marginTop: 0, fontSize: 15 }}>Kontak &amp; Sosial Media</h3>
                    {field('whatsapp_cs', 'Nomor WhatsApp CS (62xxxxxxxxxx)')}
                    <div className="adm-form-row">
                        {field('instagram_url', 'Link Instagram')}
                        {field('whatsapp_url', 'Link WhatsApp')}
                    </div>
                    <div className="adm-form-row">
                        {field('discord_url', 'Link Discord')}
                        {field('youtube_url', 'Link YouTube')}
                    </div>
                </div>

                <button type="submit" disabled={processing} className="adm-btn adm-btn--primary">Simpan Pengaturan</button>
            </form>
        </AdminLayout>
    );
}
