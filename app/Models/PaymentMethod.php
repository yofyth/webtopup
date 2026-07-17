<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use HasFactory;

    protected $fillable = [
        'code', 'name', 'group', 'logo', 'fee_flat', 'fee_percent',
        'requires_login', 'is_active', 'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'requires_login' => 'boolean',
    ];

    /**
     * Hitung biaya admin untuk nominal harga tertentu.
     */
    public function calculateFee(int $price): int
    {
        $percentFee = (int) round($price * ((float) $this->fee_percent / 100));

        return $this->fee_flat + $percentFee;
    }
}
