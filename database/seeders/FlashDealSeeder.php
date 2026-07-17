<?php

namespace Database\Seeders;

use App\Models\FlashDeal;
use App\Models\Product;
use Illuminate\Database\Seeder;

class FlashDealSeeder extends Seeder
{
    public function run(): void
    {
        $flashDeal = FlashDeal::updateOrCreate(
            ['title' => 'Flash Deal Hari Ini'],
            [
                'title' => 'Flash Deal Hari Ini',
                'ends_at' => now()->addHours(6),
                'is_active' => true,
            ]
        );

        // Ambil beberapa produk acak untuk contoh, beri harga flash ~10-15% lebih murah
        $sampleProducts = Product::inRandomOrder()->limit(5)->get();

        foreach ($sampleProducts as $i => $product) {
            $flashDeal->items()->updateOrCreate(
                ['product_id' => $product->id],
                [
                    'flash_price' => (int) round($product->price * 0.87, -2),
                    'stock' => random_int(5, 25),
                    'sort_order' => $i,
                ]
            );
        }
    }
}
