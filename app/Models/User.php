<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'wallet_balance',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'wallet_balance' => 'integer',
        ];
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function walletTopups(): HasMany
    {
        return $this->hasMany(WalletTopup::class);
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, ['admin', 'staff']);
    }

    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }

    /**
     * Tambah saldo wallet (dipanggil saat top up berhasil).
     */
    public function depositWallet(int $amount): void
    {
        $this->increment('wallet_balance', $amount);
    }

    /**
     * Kurangi saldo wallet (dipanggil saat checkout pakai Wallet).
     * Return false kalau saldo tidak cukup (tidak mengurangi apa pun).
     */
    public function withdrawWallet(int $amount): bool
    {
        if ($this->wallet_balance < $amount) {
            return false;
        }

        $this->decrement('wallet_balance', $amount);

        return true;
    }
}
