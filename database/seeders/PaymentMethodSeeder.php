<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use Illuminate\Database\Seeder;

class PaymentMethodSeeder extends Seeder
{
    public function run(): void
    {
        $methods = [
            // Wallet situs (khusus pembeli yang login)
            ['code' => 'WALLET', 'name' => 'BagusCoins Wallet', 'group' => 'wallet', 'fee_flat' => 0, 'fee_percent' => 0, 'requires_login' => true, 'sort_order' => 0],

            // E-Wallet
            ['code' => 'OVO', 'name' => 'OVO', 'group' => 'ewallet', 'fee_flat' => 0, 'fee_percent' => 1.5, 'sort_order' => 1],
            ['code' => 'DANA', 'name' => 'DANA', 'group' => 'ewallet', 'fee_flat' => 0, 'fee_percent' => 1.5, 'sort_order' => 2],
            ['code' => 'GOPAY', 'name' => 'GoPay', 'group' => 'ewallet', 'fee_flat' => 0, 'fee_percent' => 2, 'sort_order' => 3],
            ['code' => 'SHOPEEPAY', 'name' => 'ShopeePay', 'group' => 'ewallet', 'fee_flat' => 0, 'fee_percent' => 2, 'sort_order' => 4],
            ['code' => 'LINKAJA', 'name' => 'LinkAja', 'group' => 'ewallet', 'fee_flat' => 0, 'fee_percent' => 1.5, 'sort_order' => 5],

            // Virtual Account
            ['code' => 'BCAVA', 'name' => 'BCA', 'group' => 'virtual_account', 'fee_flat' => 4000, 'fee_percent' => 0, 'sort_order' => 6],
            ['code' => 'MANDIRIVA', 'name' => 'Mandiri', 'group' => 'virtual_account', 'fee_flat' => 4000, 'fee_percent' => 0, 'sort_order' => 7],
            ['code' => 'BRIVA', 'name' => 'BRI', 'group' => 'virtual_account', 'fee_flat' => 4000, 'fee_percent' => 0, 'sort_order' => 8],
            ['code' => 'BNIVA', 'name' => 'BNI', 'group' => 'virtual_account', 'fee_flat' => 4000, 'fee_percent' => 0, 'sort_order' => 9],
            ['code' => 'CIMBVA', 'name' => 'CIMB Niaga', 'group' => 'virtual_account', 'fee_flat' => 4000, 'fee_percent' => 0, 'sort_order' => 10],
            ['code' => 'PERMATAVA', 'name' => 'PermataBank', 'group' => 'virtual_account', 'fee_flat' => 4000, 'fee_percent' => 0, 'sort_order' => 11],

            // Convenience Store
            ['code' => 'ALFAMART', 'name' => 'Alfamart', 'group' => 'convenience_store', 'fee_flat' => 2500, 'fee_percent' => 0, 'sort_order' => 12],
            ['code' => 'INDOMARET', 'name' => 'Indomaret', 'group' => 'convenience_store', 'fee_flat' => 2500, 'fee_percent' => 0, 'sort_order' => 13],

            // QRIS
            ['code' => 'QRIS', 'name' => 'QRIS (All Payment)', 'group' => 'qris', 'fee_flat' => 0, 'fee_percent' => 0.7, 'sort_order' => 14],
        ];

        foreach ($methods as $method) {
            PaymentMethod::updateOrCreate(['code' => $method['code']], $method);
        }
    }
}
