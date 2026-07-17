<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Setiap game punya daftar nominal top up sendiri (fleksibel, beda-beda per game)
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained()->cascadeOnDelete();
            $table->string('name');            // "100 + 5 Gold" / "86 Diamonds"
            $table->unsignedBigInteger('base_amount'); // jumlah dasar mata uang game, mis 100
            $table->unsignedBigInteger('bonus_amount')->default(0); // bonus, mis 5
            $table->unsignedInteger('bonus_percent')->default(0); // 9%, 17%, dst (untuk label badge)
            $table->unsignedBigInteger('price'); // harga dalam rupiah (integer, tanpa desimal)
            $table->unsignedBigInteger('strike_price')->nullable(); // harga coret (promo), opsional
            $table->boolean('is_popular')->default(false); // badge "MOST POPULAR"
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
