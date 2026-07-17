<?php

namespace Database\Seeders;

use App\Models\Game;
use Illuminate\Database\Seeder;

class GameSeeder extends Seeder
{
    public function run(): void
    {
        $games = [
            [
                'game' => [
                    'name' => 'Mobile Legends', 'publisher' => 'Moonton', 'genre' => 'MOBA',
                    'currency_name' => 'Diamond', 'needs_server_id' => true, 'rating' => 4.9,
                    'rating_count' => 128000, 'sort_order' => 1,
                ],
                'products' => [
                    ['name' => '86 Diamonds', 'base_amount' => 86, 'bonus_amount' => 0, 'bonus_percent' => 0, 'price' => 19500],
                    ['name' => '172 Diamonds', 'base_amount' => 172, 'bonus_amount' => 0, 'bonus_percent' => 0, 'price' => 38500],
                    ['name' => '257 Diamonds', 'base_amount' => 257, 'bonus_amount' => 0, 'bonus_percent' => 0, 'price' => 55000, 'is_popular' => true],
                    ['name' => '403 Diamonds', 'base_amount' => 403, 'bonus_amount' => 0, 'bonus_percent' => 0, 'price' => 87500],
                    ['name' => '568 Diamonds', 'base_amount' => 568, 'bonus_amount' => 0, 'bonus_percent' => 0, 'price' => 115000],
                ],
            ],
            [
                'game' => [
                    'name' => 'Free Fire', 'publisher' => 'Garena', 'genre' => 'Battle Royale',
                    'currency_name' => 'Diamond', 'needs_server_id' => false, 'rating' => 4.7,
                    'rating_count' => 98000, 'sort_order' => 2,
                ],
                'products' => [
                    ['name' => '55 Diamonds', 'base_amount' => 55, 'price' => 9500],
                    ['name' => '110 Diamonds', 'base_amount' => 110, 'price' => 19000],
                    ['name' => '165 Diamonds', 'base_amount' => 165, 'price' => 28000, 'is_popular' => true],
                    ['name' => '355 Diamonds', 'base_amount' => 355, 'price' => 58000],
                ],
            ],
            [
                'game' => [
                    'name' => 'PUBG Mobile', 'publisher' => 'PUBG', 'genre' => 'Battle Royale',
                    'currency_name' => 'UC', 'needs_server_id' => false, 'rating' => 4.8,
                    'rating_count' => 87000, 'sort_order' => 3,
                ],
                'products' => [
                    ['name' => '60 UC', 'base_amount' => 60, 'price' => 15000],
                    ['name' => '325 UC', 'base_amount' => 325, 'price' => 75000, 'is_popular' => true],
                    ['name' => '660 UC', 'base_amount' => 660, 'price' => 150000],
                ],
            ],
            [
                'game' => [
                    'name' => 'Genshin Impact', 'publisher' => 'HoYoverse', 'genre' => 'RPG',
                    'currency_name' => 'Genesis Crystal', 'needs_server_id' => true, 'rating' => 4.9,
                    'rating_count' => 65000, 'sort_order' => 4,
                ],
                'products' => [
                    ['name' => '60 Genesis Crystal', 'base_amount' => 60, 'price' => 16000],
                    ['name' => '330 Genesis Crystal', 'base_amount' => 330, 'price' => 79000, 'is_popular' => true],
                    ['name' => '1090 Genesis Crystal', 'base_amount' => 1090, 'price' => 249000],
                ],
            ],
            [
                'game' => [
                    'name' => 'Honor of Kings', 'publisher' => 'Level Infinite', 'genre' => 'MOBA',
                    'currency_name' => 'Token', 'needs_server_id' => false, 'rating' => 4.6,
                    'rating_count' => 32000, 'sort_order' => 5,
                ],
                'products' => [
                    ['name' => '80 Token', 'base_amount' => 80, 'price' => 15000],
                    ['name' => '400 Token', 'base_amount' => 400, 'price' => 72000, 'is_popular' => true],
                ],
            ],
            [
                'game' => [
                    'name' => 'Valorant', 'publisher' => 'Riot Games', 'genre' => 'FPS',
                    'currency_name' => 'Points', 'needs_server_id' => false, 'rating' => 4.7,
                    'rating_count' => 54000, 'sort_order' => 6,
                ],
                'products' => [
                    ['name' => '420 Points', 'base_amount' => 420, 'price' => 55000],
                    ['name' => '2050 Points', 'base_amount' => 2050, 'price' => 260000, 'is_popular' => true],
                ],
            ],
            [
                'game' => [
                    'name' => 'Blood Strike', 'publisher' => 'NetEase', 'genre' => 'FPS',
                    'currency_name' => 'Gold', 'needs_server_id' => false, 'rating' => 4.9,
                    'rating_count' => 65070, 'sort_order' => 7, 'is_featured' => false,
                ],
                'products' => [
                    ['name' => '100 + 5 Gold', 'base_amount' => 100, 'bonus_amount' => 5, 'bonus_percent' => 9, 'price' => 13473, 'is_popular' => true],
                    ['name' => '300 + 20 Gold', 'base_amount' => 300, 'bonus_amount' => 20, 'bonus_percent' => 17, 'price' => 40415],
                    ['name' => '500 + 40 Gold', 'base_amount' => 500, 'bonus_amount' => 40, 'bonus_percent' => 25, 'price' => 67359],
                    ['name' => '1000 + 100 Gold', 'base_amount' => 1000, 'bonus_amount' => 100, 'bonus_percent' => 34, 'price' => 134717],
                    ['name' => '2000 + 200 Gold', 'base_amount' => 2000, 'bonus_amount' => 200, 'bonus_percent' => 36, 'price' => 269433],
                    ['name' => '5000 + 800 Gold', 'base_amount' => 5000, 'bonus_amount' => 800, 'bonus_percent' => 40, 'price' => 673582],
                ],
            ],
        ];

        foreach ($games as $index => $entry) {
            $game = Game::updateOrCreate(
                ['slug' => \Illuminate\Support\Str::slug($entry['game']['name'])],
                $entry['game'] + ['slug' => \Illuminate\Support\Str::slug($entry['game']['name'])]
            );

            foreach ($entry['products'] as $i => $product) {
                $game->products()->updateOrCreate(
                    ['name' => $product['name']],
                    $product + ['sort_order' => $i, 'is_active' => true]
                );
            }

            // Semua game masuk kategori "Game"; 4 game pertama juga ditandai "Populer".
            $categorySlugs = $index < 4 ? ['game', 'populer'] : ['game'];
            $categoryIds = \App\Models\Category::whereIn('slug', $categorySlugs)->pluck('id');
            $game->categories()->syncWithoutDetaching($categoryIds);
        }
    }
}
