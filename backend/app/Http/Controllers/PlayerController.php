<?php

namespace App\Http\Controllers;

use App\Models\Player;
use Illuminate\Http\Request;

class PlayerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
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
    
        $player = Player::create($data);
        return response()->json($player, 201);
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
