<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->string('image')->nullable();  // kalau kosong, fallback ke gradient ungu bawaan
            $table->string('badge_text')->nullable();      // "TOPUP GAME"
            $table->string('title')->nullable();            // "TOP UP GAME"
            $table->string('highlight_text')->nullable();   // "FAVORITMU" (disorot warna)
            $table->string('title_end')->nullable();        // "DISINI"
            $table->string('tagline')->nullable();           // "Cepat • Aman • Terpercaya"

            // Kotak promo di kanan (opsional, kosongkan kalau tidak perlu)
            $table->string('promo_title')->nullable();          // "EVENT SPESIAL"
            $table->string('promo_subtitle')->nullable();       // "STARLIGHT JULI 2026"
            $table->string('promo_discount_text')->nullable();  // "DISKON HINGGA 20%"
            $table->string('promo_period_text')->nullable();    // "PERIODE TERBATAS!"

            $table->string('link_url')->nullable(); // kalau diisi, banner bisa diklik menuju URL ini
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('banners');
    }
};
