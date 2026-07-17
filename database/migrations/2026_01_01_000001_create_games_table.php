<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->string('name');                 // Mobile Legends
            $table->string('slug')->unique();        // mobile-legends
            $table->string('publisher')->nullable(); // Moonton
            $table->string('genre')->nullable();      // MOBA
            $table->string('icon')->nullable();       // path icon kotak (untuk grid game)
            $table->string('banner')->nullable();     // path banner (untuk halaman detail)
            $table->decimal('rating', 2, 1)->default(4.8);
            $table->unsignedInteger('rating_count')->default(0); // "65.07rb Rating"
            $table->string('currency_name')->default('Diamond'); // nama satuan mata uang game: Diamond, Gold, UC, dst
            $table->boolean('needs_server_id')->default(false); // ML butuh Zone ID, game lain mungkin tidak
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(true); // tampil di "Pilih Game Favorit"
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};
