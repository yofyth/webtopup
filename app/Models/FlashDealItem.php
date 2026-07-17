<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FlashDealItem extends Model
{
    use HasFactory;

    protected $fillable = ['flash_deal_id', 'product_id', 'image', 'flash_price', 'stock', 'sort_order'];

    public function flashDeal(): BelongsTo
    {
        return $this->belongsTo(FlashDeal::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
