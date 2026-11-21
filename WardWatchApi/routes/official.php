
<?php

use App\Http\Controllers\Official\OfficialAuthController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [OfficialAuthController::class, 'register'])
    ->middleware('throttle:6,1')
    ->name('register');

Route::post('/login', [OfficialAuthController::class, 'login'])
    ->middleware('throttle:6,1')
    ->name('login');

// Protected routes
Route::middleware(['auth:sanctum', 'token.role:official'])->group(function () {

    Route::get('/me', [OfficialAuthController::class, 'me'])
        ->name('me');

    Route::patch('/profile', [OfficialAuthController::class, 'updateProfile'])
        ->name('profile.update');

    Route::put('/password', [OfficialAuthController::class, 'changePassword'])
        ->name('password.update');

    Route::post('/logout', [OfficialAuthController::class, 'logout'])
        ->name('logout');

    Route::post('/logout-all', [OfficialAuthController::class, 'logoutAll'])
        ->name('logout.all');
});
