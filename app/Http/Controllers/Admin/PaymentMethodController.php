<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentMethod;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentMethodController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/PaymentMethods/Index', [
            'paymentMethods' => PaymentMethod::orderBy('sort_order')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->rules($request);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('payment-methods', 'public');
        }

        PaymentMethod::create($validated);

        return back()->with('success', 'Metode pembayaran berhasil ditambahkan.');
    }

    public function update(Request $request, PaymentMethod $paymentMethod): RedirectResponse
    {
        $validated = $this->rules($request, $paymentMethod->id);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('payment-methods', 'public');
        }

        $paymentMethod->update($validated);

        return back()->with('success', 'Metode pembayaran berhasil diperbarui.');
    }

    public function destroy(PaymentMethod $paymentMethod): RedirectResponse
    {
        $paymentMethod->delete();

        return back()->with('success', 'Metode pembayaran berhasil dihapus.');
    }

    protected function rules(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'code' => ['required', 'string', 'max:30', 'unique:payment_methods,code' . ($ignoreId ? ",{$ignoreId}" : '')],
            'name' => ['required', 'string', 'max:100'],
            'group' => ['required', 'in:ewallet,virtual_account,convenience_store,qris'],
            'logo' => ['nullable', 'image', 'max:1024'],
            'fee_flat' => ['nullable', 'integer', 'min:0'],
            'fee_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer'],
        ]);
    }
}
