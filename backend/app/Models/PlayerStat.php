<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlayerStat extends Model
{
    use HasFactory;

    protected $fillable = [
        'player_id',
        'tournament_id',
        'position_type',
        'order',
        'is_bench',
        'at_bats',
        'hits',
        'doubles',
        'triples',
        'home_runs',
        'rbi',
        'wins',
        'losses',
        'saves',
    ];
}
