<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WalletTopup extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'payment_method_id', 'invoice_number', 'merchant_ref', 'tripay_reference',
        'amount', 'admin_fee', 'total_amount', 'status',
        'qr_url', 'pay_code', 'paid_at', 'expired_at', 'callback_payload',
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

    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    public function isFinal(): bool
    {
        return in_array($this->status, ['success', 'failed', 'expired']);
    }
}
