<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('games', function (Blueprint $table) {
            // Screenshot panduan menemukan User ID/Zone ID, tampil sebagai popup saat ikon "?" di-klik
            $table->string('user_id_guide_image')->nullable()->after('needs_server_id');
        });
    }

    public function down(): void
    {
        Schema::table('games', function (Blueprint $table) {
            $table->dropColumn('user_id_guide_image');
        });
    }
};
