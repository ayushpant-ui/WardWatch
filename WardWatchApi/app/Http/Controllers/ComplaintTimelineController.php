<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Models\ComplaintTimeline;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ComplaintTimelineController extends Controller
{
    // Get complete complaint history
    public function index(Complaint $complaint)
    {
        $timelines = $complaint->timelines()
            ->with('updatedBy')
            ->get();

        return response()->json([
            'success' => true,
            'complaint_number' => $complaint->complaint_number,
            'current_status' => $complaint->status,
            'data' => $timelines,
        ]);
    }

    // Record a status update
    public function store(Request $request, Complaint $complaint)
    {
        $validated = $request->validate([
            'new_status' => [
                'required',
                'in:pending,under_review,in_progress,resolved,rejected'
            ],
            'remarks' => ['nullable', 'string', 'max:2000'],
        ]);

        // Identify authenticated actor
        $actor = $request->user();

        if (!$actor) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $timeline = DB::transaction(function () use (
            $complaint,
            $validated,
            $actor
        ) {
            $complaint = Complaint::whereKey($complaint->id)
                ->lockForUpdate()
                ->firstOrFail();

            $oldStatus = $complaint->status;
            $newStatus = $validated['new_status'];

            // Update complaint status
            $complaint->update([
                'status' => $newStatus,
            ]);

            // Create timeline record
            return $complaint->timelines()->create([
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
                'remarks' => $validated['remarks'] ?? null,
                'updated_by_id' => $actor->getKey(),
                'updated_by_type' => get_class($actor),
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'Complaint status updated successfully.',
            'data' => $timeline->load('updatedBy'),
        ]);
    }
}
