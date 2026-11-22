
<?php

use App\Http\Controllers\Admin\AdminAuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ComplaintTimelineController;


Route::post('/login', [AdminAuthController::class, 'login'])->middleware('throttle:6,1')->name('login');

Route::middleware(['auth:sanctum','token.role:admin'])->group(function () {
    // Authentication & Profile
    Route::get('/me', [AdminAuthController::class, 'me'])
        ->name('me');
    Route::patch('/profile', [AdminAuthController::class, 'updateProfile'])
        ->name('profile.update');
    // Password Management
    Route::put('/password', [AdminAuthController::class, 'changePassword'])
        ->name('password.update');
    // Logout
    Route::post('/logout', [AdminAuthController::class, 'logout'])
        ->name('logout');
    Route::post('/logout-all', [AdminAuthController::class, 'logoutAll'])
        ->name('logout.all');
});
    Route::middleware(['auth:sanctum', 'token.role:admin'])
    ->prefix('complaints')
    ->group(function () {

        Route::get('/{complaint}/timeline',
            [ComplaintTimelineController::class, 'index']);

        Route::post('/{complaint}/timeline',
            [ComplaintTimelineController::class, 'store']);
    });
