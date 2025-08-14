<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\TournamentController;
use App\Http\Controllers\PlayerStatsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Players API
Route::prefix('players')->group(function () {
    Route::get('/', [PlayerController::class, 'index']); // 選手一覧取得
    Route::post('/create', [PlayerController::class, 'create']); // 選手作成
    Route::get('/{id}', [PlayerController::class, 'show']); // 選手詳細取得
    Route::put('/{id}', [PlayerController::class, 'update']); // 選手更新
    Route::delete('/{id}', [PlayerController::class, 'destroy']); // 選手削除
});

// Tournaments API
Route::prefix('tournaments')->group(function () {
    Route::get('/', [TournamentController::class, 'index']); // 大会一覧取得
    Route::post('/', [TournamentController::class, 'store']); // 大会作成
    Route::get('/{id}', [TournamentController::class, 'show']); // 大会詳細取得
    Route::put('/{id}', [TournamentController::class, 'update']); // 大会更新
    Route::delete('/{id}', [TournamentController::class, 'destroy']); // 大会削除
    
    // 大会詳細データ（選手・成績込み）
    Route::get('/{id}/details', [TournamentController::class, 'details']);
    
    // 選手成績一括更新
    Route::post('/{id}/player-stats/bulk-update', [TournamentController::class, 'bulkUpdatePlayerStats']);
});

/*
|--------------------------------------------------------------------------
| 選手成績関連のルート
|--------------------------------------------------------------------------
*/
// 大会の全選手成績取得
Route::get('/tournaments/{tournamentId}/player-stats', [PlayerStatsController::class, 'index']);

// 大会の成績統計
Route::get('/tournaments/{tournamentId}/statistics', [PlayerStatsController::class, 'statistics']);

// 個別選手の大会成績
Route::get('/tournaments/{tournamentId}/players/{playerId}/stats', [PlayerStatsController::class, 'show']);
Route::put('/tournaments/{tournamentId}/players/{playerId}/stats', [PlayerStatsController::class, 'update']);
Route::delete('/tournaments/{tournamentId}/players/{playerId}/stats', [PlayerStatsController::class, 'destroy']);

