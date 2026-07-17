<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FlashDeal;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FlashDealController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/FlashDeals/Index', [
            'flashDeals' => FlashDeal::withCount('items')->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/FlashDeals/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->rules($request);

        if ($request->hasFile('banner_image')) {
            $validated['banner_image'] = $request->file('banner_image')->store('flash-deals', 'public');
        }

        $flashDeal = FlashDeal::create($validated);

        return redirect()->route('admin.flash-deals.items.index', $flashDeal->id)
            ->with('success', 'Flash Deal berhasil dibuat. Sekarang tambahkan produknya.');
    }

    public function edit(FlashDeal $flashDeal): Response
    {
        return Inertia::render('Admin/FlashDeals/Edit', ['flashDeal' => $flashDeal]);
    }

    public function update(Request $request, FlashDeal $flashDeal): RedirectResponse
    {
        $validated = $this->rules($request);

        if ($request->hasFile('banner_image')) {
            $validated['banner_image'] = $request->file('banner_image')->store('flash-deals', 'public');
        }

        $flashDeal->update($validated);

        return redirect()->route('admin.flash-deals.index')->with('success', 'Flash Deal berhasil diperbarui.');
    }

    public function destroy(FlashDeal $flashDeal): RedirectResponse
    {
        $flashDeal->delete();

        return back()->with('success', 'Flash Deal berhasil dihapus.');
    }

    protected function rules(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:100'],
            'banner_image' => ['nullable', 'image', 'max:4096'],
            'ends_at' => ['required', 'date'],
            'is_active' => ['boolean'],
        ]);
    }
}
