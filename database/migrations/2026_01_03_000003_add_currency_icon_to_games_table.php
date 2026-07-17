<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('games', function (Blueprint $table) {
            // Icon mata uang (Diamond/Gold/UC/dst) yang ditampilkan di kartu nominal.
            // Kalau kosong, front-end fallback ke emoji berdasarkan currency_name.
            $table->string('currency_icon')->nullable()->after('currency_name');
        });
    }

    public function down(): void
    {
        Schema::table('games', function (Blueprint $table) {
            $table->dropColumn('currency_icon');
        });
    }
};
