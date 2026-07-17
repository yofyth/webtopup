<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();  // kode dipakai untuk Tripay: QRIS, BRIVA, DANAVA, dll
            $table->string('name');             // Nama tampil: "DANA", "BCA Virtual Account"
            $table->enum('group', ['ewallet', 'virtual_account', 'convenience_store', 'qris'])->default('ewallet');
            $table->string('logo')->nullable();
            $table->unsignedBigInteger('fee_flat')->default(0);   // biaya admin flat (Rp)
            $table->decimal('fee_percent', 5, 2)->default(0);      // biaya admin persen
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_methods');
    }
};
