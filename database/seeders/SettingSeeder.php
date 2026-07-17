<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            'site_name' => 'BagusCoins',
            'hero_badge' => 'TOPUP GAME',
            'hero_title' => 'TOP UP GAME',
            'hero_highlight' => 'FAVORITMU',
            'hero_title_end' => 'DISINI',
            'hero_tagline' => 'Cepat • Aman • Terpercaya',
            'promo_title' => 'EVENT SPESIAL',
            'promo_subtitle' => 'STARLIGHT JULI 2026',
            'promo_discount_text' => 'DISKON HINGGA 20%',
            'promo_period_text' => 'PERIODE TERBATAS!',
            'stat_active_users' => '50K+',
            'stat_success_rate' => '99.9%',
            'whatsapp_cs' => '6281234567890',
            'instagram_url' => 'https://instagram.com',
            'whatsapp_url' => 'https://wa.me/6281234567890',
            'discord_url' => 'https://discord.com',
            'youtube_url' => 'https://youtube.com',
        ];

        foreach ($settings as $key => $value) {
            Setting::set($key, $value);
        }
    }
}
