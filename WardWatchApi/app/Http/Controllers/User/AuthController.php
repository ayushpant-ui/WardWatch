<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    /**
     * Register a new user and issue a Sanctum token.
     */
    public function register(Request $request): JsonResponse
    { 
        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'email'       => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password'    => ['required', Password::defaults()],
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => $validated['password'], // Auto-hashed by User model cast
        ]);
        return response()->json([
            'message' => 'Registration successful.',
            'data'    => $user,
        ], 201);
    }

    /**
     * Authenticate using built-in Auth::attempt() and issue a Sanctum token.
     */
    public function login(Request $request): JsonResponse
        {
            $validated = $request->validate([
                'email'       => ['required', 'email'],
                'password'    => ['required', 'string'],
                'device_name' => ['nullable', 'string', 'max:255'],
            ]);

            if (!Auth::attempt([
                'email'    => $validated['email'],
                'password' => $validated['password'],
            ])) {
                return response()->json([
                    'message' => 'The provided credentials are incorrect.',
                ], 401);
            }

            /** @var User $user */
            $user = Auth::User();
            $token = $user->createToken('customer_auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login successful.',
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'accessToken'   => $token,
                'role' => 'citizen',
            ]);
        }

    /**
     * Get the currently authenticated user's profile.
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    /**
     * Update authenticated user's profile details.
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name'  => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated.',
            'user'    => $user->fresh(),
        ]);
    }

    /**
     * Change authenticated user's password and revoke other device tokens.
     */
    public function changePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password'         => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = $request->user();
        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        // Revoke all other tokens except the current token
        $currentTokenId = $user->currentAccessToken()?->id;
        if ($currentTokenId) {
            $user->tokens()->where('id', '!=', $currentTokenId)->delete();
        }

        return response()->json([
            'message' => 'Password changed successfully.',
        ]);
    }

    /**
     * Revoke the current access token (Logout current device).
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }

    /**
     * Revoke all access tokens (Logout from all devices).
     */
    public function logoutAll(Request $request): JsonResponse
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out from all devices.',
        ]);
    }
}