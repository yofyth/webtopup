<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Settings/Index', [
            'settings' => Setting::allAsArray(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'site_name' => ['nullable', 'string', 'max:100'],
            'site_logo' => ['nullable', 'image', 'max:1024'],
            'hero_badge' => ['nullable', 'string', 'max:100'],       // "TOPUP GAME"
            'hero_title' => ['nullable', 'string', 'max:150'],        // "TOP UP GAME"
            'hero_highlight' => ['nullable', 'string', 'max:150'],    // "FAVORITMU"
            'hero_title_end' => ['nullable', 'string', 'max:150'],    // "DISINI"
            'hero_tagline' => ['nullable', 'string', 'max:150'],      // "Cepat . Aman . Terpercaya"
            'promo_title' => ['nullable', 'string', 'max:150'],       // "EVENT SPESIAL"
            'promo_subtitle' => ['nullable', 'string', 'max:150'],    // "STARLIGHT JULI 2026"
            'promo_discount_text' => ['nullable', 'string', 'max:150'], // "DISKON HINGGA 20%"
            'promo_period_text' => ['nullable', 'string', 'max:150'], // "PERIODE TERBATAS!"
            'stat_active_users' => ['nullable', 'string', 'max:50'],   // "50K+"
            'stat_success_rate' => ['nullable', 'string', 'max:50'],   // "99.9%"
            'whatsapp_cs' => ['nullable', 'string', 'max:30'],
            'instagram_url' => ['nullable', 'string', 'max:255'],
            'whatsapp_url' => ['nullable', 'string', 'max:255'],
            'discord_url' => ['nullable', 'string', 'max:255'],
            'youtube_url' => ['nullable', 'string', 'max:255'],
        ]);

        if ($request->hasFile('site_logo')) {
            $validated['site_logo'] = $request->file('site_logo')->store('settings', 'public');
        } else {
            unset($validated['site_logo']); // jangan timpa logo lama kalau tidak upload baru
        }

        foreach ($validated as $key => $value) {
            Setting::set($key, $value);
        }

        return back()->with('success', 'Pengaturan berhasil disimpan.');
    }
}
