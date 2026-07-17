<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $recentTransactions = $user->transactions()
            ->with(['game:id,name,icon', 'product:id,name'])
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('Account/Dashboard', [
            'recentTransactions' => $recentTransactions,
            'totalTransactions' => $user->transactions()->count(),
        ]);
    }

    public function transactions(Request $request): Response
    {
        $transactions = $request->user()->transactions()
            ->with(['game:id,name,icon', 'product:id,name', 'paymentMethod:id,name'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Account/Transactions', [
            'transactions' => $transactions,
        ]);
    }
}
