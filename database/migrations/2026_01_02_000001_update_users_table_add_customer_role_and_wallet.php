<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tambah role 'customer' (default untuk pendaftaran publik lewat /register)
        DB::statement("ALTER TABLE users MODIFY role ENUM('admin','staff','customer') NOT NULL DEFAULT 'customer'");

        Schema::table('users', function (Blueprint $table) {
            // Saldo "BagusCoins Wallet" dalam Rupiah (integer, tanpa desimal)
            $table->unsignedBigInteger('wallet_balance')->default(0)->after('role');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('wallet_balance');
        });

        DB::statement("ALTER TABLE users MODIFY role ENUM('admin','staff') NOT NULL DEFAULT 'staff'");
    }
};
