<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTokenModel
{
    public function handle(Request $request,Closure $next,string $expected): Response {

        $user = $request->user();

        $models = [
            'user' => \App\Models\User::class,
            'admin' => \App\Models\Admin::class,
            'official' => \App\Models\Official::class,
        ];

        if (
            !$user ||
            !isset($models[$expected]) ||
            !($user instanceof $models[$expected])
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        return $next($request);
    }
}
