<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ComplaintTimeline extends Model
{
    protected $fillable = [
        'complaint_id',
        'old_status',
        'new_status',
        'remarks',
        'updated_by_id',
        'updated_by_type',
    ];

    public function complaint(): BelongsTo
    {
        return $this->belongsTo(Complaint::class);
    }

    public function updatedBy(): MorphTo
    {
        return $this->morphTo();
    }
}
