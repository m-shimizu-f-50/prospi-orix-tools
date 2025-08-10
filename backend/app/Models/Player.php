<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Player extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'position',
        'series',
        'type',
        'spirit',
        'limit_break',
        'skill1',
        'skill2',
        'skill3',
        // batter
        'average',
        'trajectory',
        'meet',
        'power',
        'speed',
        // pitcher
        'era',
        'velocity',
        'control',
        'stamina',
    ];

    /**
     * 属性のキャスト
     */
    protected $casts = [
        'spirit' => 'integer',
        'limit_break' => 'integer',
        'skill1' => 'integer',
        'skill2' => 'integer',
        'skill3' => 'integer',
        'average' => 'decimal:3',
        'meet' => 'integer',
        'power' => 'integer',
        'speed' => 'integer',
        'era' => 'decimal:2',
        'velocity' => 'integer',
        'control' => 'integer',
        'stamina' => 'integer',
    ];

    /**
     * 選手成績とのリレーション
     */
    public function playerStats(): HasMany
    {
        return $this->hasMany(PlayerStats::class);
    }

    /**
     * 特定の大会での成績を取得
     */
    public function getStatsForTournament(int $tournamentId): ?PlayerStats
    {
        return $this->playerStats()->forTournament($tournamentId)->first();
    }

    /**
     * 野手かどうか
     */
    public function isBatter(): bool
    {
        return $this->type === 'batter';
    }

    /**
     * 投手かどうか
     */
    public function isPitcher(): bool
    {
        return $this->type === 'pitcher';
    }
}
