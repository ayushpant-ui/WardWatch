<?php

use App\Http\Middleware\EnsureTokenModel;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            Route::middleware('api')
                ->prefix('user')
                ->as('user.')
                ->group(base_path('routes/user.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'token.role' => EnsureTokenModel::class,
        ]);

        // Prevent unauthenticated API requests from redirecting to route('login') HTML view
        $middleware->redirectGuestsTo(function (Request $request) {
            if ($request->is('user/*') || $request->is('api/*') || $request->expectsJson()) {
                return null; // Triggers AuthenticationException -> 401 JSON
            }

            return '/login';
        });
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Always return JSON for /user/* and /api/* routes
        $exceptions->shouldRenderJsonWhen(function (Request $request, Throwable $e) {
            if ($request->is('user/*') || $request->is('api/*')) {
                return true;
            }

            return $request->expectsJson();
        });
    })->create();