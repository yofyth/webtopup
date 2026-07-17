<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Game $game): Response
    {
        return Inertia::render('Admin/Products/Index', [
            'game' => $game,
            'products' => $game->products,
        ]);
    }

    public function store(Request $request, Game $game): RedirectResponse
    {
        $validated = $this->validateProduct($request);
        $validated['game_id'] = $game->id;

        Product::create($validated);

        return back()->with('success', 'Nominal top up berhasil ditambahkan.');
    }

    public function update(Request $request, Game $game, Product $product): RedirectResponse
    {
        $product->update($this->validateProduct($request));

        return back()->with('success', 'Nominal top up berhasil diperbarui.');
    }

    public function destroy(Game $game, Product $product): RedirectResponse
    {
        $product->delete();

        return back()->with('success', 'Nominal top up berhasil dihapus.');
    }

    protected function validateProduct(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'base_amount' => ['required', 'integer', 'min:0'],
            'bonus_amount' => ['nullable', 'integer', 'min:0'],
            'bonus_percent' => ['nullable', 'integer', 'min:0', 'max:100'],
            'price' => ['required', 'integer', 'min:0'],
            'strike_price' => ['nullable', 'integer', 'min:0'],
            'is_popular' => ['boolean'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer'],
        ]);
    }
}
