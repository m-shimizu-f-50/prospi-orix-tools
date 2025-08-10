<?php

namespace App\Http\Controllers;

use App\Models\Tournament;
use App\Models\Player;
use App\Models\PlayerStats;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

/**
 * 大会コントローラー
 * 
 * 大会の管理とデータ取得を行う
 */
class TournamentController extends Controller
{
    /**
     * 大会一覧を取得
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = Tournament::query();

        // タイプでフィルタ
        if ($request->has('type')) {
            $query->where('type', $request->get('type'));
        }

        $tournaments = $query->orderBy('created_at', 'desc')->get();

        return response()->json($tournaments);
    }

    /**
     * 新しい大会を作成
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'type' => ['required', Rule::in(Tournament::getValidTypes())],
            'description' => 'nullable|string|max:1000',
        ]);

        $tournament = Tournament::create($validatedData);

        return response()->json($tournament, 201);
    }

    /**
     * 特定の大会情報を取得
     * 
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $tournament = Tournament::findOrFail($id);

        return response()->json($tournament);
    }

    /**
     * 指定された大会IDに対して、全選手の情報と成績（なければデフォルト）を返す
     *
     * @param int $id 大会ID
     * @return JsonResponse
     */
    public function details(int $id): JsonResponse
    {
        // ① 対象の大会情報を取得（存在しなければ404エラー）
        $tournament = Tournament::findOrFail($id);

        // ② 全選手を取得（大会に関係なく全員）
        $players = Player::all();

        // ③ 各選手について、大会ごとの成績を取得＋整形
        $playersWithStats = $players->map(function ($player) use ($id) {
            // 該当大会の成績を取得（リレーション or 独自メソッド）
            $stats = $player->getStatsForTournament($id);

            // 成績が登録されていない場合は、デフォルト（空の）成績をセット
            if (!$stats) {
                $stats = new PlayerStats([
                    'player_id' => $player->id,       // 選手ID
                    'tournament_id' => $id,           // 大会ID
                    'order' => 0,                     // オーダー
                    'wins' => 0,                      // 勝利数
                    'losses' => 0,                    // 敗北数
                    'saves' => 0,                     // セーブ数
                    'at_bats' => 0,                   // 打数
                    'hits' => 0,                      // 安打数
                    'doubles' => 0,                   // 2塁打数
                    'triples' => 0,                   // 3塁打数
                    'home_runs' => 0,                 // 本塁打数
                    'rbi' => 0,                       // 打点
                ]);
            }

            // 選手情報 + 成績をセットで返す
            return [
                'player' => [
                    'id' => $player->id,              // 選手ID
                    'name' => $player->name,          // 名前
                    'position' => $player->position,  // 守備位置
                    'spirit' => $player->spirit,      // スピリッツ
                    'type' => $player->type,          // batter / pitcher
                ],
                'stats' => $stats->toArray(),         // 成績（配列として返す）
            ];
        });

        // ④ 大会情報 + 各選手の成績をまとめてレスポンスとして返す
        return response()->json([
            'tournament' => $tournament,              // 大会情報
            'playersWithStats' => $playersWithStats,  // 各選手の情報＋成績の配列
        ]);
    }


    /**
     * 大会を更新
     * 
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $tournament = Tournament::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date|after:start_date',
            'type' => ['sometimes', Rule::in(Tournament::getValidTypes())],
            'description' => 'nullable|string|max:1000',
        ]);

        $tournament->update($validatedData);

        return response()->json($tournament);
    }

    /**
     * 大会を削除
     * 
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $tournament = Tournament::findOrFail($id);
        
        // 関連する選手成績も削除
        $tournament->playerStats()->delete();
        $tournament->delete();

        return response()->json(['message' => '大会が削除されました'], 200);
    }

    /**
     * 選手成績を一括更新
     * 
     * @param Request $request
     * @param int $tournamentId
     * @return JsonResponse
     */
    public function bulkUpdatePlayerStats(Request $request, int $tournamentId): JsonResponse
    {
        // デバッグ: 受信データを確認
        \Log::info('Received data:', $request->all());
        
        // バリデーション（axios-case-converterによりスネークケースで受信）
        $validatedData = $request->validate([
            'batters' => 'required|array',
            'batters.*.id' => 'required|integer|exists:players,id',
            'batters.*.position' => 'nullable|string|max:10',
            'batters.*.order' => 'nullable|integer|min:1|max:9',
            'batters.*.at_bats' => 'required|integer|min:0',
            'batters.*.hits' => 'required|integer|min:0',
            'batters.*.home_runs' => 'required|integer|min:0',
            'batters.*.doubles' => 'required|integer|min:0',
            'batters.*.triples' => 'required|integer|min:0',
            'batters.*.rbi' => 'required|integer|min:0',
            'pitchers' => 'required|array',
            'pitchers.*.id' => 'required|integer|exists:players,id',
            'pitchers.*.order' => 'nullable|integer|min:1|max:9',
            'pitchers.*.wins' => 'required|integer|min:0',
            'pitchers.*.losses' => 'required|integer|min:0',
            'pitchers.*.saves' => 'required|integer|min:0',
        ]);

        // 大会の存在確認
        $tournament = Tournament::findOrFail($tournamentId);

        try {
            \DB::beginTransaction();

            $updatedBatters = [];
            $updatedPitchers = [];

            // 野手データの更新
            foreach ($validatedData['batters'] as $batterData) {
                $playerId = $batterData['id'];

                // PlayerStatsを更新または作成
                $playerStats = PlayerStats::updateOrCreate(
                    [
                        'player_id' => $playerId,
                        'tournament_id' => $tournamentId,
                    ],
                    [
                        'games' => 0, // 将来的に追加
                        'wins' => 0,
                        'losses' => 0,
                        'draws' => 0,
                        'win_rate' => 0,
                        'at_bats' => $batterData['at_bats'],
                        'hits' => $batterData['hits'],
                        'home_runs' => $batterData['home_runs'],
                        'rbi' => $batterData['rbi'],
                        'average' => 0, // 計算値はフロントエンドで処理
                        // 基本統計データのみ保存
                        'doubles' => $batterData['doubles'] ?? 0,
                        'triples' => $batterData['triples'] ?? 0,
                        // 打順情報を player_stats で管理
                        'order' => $batterData['order'] ?? null,
                    ]
                );

                // 打順情報は player_stats で管理（playersテーブルでは管理しない）

                $updatedBatters[] = [
                    'player_id' => $playerId,
                    'stats_id' => $playerStats->id,
                    'at_bats' => $batterData['at_bats'],
                    'hits' => $batterData['hits'],
                ];
            }

            // 投手データの更新
            foreach ($validatedData['pitchers'] as $pitcherData) {
                $playerId = $pitcherData['id'];
                
                // 基本データのみ保存（勝率などはフロントエンドで計算）
                $totalGames = $pitcherData['wins'] + $pitcherData['losses'];

                // PlayerStatsを更新または作成
                $playerStats = PlayerStats::updateOrCreate(
                    [
                        'player_id' => $playerId,
                        'tournament_id' => $tournamentId,
                    ],
                    [
                        'games' => $totalGames,
                        'wins' => $pitcherData['wins'],
                        'losses' => $pitcherData['losses'],
                        'draws' => 0,
                        'win_rate' => 0, // 計算値はフロントエンドで処理
                        'innings' => 0, // 将来的に追加
                        'strikeouts' => 0, // 将来的に追加
                        'era' => 0, // 将来的に追加
                        'whip' => 0, // 将来的に追加
                        // セーブ数
                        'saves' => $pitcherData['saves'] ?? 0,
                        // 打順情報を player_stats で管理
                        'order' => $pitcherData['order'] ?? null,
                    ]
                );

                // 打順情報は player_stats で管理（playersテーブルでは管理しない）

                $updatedPitchers[] = [
                    'player_id' => $playerId,
                    'stats_id' => $playerStats->id,
                    'wins' => $pitcherData['wins'],
                    'losses' => $pitcherData['losses'],
                    'saves' => $pitcherData['saves'],
                ];
            }

            \DB::commit();

            return response()->json([
                'message' => '選手成績を一括更新しました',
                'tournament_id' => $tournamentId,
                'updated_batters' => $updatedBatters,
                'updated_pitchers' => $updatedPitchers,
                'updated_at' => now(),
            ], 200);

        } catch (\Exception $e) {
            \DB::rollBack();
            
            return response()->json([
                'message' => '選手成績の更新に失敗しました',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

} 