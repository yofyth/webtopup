<?php

use App\Http\Controllers\Account\DashboardController as AccountDashboardController;
use App\Http\Controllers\Account\WalletController;
use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FlashDealController;
use App\Http\Controllers\Admin\FlashDealItemController;
use App\Http\Controllers\Admin\GameController as AdminGameController;
use App\Http\Controllers\Admin\PaymentMethodController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\TransactionController as AdminTransactionController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| RUTE PUBLIK (landing page, katalog game, checkout guest/login opsional)
|--------------------------------------------------------------------------
*/
Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/games', [GameController::class, 'index'])->name('games.index');
Route::get('/games/{game:slug}', [GameController::class, 'show'])->name('games.show');

Route::post('/checkout', [TransactionController::class, 'store'])->name('transactions.store');
Route::get('/transaksi/{invoice}', [TransactionController::class, 'show'])->name('transactions.show');
Route::post('/transaksi/{invoice}/simulasi-bayar', [TransactionController::class, 'simulatePay'])->name('transactions.simulate-pay');
Route::get('/cek-transaksi', [TransactionController::class, 'lookup'])->name('transactions.lookup');
Route::post('/callback/tripay', [TransactionController::class, 'callback'])->name('transactions.callback'); // disiapkan, belum aktif

// Alias supaya redirect bawaan Breeze setelah login (route 'dashboard') tetap berfungsi.
// Admin diarahkan ke panel admin, customer diarahkan ke halaman akun mereka.
Route::get('/dashboard', function () {
    $user = request()->user();

    return $user->isAdmin()
        ? redirect()->route('admin.dashboard')
        : redirect()->route('account.dashboard');
})->middleware(['auth'])->name('dashboard');

/*
|--------------------------------------------------------------------------
| AREA AKUN PEMBELI (opsional login — dashboard, riwayat transaksi, wallet)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->prefix('akun')->name('account.')->group(function () {
    Route::get('/', [AccountDashboardController::class, 'index'])->name('dashboard');
    Route::get('/transaksi', [AccountDashboardController::class, 'transactions'])->name('transactions');

    Route::get('/wallet/isi-saldo', [WalletController::class, 'create'])->name('wallet.create');
    Route::post('/wallet/isi-saldo', [WalletController::class, 'store'])->name('wallet.store');
    Route::get('/wallet/isi-saldo/{invoice}', [WalletController::class, 'show'])->name('wallet.show');
    Route::post('/wallet/isi-saldo/{invoice}/simulasi-bayar', [WalletController::class, 'simulatePay'])->name('wallet.simulate-pay');
});

/*
|--------------------------------------------------------------------------
| AUTH & AREA ADMIN (CMS)
| 'admin.only' membatasi akses hanya untuk role admin/staff — WAJIB
| didaftarkan sebagai alias middleware di bootstrap/app.php (lihat README).
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'admin.only'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('banners', BannerController::class)->except(['show']);
    Route::resource('flash-deals', FlashDealController::class)->except(['show']);
    Route::resource('flash-deals.items', FlashDealItemController::class)->except(['create', 'edit', 'show']);
    Route::resource('games', AdminGameController::class)->except(['show']);
    Route::resource('games.products', ProductController::class)->except(['create', 'edit', 'show']);

    Route::get('transactions', [AdminTransactionController::class, 'index'])->name('transactions.index');
    Route::get('transactions/{transaction}', [AdminTransactionController::class, 'show'])->name('transactions.show');
    Route::patch('transactions/{transaction}/status', [AdminTransactionController::class, 'updateStatus'])->name('transactions.update-status');

    Route::resource('testimonials', TestimonialController::class)->except(['create', 'edit', 'show']);
    Route::resource('payment-methods', PaymentMethodController::class)->except(['create', 'edit', 'show']);

    Route::get('settings', [SettingController::class, 'index'])->name('settings.index');
    Route::patch('settings', [SettingController::class, 'update'])->name('settings.update');
});

require __DIR__.'/auth.php'; // dari starter kit Breeze (login/register — dipakai admin & customer)
