<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ArticleController;

Route::get('/', function () {
    return 'OK';
});

Route::prefix('api')->name('api.')->group(function () {
    Route::withoutMiddleware(['csrf', 'web'])->group(function () {
        Route::get('/articles', [ArticleController::class, 'index']);
        Route::get('/articles/latest-original', [ArticleController::class, 'latestOriginal']);
        Route::post('/articles', [ArticleController::class, 'store']);
        Route::get('/articles/{id}', [ArticleController::class, 'show']);
        Route::put('/articles/{id}', [ArticleController::class, 'update']);
        Route::delete('/articles/{id}', [ArticleController::class, 'destroy']);
    });
});

