<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminAuthController extends Controller
{
    public function login(Request $request)
        { 
            $credentials = $request->validate([
                'email' => ['required', 'email'],
                'password' => ['required', 'string'],
            ]);

            $admin = Admin::where('email', $credentials['email'])->first();

            if (!$admin || !Hash::check($credentials['password'], $admin->password)) {
                return response()->json([
                'success' => false,
                'message' => 'invalid credential'],203);
            }

            $token = $admin->createToken('admin-token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Admin login successful',
                'admin' => $admin,
                'token' => $token,
                'token_type' => 'Bearer',
            ], 200);
        }
    public function me(Request $request)
        {
            return response()->json([
                'success' => true,
                'admin' => $request->user(),
            ]);
        }
    public function updateProfile(Request $request)
        {
            $admin = $request->user();

            $validated = $request->validate([
                'name' => ['sometimes', 'required', 'string', 'max:255'],
                'email' => [
                    'sometimes',
                    'required',
                    'email',
                    'max:255',
                    'unique:admins,email,' . $admin->id,
                ],
            ]);

            $admin->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'admin' => $admin->fresh(),
            ]);
        }
    public function changePassword(Request $request)
        {
            $request->validate([
                'current_password' => ['required', 'string'],
                'password' => ['required', 'string', 'min:8', 'confirmed'],
            ]);

            $admin = $request->user();

            if (!Hash::check($request->current_password, $admin->password)) {
                throw ValidationException::withMessages([
                    'current_password' => ['Current password is incorrect.'],
                ]);
            }

            $admin->update([
                'password' => Hash::make($request->password),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Password changed successfully',
            ]);
        }
    public function logout(Request $request)
        {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Logged out successfully',
            ]);
        }
    public function logoutAll(Request $request)
        {
            $request->user()->tokens()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Logged out from all devices successfully',
            ]);
        }
}
