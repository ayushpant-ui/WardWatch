<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminAuthController extends Controller
{
    //
    public function login(Request $request): JsonResponse
        { dd("i reached to login function");
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
}
