<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Populer', 'slug' => 'populer', 'sort_order' => 1],
            ['name' => 'Game', 'slug' => 'game', 'sort_order' => 2],
            ['name' => 'Voucher', 'slug' => 'voucher', 'sort_order' => 3],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(['slug' => $category['slug']], $category);
        }
    }
}
