<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    use HasFactory;

    protected $fillable = [
        'image', 'badge_text', 'title', 'highlight_text', 'title_end', 'tagline',
        'promo_title', 'promo_subtitle', 'promo_discount_text', 'promo_period_text',
        'link_url', 'is_active', 'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
