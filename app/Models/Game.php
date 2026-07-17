<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'publisher', 'genre', 'icon', 'banner',
        'rating', 'rating_count', 'currency_name', 'currency_icon', 'needs_server_id',
        'user_id_guide_image', 'is_active', 'is_featured', 'sort_order',
    ];

    protected $casts = [
        'needs_server_id' => 'boolean',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'rating' => 'decimal:1',
    ];

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class)->orderBy('sort_order');
    }

    public function activeProducts(): HasMany
    {
        return $this->products()->where('is_active', true);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
