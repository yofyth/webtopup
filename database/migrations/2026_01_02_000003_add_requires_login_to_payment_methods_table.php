<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tambah opsi kelompok 'wallet' khusus untuk metode "BagusCoins Wallet"
        DB::statement("ALTER TABLE payment_methods MODIFY `group` ENUM('ewallet','virtual_account','convenience_store','qris','wallet') NOT NULL DEFAULT 'ewallet'");

        Schema::table('payment_methods', function (Blueprint $table) {
            // true khusus untuk metode yang mengharuskan pembeli login (mis. Wallet)
            $table->boolean('requires_login')->default(false)->after('group');
        });
    }

    public function down(): void
    {
        Schema::table('payment_methods', function (Blueprint $table) {
            $table->dropColumn('requires_login');
        });

        DB::statement("ALTER TABLE payment_methods MODIFY `group` ENUM('ewallet','virtual_account','convenience_store','qris') NOT NULL DEFAULT 'ewallet'");
    }
};
