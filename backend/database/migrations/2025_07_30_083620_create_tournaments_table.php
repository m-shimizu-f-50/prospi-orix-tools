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
        Schema::create('tournaments', function (Blueprint $table) {
            $table->id(); // 大会ID
            $table->string('name'); // 大会名
            $table->string('slug')->unique(); // 一意なスラッグ（URLなどに使う）
            $table->string('type')->default('tournament'); // 'rank' or 'tournament'
            $table->date('start_date')->nullable(); // 開始日
            $table->date('end_date')->nullable();   // 終了日
            $table->unsignedInteger('win')->default(0); // 勝利数
            $table->unsignedInteger('lose')->default(0); // 敗北数
            $table->timestamps(); // created_at, updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tournaments');
    }
};
