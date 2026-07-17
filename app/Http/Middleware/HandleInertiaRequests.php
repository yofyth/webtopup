<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Data yang dibagikan secara default ke SEMUA halaman Inertia (publik & admin),
     * supaya tidak perlu di-pass manual satu-satu dari tiap controller.
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'settings' => fn () => Setting::allAsArray(),
            'auth' => fn () => [
                'user' => $request->user(),
            ],
            'flash' => fn () => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ];
    }
}
