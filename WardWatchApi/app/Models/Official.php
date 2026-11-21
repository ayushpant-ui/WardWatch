<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class Official extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'officials';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'municipality',
        'ward_no',
        'designation',
        'password',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'is_active' => 'boolean',
            'email_verified_at' => 'datetime',
        ];
    }
}
