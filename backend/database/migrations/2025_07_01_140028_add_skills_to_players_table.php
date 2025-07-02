<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('players', function (Blueprint $table) {
            $table->string('skill1')->after('stamina')->nullable(); // 第一特能（超〇〇）
            $table->string('skill2')->after('skill1')->nullable(); // 第二特能（通常）
            $table->string('skill3')->after('skill2')->nullable(); // 第三特能（通常）
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('players', function (Blueprint $table) {
            //
        });
    }
};
