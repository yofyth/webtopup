<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Game;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class GameController extends Controller
{
    public function index(): Response
    {
        $games = Game::query()
            ->withCount('products')
            ->with('categories:id,name,slug')
            ->orderBy('sort_order')
            ->paginate(15);

        return Inertia::render('Admin/Games/Index', ['games' => $games]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Games/Create', [
            'categories' => Category::orderBy('sort_order')->get(['id', 'name', 'slug']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateGame($request);
        $validated['slug'] = Str::slug($validated['name']);
        $categoryIds = $validated['category_ids'] ?? [];
        unset($validated['category_ids']);

        if ($request->hasFile('icon')) {
            $validated['icon'] = $request->file('icon')->store('games/icons', 'public');
        }
        if ($request->hasFile('banner')) {
            $validated['banner'] = $request->file('banner')->store('games/banners', 'public');
        }
        if ($request->hasFile('currency_icon')) {
            $validated['currency_icon'] = $request->file('currency_icon')->store('games/currency-icons', 'public');
        }
        if ($request->hasFile('user_id_guide_image')) {
            $validated['user_id_guide_image'] = $request->file('user_id_guide_image')->store('games/guides', 'public');
        }

        $game = Game::create($validated);
        $game->categories()->sync($categoryIds);

        return redirect()->route('admin.games.index')->with('success', 'Game berhasil ditambahkan.');
    }

    public function edit(Game $game): Response
    {
        $game->load('products');
        $game->load('categories:id');

        return Inertia::render('Admin/Games/Edit', [
            'game' => $game,
            'categories' => Category::orderBy('sort_order')->get(['id', 'name', 'slug']),
            'selectedCategoryIds' => $game->categories->pluck('id'),
        ]);
    }

    public function update(Request $request, Game $game): RedirectResponse
    {
        $validated = $this->validateGame($request, $game->id);
        $validated['slug'] = Str::slug($validated['name']);
        $categoryIds = $validated['category_ids'] ?? [];
        unset($validated['category_ids']);

        if ($request->hasFile('icon')) {
            $validated['icon'] = $request->file('icon')->store('games/icons', 'public');
        }
        if ($request->hasFile('banner')) {
            $validated['banner'] = $request->file('banner')->store('games/banners', 'public');
        }
        if ($request->hasFile('currency_icon')) {
            $validated['currency_icon'] = $request->file('currency_icon')->store('games/currency-icons', 'public');
        }
        if ($request->hasFile('user_id_guide_image')) {
            $validated['user_id_guide_image'] = $request->file('user_id_guide_image')->store('games/guides', 'public');
        }

        $game->update($validated);
        $game->categories()->sync($categoryIds);

        return redirect()->route('admin.games.index')->with('success', 'Game berhasil diperbarui.');
    }

    public function destroy(Game $game): RedirectResponse
    {
        $game->delete();

        return back()->with('success', 'Game berhasil dihapus.');
    }

    protected function validateGame(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'publisher' => ['nullable', 'string', 'max:100'],
            'genre' => ['nullable', 'string', 'max:100'],
            'icon' => ['nullable', 'image', 'max:2048'],
            'banner' => ['nullable', 'image', 'max:4096'],
            'currency_icon' => ['nullable', 'image', 'max:1024'],
            'user_id_guide_image' => ['nullable', 'image', 'max:2048'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'rating_count' => ['nullable', 'integer', 'min:0'],
            'currency_name' => ['required', 'string', 'max:50'],
            'needs_server_id' => ['boolean'],
            'is_active' => ['boolean'],
            'is_featured' => ['boolean'],
            'sort_order' => ['nullable', 'integer'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['exists:categories,id'],
        ]);
    }
}
