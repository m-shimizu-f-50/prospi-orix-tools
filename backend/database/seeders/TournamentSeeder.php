<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Tournament;

class TournamentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ランク戦のデータを作成
        Tournament::create([
            'name' => 'ランク戦',
            'slug' => 'rank-2025',
            'type' => 'rank',
            'win' => 0,
            'lose' => 0,
        ]);
    }
}
