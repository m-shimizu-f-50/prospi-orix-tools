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
        Schema::create('players', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('position');
            $table->enum('type', ['batter', 'pitcher']);
            $table->integer('spirit');
            $table->tinyInteger('limit_break');
    
            // batter用
            $table->decimal('average', 5, 3)->nullable();
            $table->string('trajectory')->nullable();
            $table->integer('meet')->nullable();
            $table->integer('power')->nullable();
            $table->integer('speed')->nullable();
    
            // pitcher用
            $table->decimal('era', 4, 2)->nullable();
            $table->integer('velocity')->nullable();
            $table->integer('control')->nullable();
            $table->integer('stamina')->nullable();
    
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('players');
    }
};
