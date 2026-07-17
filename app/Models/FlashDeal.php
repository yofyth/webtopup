<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FlashDeal extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'banner_image', 'ends_at', 'is_active'];

    protected $casts = [
        'ends_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(FlashDealItem::class)->orderBy('sort_order');
    }
}
