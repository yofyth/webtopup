<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Testimonials/Index', [
            'testimonials' => Testimonial::orderBy('sort_order')->paginate(15),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->rules($request);

        if ($request->hasFile('avatar')) {
            $validated['avatar'] = $request->file('avatar')->store('testimonials', 'public');
        }

        Testimonial::create($validated);

        return back()->with('success', 'Testimoni berhasil ditambahkan.');
    }

    public function update(Request $request, Testimonial $testimonial): RedirectResponse
    {
        $validated = $this->rules($request);

        if ($request->hasFile('avatar')) {
            $validated['avatar'] = $request->file('avatar')->store('testimonials', 'public');
        }

        $testimonial->update($validated);

        return back()->with('success', 'Testimoni berhasil diperbarui.');
    }

    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->delete();

        return back()->with('success', 'Testimoni berhasil dihapus.');
    }

    protected function rules(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'avatar' => ['nullable', 'image', 'max:2048'],
            'game_name' => ['nullable', 'string', 'max:100'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'message' => ['required', 'string', 'max:1000'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer'],
        ]);
    }
}
