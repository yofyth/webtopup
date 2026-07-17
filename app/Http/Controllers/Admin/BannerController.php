<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BannerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Banners/Index', [
            'banners' => Banner::orderBy('sort_order')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Banners/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->rules($request);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('banners', 'public');
        }

        Banner::create($validated);

        return redirect()->route('admin.banners.index')->with('success', 'Banner berhasil ditambahkan.');
    }

    public function edit(Banner $banner): Response
    {
        return Inertia::render('Admin/Banners/Edit', ['banner' => $banner]);
    }

    public function update(Request $request, Banner $banner): RedirectResponse
    {
        $validated = $this->rules($request);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('banners', 'public');
        }

        $banner->update($validated);

        return redirect()->route('admin.banners.index')->with('success', 'Banner berhasil diperbarui.');
    }

    public function destroy(Banner $banner): RedirectResponse
    {
        $banner->delete();

        return back()->with('success', 'Banner berhasil dihapus.');
    }

    protected function rules(Request $request): array
    {
        return $request->validate([
            'image' => ['nullable', 'image', 'max:4096'],
            'badge_text' => ['nullable', 'string', 'max:100'],
            'title' => ['nullable', 'string', 'max:150'],
            'highlight_text' => ['nullable', 'string', 'max:150'],
            'title_end' => ['nullable', 'string', 'max:150'],
            'tagline' => ['nullable', 'string', 'max:150'],
            'promo_title' => ['nullable', 'string', 'max:150'],
            'promo_subtitle' => ['nullable', 'string', 'max:150'],
            'promo_discount_text' => ['nullable', 'string', 'max:150'],
            'promo_period_text' => ['nullable', 'string', 'max:150'],
            'link_url' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer'],
        ]);
    }
}
