<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FlashDeal;
use App\Models\FlashDealItem;
use App\Models\Game;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FlashDealItemController extends Controller
{
    public function index(FlashDeal $flashDeal): Response
    {
        return Inertia::render('Admin/FlashDeals/Items', [
            'flashDeal' => $flashDeal,
            'items' => $flashDeal->items()->with('product.game:id,name')->get(),
            'games' => Game::where('is_active', true)->with('products:id,game_id,name,price')->orderBy('sort_order')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request, FlashDeal $flashDeal): RedirectResponse
    {
        $validated = $this->rules($request);
        $validated['flash_deal_id'] = $flashDeal->id;

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('flash-deals/items', 'public');
        }

        FlashDealItem::create($validated);

        return back()->with('success', 'Produk berhasil ditambahkan ke Flash Deal.');
    }

    public function update(Request $request, FlashDeal $flashDeal, FlashDealItem $item): RedirectResponse
    {
        $validated = $this->rules($request);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('flash-deals/items', 'public');
        }

        $item->update($validated);

        return back()->with('success', 'Item Flash Deal berhasil diperbarui.');
    }

    public function destroy(FlashDeal $flashDeal, FlashDealItem $item): RedirectResponse
    {
        $item->delete();

        return back()->with('success', 'Produk berhasil dihapus dari Flash Deal.');
    }

    protected function rules(Request $request): array
    {
        return $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'image' => ['nullable', 'image', 'max:2048'],
            'flash_price' => ['required', 'integer', 'min:0'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'sort_order' => ['nullable', 'integer'],
        ]);
    }
}
