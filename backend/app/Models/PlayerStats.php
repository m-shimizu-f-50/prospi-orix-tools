<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * 選手成績モデル
 * 
 * 大会ごとの選手の成績を管理
 */
class PlayerStats extends Model
{
    use HasFactory;

    /**
     * テーブル名
     */
    protected $table = 'player_stats';

    /**
     * 一括代入可能な属性
     */
    protected $fillable = [
        'player_id',
        'tournament_id',
        'order',
        // 投手成績
        'wins',
        'losses',
        'saves',
        // 野手成績
        'at_bats',
        'hits',
        'doubles',
        'triples',
        'home_runs',
        'rbi',
    ];


    /**
     * 選手とのリレーション
     */
    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class);
    }

    /**
     * 大会とのリレーション
     */
    public function tournament(): BelongsTo
    {
        return $this->belongsTo(Tournament::class);
    }

    /**
     * 特定の大会の成績のスコープ
     */
    public function scopeForTournament($query, int $tournamentId)
    {
        return $query->where('tournament_id', $tournamentId);
    }

    /**
     * 特定の選手の成績のスコープ
     */
    public function scopeForPlayer($query, int $playerId)
    {
        return $query->where('player_id', $playerId);
    }
} 