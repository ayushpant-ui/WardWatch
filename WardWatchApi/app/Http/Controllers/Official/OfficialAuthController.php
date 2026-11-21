<?php

namespace App\Http\Controllers\Official;

use App\Http\Controllers\Controller;
use App\Models\Official;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class OfficialAuthController extends Controller
{
    /**
     * Official Registration
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                'unique:officials,email',
            ],
            'phone' => [
                'nullable',
                'string',
                'max:20',
                'unique:officials,phone',
            ],
            'municipality' => ['required', 'string', 'max:255'],
            'ward_no' => ['required', 'integer', 'min:1'],
            'designation' => ['required', 'string', 'max:255'],
            'password' => [
                'required',
                Password::min(8),
            ],
        ]);

        // Create Official using Eloquent save()
        $official = new Official();

        $official->name = $validated['name'];
        $official->email = $validated['email'];
        $official->phone = $validated['phone'] ?? null;
        $official->municipality = $validated['municipality'];
        $official->ward_no = $validated['ward_no'];
        $official->designation = $validated['designation'];
        $official->password = $validated['password'];
        $official->is_active = true;

        $official->save();

        return response()->json([
            'success' => true,
            'message' => 'Official registered successfully',
            'official' => $official,
        ], 201);
    }

    /**
     * Official Login
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $official = Official::where(
            'email',
            $credentials['email']
        )->first();

        if (
            !$official ||
            !Hash::check($credentials['password'], $official->password)
        ) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (!$official->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Your account has been deactivated.',
            ], 403);
        }

        $token = $official->createToken('official-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Official login successful',
            'official' => $official,
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Get Logged-in Official
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'official' => $request->user(),
        ]);
    }

    /**
     * Update Official Profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $official = $request->user();

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],

            'email' => [
                'sometimes',
                'required',
                'email',
                'max:255',
                Rule::unique('officials', 'email')->ignore($official->id),
            ],

            'phone' => [
                'sometimes',
                'nullable',
                'string',
                'max:20',
                Rule::unique('officials', 'phone')->ignore($official->id),
            ],

            'municipality' => ['sometimes', 'required', 'string', 'max:255'],
            'ward_no' => ['sometimes', 'required', 'integer', 'min:1'],
            'designation' => ['sometimes', 'required', 'string', 'max:255'],
        ]);

        $official->fill($validated);
        $official->save();

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'official' => $official->fresh(),
        ]);
    }

    /**
     * Change Official Password
     */
    public function changePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => [
                'required',
                'confirmed',
                Password::min(8),
            ],
        ]);

        $official = $request->user();

        if (!Hash::check(
            $validated['current_password'],
            $official->password
        )) {
            throw ValidationException::withMessages([
                'current_password' => ['Current password is incorrect.'],
            ]);
        }

        // Password is automatically hashed by the model cast
        $official->password = $validated['password'];
        $official->save();

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully',
        ]);
    }

    /**
     * Logout Current Device
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Logout All Devices
     */
    public function logoutAll(Request $request): JsonResponse
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out from all devices successfully',
        ]);
    }
}
