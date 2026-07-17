<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            CategorySeeder::class,
            GameSeeder::class,
            PaymentMethodSeeder::class,
            TestimonialSeeder::class,
            SettingSeeder::class,
            BannerSeeder::class,
            FlashDealSeeder::class,
        ]);
    }
}
