<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $testimonials = [
            ['name' => 'Rizky A.', 'game_name' => 'Mobile Legends', 'rating' => 5, 'message' => 'Proses top up cepat banget, diamond langsung masuk kurang dari 1 menit!', 'sort_order' => 1],
            ['name' => 'Dewi S.', 'game_name' => 'Free Fire', 'rating' => 5, 'message' => 'Harga paling murah dibanding tempat lain, sudah langganan dari tahun lalu.', 'sort_order' => 2],
            ['name' => 'Fajar P.', 'game_name' => 'PUBG Mobile', 'rating' => 4, 'message' => 'Pembayaran lengkap, ada QRIS jadi gampang banget bayarnya.', 'sort_order' => 3],
            ['name' => 'Nadia R.', 'game_name' => 'Genshin Impact', 'rating' => 5, 'message' => 'CS-nya responsif waktu ada kendala transaksi, cepat dibantu.', 'sort_order' => 4],
            ['name' => 'Budi H.', 'game_name' => 'Valorant', 'rating' => 5, 'message' => 'Top up Valorant Points paling worth it di sini, sering ada diskon.', 'sort_order' => 5],
            ['name' => 'Sinta M.', 'game_name' => 'Blood Strike', 'rating' => 5, 'message' => 'Bonus gold-nya lumayan gede kalau beli nominal besar, mantap!', 'sort_order' => 6],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::updateOrCreate(['name' => $testimonial['name'], 'game_name' => $testimonial['game_name']], $testimonial);
        }
    }
}
