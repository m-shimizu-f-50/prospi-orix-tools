<?php

namespace App\Http\Controllers;

use App\Models\Player;
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

        // 空文字を null に変換（typecast）
        $request->merge(array_map(function ($value) {
            return $value === '' ? null : $value;
        }, $request->all()));

        // バリデーションルールの定義
        $data = $request->validate([
            'name' => 'required|string',
            'position' => 'required|string',
            'series' => 'nullable|string',
            'type' => 'required|in:batter,pitcher',
            'spirit' => 'required|integer',
            'limit_break' => 'required|integer',
            'skill1' => 'nullable|string',
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
            $player = Player::create($data);
        
            return response()->json($player, 201);
        } catch (\Exception $e) {
            \Log::error('Failed to create player', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
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
