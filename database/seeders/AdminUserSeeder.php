<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@baguscoins.test'],
            [
                'name' => 'Admin BagusCoins',
                'password' => Hash::make('password'), // GANTI setelah login pertama kali
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );
    }
}
