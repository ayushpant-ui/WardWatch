<?php

use App\Http\Controllers\Admin\AdminAuthController;
use App\Models\Admin;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AdminAuthController::class, 'login'])
    ->middleware('throttle:6,1')
    ->name('login');
Route::middleware(['auth:sanctum', 'token.role:admin'])->group(function () {
    Route::get('/me', [AdminAuthController::class, 'me'])->name('me');
    Route::patch('/profile', [AdminAuthController::class, 'updateProfile'])->name('profile.update');
    Route::put('/password', [AdminAuthController::class, 'changePassword'])->name('password.update');
    Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');
    Route::post('/logout-all', [AdminAuthController::class, 'logoutAll'])->name('logout.all');
});