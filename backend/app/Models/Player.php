<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}
