<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique(); // BC-20260706-XXXXX, dipakai user untuk cek transaksi (guest)
            $table->string('merchant_ref')->unique();    // referensi ke Tripay (merchant_ref)
            $table->string('tripay_reference')->nullable(); // reference dari Tripay (simulasi: TRP-xxxx)

            $table->foreignId('game_id')->constrained();
            $table->foreignId('product_id')->constrained();
            $table->foreignId('payment_method_id')->constrained();

            $table->string('user_game_id');           // User ID akun game pembeli
            $table->string('user_server_id')->nullable(); // Zone ID / Server ID (jika needs_server_id)
            $table->string('whatsapp_number');          // untuk guest, dipakai cek transaksi + notifikasi

            $table->string('product_name');            // snapshot nama produk saat transaksi dibuat
            $table->unsignedBigInteger('base_amount');
            $table->unsignedBigInteger('bonus_amount');
            $table->unsignedBigInteger('price');         // harga produk
            $table->unsignedBigInteger('admin_fee')->default(0);
            $table->unsignedBigInteger('total_amount');   // price + admin_fee

            $table->string('promo_code')->nullable();
            $table->unsignedBigInteger('discount_amount')->default(0);

            $table->enum('status', ['pending', 'paid', 'processing', 'success', 'failed', 'expired'])
                ->default('pending');

            $table->string('qr_url')->nullable();       // simulasi QRIS
            $table->string('pay_code')->nullable();      // simulasi kode VA / kode bayar
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->json('callback_payload')->nullable(); // simpan payload callback simulasi Tripay
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
