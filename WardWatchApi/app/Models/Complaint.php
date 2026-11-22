<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Complaint extends Model
{
    protected $fillable = [
        'complaint_number',
        'address',
        'province',
        'district',
        'municipality',
        'ward_no',
        'location',
        'latitude',
        'longitude',
        'image',
        'status',
        'category',
        'user_id',
        'people_affected',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'ward_no' => 'integer',
            'people_affected' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
