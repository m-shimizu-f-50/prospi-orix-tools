<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('player_stats', function (Blueprint $table) {
            $table->id();

            $table->foreignId('player_id')->constrained()->onDelete('cascade');      // 選手
            $table->foreignId('tournament_id')->constrained()->onDelete('cascade');  // 大会

            $table->enum('position_type', ['batter', 'pitcher']); // 成績の種別

            // 共通：ポジション格付け
            $table->unsignedTinyInteger('order')->nullable(); // 1〜9番などの順番（ベンチはnull）
            $table->boolean('is_bench')->default(false);       // ベンチかどうか

            // 野手成績
            $table->unsignedInteger('at_bats')->nullable();     // 打数
            $table->unsignedInteger('hits')->nullable();        // 安打
            $table->unsignedInteger('doubles')->nullable();     // 2塁打
            $table->unsignedInteger('triples')->nullable();     // 3塁打
            $table->unsignedInteger('home_runs')->nullable();   // 本塁打
            $table->unsignedInteger('rbi')->nullable();         // 打点

            // 投手成績
            $table->unsignedInteger('wins')->nullable();        // 勝利
            $table->unsignedInteger('losses')->nullable();      // 敗北
            $table->unsignedInteger('saves')->nullable();       // セーブ数

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('player_stats');
    }
};

