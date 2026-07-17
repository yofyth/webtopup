<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(Request $request): Response
    {
        $transactions = Transaction::query()
            ->with(['game:id,name', 'product:id,name', 'paymentMethod:id,name', 'user:id,name'])
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->when($request->search, function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->where('invoice_number', 'like', "%{$search}%")
                        ->orWhere('user_game_id', 'like', "%{$search}%")
                        ->orWhere('whatsapp_number', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Transactions/Index', [
            'transactions' => $transactions,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function show(Transaction $transaction): Response
    {
        $transaction->load(['game', 'product', 'paymentMethod']);

        return Inertia::render('Admin/Transactions/Show', ['transaction' => $transaction]);
    }

    /**
     * Update status manual oleh admin (mis. menandai "success" setelah verifikasi manual,
     * atau "failed" jika bermasalah). Untuk kasus normal, status akan berubah otomatis
     * lewat callback Tripay setelah integrasi asli aktif.
     */
    public function updateStatus(Request $request, Transaction $transaction): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,paid,processing,success,failed,expired'],
        ]);

        $transaction->update([
            'status' => $validated['status'],
            'paid_at' => $validated['status'] === 'success' ? now() : $transaction->paid_at,
        ]);

        return back()->with('success', 'Status transaksi berhasil diperbarui.');
    }
}
