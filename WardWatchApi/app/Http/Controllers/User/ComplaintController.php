<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ComplaintController extends Controller
{
    // Submit new complaint
    public function store(Request $request)
    {
        $validated = $request->validate([
            'address' => ['nullable', 'string'],
            'province' => ['required', 'string', 'max:255'],
            'district' => ['required', 'string', 'max:255'],
            'municipality' => ['required', 'string', 'max:255'],
            'ward_no' => ['required', 'integer', 'min:1'],
            'location' => ['nullable', 'string'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'category' => ['required', 'string', 'max:255'],
            'people_affected' => ['nullable', 'integer', 'min:1'],
        ]);

        // Generate unique complaint number
        $complaintNumber = 'CMP-' . now()->format('Ymd') . '-'
            . strtoupper(Str::random(8));

        // Upload image
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')
                ->store('complaints', 'public');
        }

        // Assign authenticated user
        $validated['user_id'] = $request->user()->id;

        // Set default values
        $validated['complaint_number'] = $complaintNumber;
        $validated['status'] = 'pending';
        $validated['people_affected'] = $validated['people_affected'] ?? 1;

        $complaint = Complaint::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Complaint submitted successfully.',
            'data' => $complaint,
        ], 201);
    }

    // List logged-in user's complaints
    public function index(Request $request)
    {
        $complaints = Complaint::where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $complaints,
        ]);
    }

    // View individual complaint
    public function show(Request $request, Complaint $complaint)
    {
        if ($complaint->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to this complaint.',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $complaint,
        ]);
    }
}
