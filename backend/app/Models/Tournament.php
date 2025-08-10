<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * 大会モデル
 * 
 * ランク戦、カップ戦、リーグ戦などの大会情報を管理
 */
class Tournament extends Model
{
    use HasFactory;

    /**
     * テーブル名
     */
    protected $table = 'tournaments';

    /**
     * 一括代入可能な属性
     */
    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'type',
        'description',
    ];

    /**
     * 属性のキャスト
     */
    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * 大会タイプの定数定義
     */
    public const TYPE_RANK_BATTLE = 'rank_battle';
    public const TYPE_CUP = 'cup';
    public const TYPE_LEAGUE = 'league';

    /**
     * 有効な大会タイプ一覧
     */
    public static function getValidTypes(): array
    {
        return [
            self::TYPE_RANK_BATTLE,
            self::TYPE_CUP,
            self::TYPE_LEAGUE,
        ];
    }

    /**
     * 選手成績とのリレーション
     */
    public function playerStats(): HasMany
    {
        return $this->hasMany(PlayerStats::class);
    }

    /**
     * 特定のタイプの大会のスコープ
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }
}