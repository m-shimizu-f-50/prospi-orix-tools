<?php

namespace App\Http\Controllers;

use App\Models\Player;
use App\Models\Tournament;
use App\Models\PlayerStat;
use Illuminate\Http\Request;

class PlayerController extends Controller
{
    /**
     * 選手一覧を取得するAPI
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $players = Player::all();
        return response()->json($players);
    }

    /**
     * 選手を作成するAPI
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        // 空文字 → null
        $request->merge(array_map(function ($value) {
            return $value === '' ? null : $value;
        }, $request->all()));

        // バリデーション
        $data = $request->validate([
            'name' => 'required|string',
            'position' => 'required|string',
            'series' => 'nullable|string',
            'type' => 'required|in:batter,pitcher',
            'spirit' => 'required|integer',
            'limit_break' => 'required|integer',
            'skill1' => 'nullable|integer',
            'skill2' => 'nullable|integer',
            'skill3' => 'nullable|integer',

            // batter
            'average' => 'nullable|numeric',
            'trajectory' => 'nullable|string',
            'meet' => 'nullable|integer',
            'power' => 'nullable|integer',
            'speed' => 'nullable|integer',

            // pitcher
            'era' => 'nullable|numeric',
            'velocity' => 'nullable|integer',
            'control' => 'nullable|integer',
            'stamina' => 'nullable|integer',
        ]);

        try {
            // ① 選手を作成
            $player = Player::create($data);

            // ② 既存の大会すべてを取得
            $tournaments = Tournament::all();

            // ③ 各大会に対して、初期成績を player_stats(選手成績テーブル) に追加
            foreach ($tournaments as $tournament) {
                PlayerStat::create([
                    'player_id'     => $player->id,
                    'tournament_id' => $tournament->id,
                    'position_type' => $data['type'], // 'batter' or 'pitcher'
                    'order'         => null,
                    'is_bench'      => true,          // 初期状態はベンチ
                    // 他の成績項目は null のままでOK（マイグレーション側で nullable 指定されている前提）
                ]);
            }

            return response()->json($player, 201);

        } catch (\Exception $e) {
            \Log::error('Failed to create player', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Player $player)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Player $player)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Player $player)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Player $player)
    {
        //
    }
}
