<?php

namespace Database\Seeders;

use App\Models\Banner;
use Illuminate\Database\Seeder;

class BannerSeeder extends Seeder
{
    public function run(): void
    {
        $banners = [
            [
                'badge_text' => 'TOPUP GAME',
                'title' => 'TOP UP GAME',
                'highlight_text' => 'FAVORITMU',
                'title_end' => 'DISINI',
                'tagline' => 'Cepat • Aman • Terpercaya',
                'promo_title' => 'EVENT SPESIAL',
                'promo_subtitle' => 'STARLIGHT JULI 2026',
                'promo_discount_text' => 'DISKON HINGGA 20%',
                'promo_period_text' => 'PERIODE TERBATAS!',
                'sort_order' => 1,
            ],
            [
                'badge_text' => 'PROMO MINGGU INI',
                'title' => 'BEBAS ADMIN',
                'highlight_text' => 'SEMUA E-WALLET',
                'title_end' => '',
                'tagline' => 'Cepat • Aman • Terpercaya',
                'promo_title' => 'GRATIS BIAYA ADMIN',
                'promo_subtitle' => 'KHUSUS E-WALLET',
                'promo_discount_text' => 'HEMAT HINGGA Rp5.000',
                'promo_period_text' => 'BERLAKU SETIAP HARI!',
                'sort_order' => 2,
            ],
        ];

        foreach ($banners as $banner) {
            Banner::updateOrCreate(['title' => $banner['title'], 'sort_order' => $banner['sort_order']], $banner);
        }
    }
}
