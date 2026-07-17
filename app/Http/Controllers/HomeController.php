<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\Category;
use App\Models\FlashDeal;
use App\Models\Game;
use App\Models\Product;
use App\Models\Setting;
use App\Models\Testimonial;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        // Kategori (Populer, Game, Voucher) & banner aktif
        $categories = Category::orderBy('sort_order')->get(['id', 'name', 'slug']);

        // Semua game aktif beserta kategori yang di-assign (dipakai untuk filter tab di landing page)
        $games = Game::query()
            ->where('is_active', true)
            ->with('categories:id,slug')
            ->orderBy('sort_order')
            ->get(['id', 'name', 'slug', 'genre', 'icon']);

        $gamesWithCategories = $games->map(fn ($game) => [
            'id' => $game->id,
            'name' => $game->name,
            'slug' => $game->slug,
            'genre' => $game->genre,
            'icon' => $game->icon,
            'category_slugs' => $game->categories->pluck('slug'),
        ]);

        // "Top Up Populer": ambil produk lintas game untuk carousel otomatis
        $popularProducts = Product::query()
            ->with('game:id,name,slug,currency_name,currency_icon')
            ->where('is_active', true)
            ->orderByDesc('is_popular')
            ->orderBy('sort_order')
            ->limit(15)
            ->get([
                'id', 'game_id', 'name', 'base_amount', 'bonus_amount',
                'bonus_percent', 'price', 'strike_price', 'is_popular',
            ]);

        $banners = Banner::where('is_active', true)->orderBy('sort_order')->get();

        // Flash Deal aktif (kalau lebih dari satu, ambil yang paling baru dibuat)
        $flashDeal = FlashDeal::where('is_active', true)
            ->where('ends_at', '>', now())
            ->with(['items.product.game:id,name,slug,currency_name,currency_icon'])
            ->latest()
            ->first();

        $testimonials = Testimonial::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->limit(6)
            ->get();

        return Inertia::render('Welcome', [
            'banners' => $banners,
            'flashDeal' => $flashDeal,
            'categories' => $categories,
            'games' => $gamesWithCategories,
            'popularProducts' => $popularProducts,
            'testimonials' => $testimonials,
            'settings' => Setting::allAsArray(),
        ]);
    }
}
