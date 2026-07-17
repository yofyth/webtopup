<?php

namespace App\Http\Controllers;

use App\Models\FlashDealItem;
use App\Models\Game;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GameController extends Controller
{
    /**
     * Halaman katalog seluruh game (dipanggil dari "Lihat Semua Game").
     */
    public function index(Request $request): Response
    {
        $games = Game::query()
            ->where('is_active', true)
            ->when($request->search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%");
            })
            ->orderBy('sort_order')
            ->paginate(24)
            ->withQueryString();

        return Inertia::render('Games/Index', [
            'games' => $games,
            'search' => $request->search,
        ]);
    }

    /**
     * Halaman detail game + form top up (mengikuti desain gambar 2).
     */
    public function show(Game $game): Response
    {
        abort_unless($game->is_active, 404);

        $game->load(['activeProducts']);

        // Sematkan harga Flash Deal aktif (kalau ada & stok masih tersedia) ke tiap nominal,
        // supaya harga yang tampil di halaman top up SAMA dengan yang dipromosikan di landing page.
        $activeFlashItems = FlashDealItem::whereHas('flashDeal', function ($q) {
                $q->where('is_active', true)->where('ends_at', '>', now());
            })
            ->whereIn('product_id', $game->activeProducts->pluck('id'))
            ->get()
            ->keyBy('product_id');

        $products = $game->activeProducts->map(function ($product) use ($activeFlashItems) {
            $flashItem = $activeFlashItems->get($product->id);
            $hasStock = !$flashItem || $flashItem->stock === null || $flashItem->stock > 0;
            $product->flash_price = ($flashItem && $hasStock) ? $flashItem->flash_price : null;

            return $product;
        });

        $paymentMethods = PaymentMethod::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->groupBy('group');

        return Inertia::render('Games/Show', [
            'game' => $game,
            'products' => $products,
            'paymentMethods' => $paymentMethods,
        ]);
    }
}
