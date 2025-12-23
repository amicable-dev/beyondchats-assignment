<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ArticleController;

Route::get('/articles/latest-original', [ArticleController::class, 'latestOriginal']);
Route::get('/articles', [ArticleController::class, 'index']); 
Route::post('/articles', [ArticleController::class, 'store']);
// PUT is not needed for now but kept for future updates
Route::put('/articles/{article}', [ArticleController::class, 'update']);
