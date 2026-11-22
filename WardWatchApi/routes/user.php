<?php

use App\Http\Controllers\User\AuthController;
use App\Http\Controllers\User\ComplaintController;
use App\Models\User;
use Illuminate\Support\Facades\Route;

// Public user routes -> /user/register, /user/login
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:6,1')
    ->name('login');

// Protected user routes -> /user/me, /user/profile, /user/password, /user/logout, /user/logout-all
Route::middleware(['auth:sanctum', 'token.role:' . User::class . ',role:user'])->group(function () {
    Route::get('/me', [AuthController::class, 'me'])->name('me');
    Route::patch('/profile', [AuthController::class, 'updateProfile'])->name('profile.update');
    Route::put('/password', [AuthController::class, 'changePassword'])->name('password.update');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::post('/logout-all', [AuthController::class, 'logoutAll'])->name('logout.all');
});

Route::middleware('auth:sanctum')->prefix('complaints')->group(function () {

    Route::post('/', [ComplaintController::class, 'store'])
        ->name('complaints.store');

    Route::get('/', [ComplaintController::class, 'index'])
        ->name('complaints.index');

    Route::get('/{complaint}', [ComplaintController::class, 'show'])
        ->name('complaints.show');

});