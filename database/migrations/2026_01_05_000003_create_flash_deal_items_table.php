<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('flash_deal_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('flash_deal_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('flash_price'); // harga khusus flash deal (lebih murah dari price normal)
            $table->unsignedInteger('stock')->nullable(); // "Tersisa: X" — kosongkan kalau tidak dibatasi
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('flash_deal_items');
    }
};
