<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wallet_topups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('payment_method_id')->constrained();

            $table->string('invoice_number')->unique();
            $table->string('merchant_ref')->unique();
            $table->string('tripay_reference')->nullable();

            $table->unsignedBigInteger('amount');       // jumlah saldo yang diisi
            $table->unsignedBigInteger('admin_fee')->default(0);
            $table->unsignedBigInteger('total_amount');  // amount + admin_fee (yang harus dibayar)

            $table->enum('status', ['pending', 'paid', 'success', 'failed', 'expired'])->default('pending');

            $table->string('qr_url')->nullable();
            $table->string('pay_code')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->json('callback_payload')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wallet_topups');
    }
};
