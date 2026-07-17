<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'game_id', 'name', 'base_amount', 'bonus_amount', 'bonus_percent',
        'price', 'strike_price', 'is_popular', 'is_active', 'sort_order',
    ];

    protected $casts = [
        'is_popular' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }

    public function getFormattedPriceAttribute(): string
    {
        return 'Rp ' . number_format($this->price, 0, ',', '.');
    }
}
