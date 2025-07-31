<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tournament extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'type',
        'start_date',
        'end_date',
        'win',
        'lose',
    ];
}