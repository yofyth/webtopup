<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number', 'merchant_ref', 'tripay_reference',
        'user_id', 'game_id', 'product_id', 'payment_method_id',
        'user_game_id', 'user_server_id', 'whatsapp_number', 'email',
        'product_name', 'base_amount', 'bonus_amount', 'price', 'admin_fee', 'total_amount',
        'promo_code', 'discount_amount',
        'status', 'qr_url', 'pay_code', 'paid_at', 'expired_at', 'callback_payload',
    ];

    protected $casts = [
        'paid_at' => 'datetime',
        'expired_at' => 'datetime',
        'callback_payload' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    public function isFinal(): bool
    {
        return in_array($this->status, ['success', 'failed', 'expired']);
    }
}
