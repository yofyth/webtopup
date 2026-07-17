<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $today = now()->startOfDay();

        $stats = [
            'total_games' => Game::count(),
            'total_transactions' => Transaction::count(),
            'transactions_today' => Transaction::where('created_at', '>=', $today)->count(),
            'revenue_today' => (int) Transaction::where('status', 'success')
                ->where('paid_at', '>=', $today)
                ->sum('total_amount'),
            'revenue_month' => (int) Transaction::where('status', 'success')
                ->where('paid_at', '>=', now()->startOfMonth())
                ->sum('total_amount'),
            'pending_transactions' => Transaction::where('status', 'pending')->count(),
        ];

        $recentTransactions = Transaction::with(['game:id,name', 'product:id,name'])
            ->latest()
            ->limit(10)
            ->get(['id', 'invoice_number', 'game_id', 'product_id', 'total_amount', 'status', 'created_at']);

        $topGames = Transaction::select('game_id', DB::raw('count(*) as total'))
            ->where('status', 'success')
            ->groupBy('game_id')
            ->orderByDesc('total')
            ->with('game:id,name')
            ->limit(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentTransactions' => $recentTransactions,
            'topGames' => $topGames,
        ]);
    }
}
