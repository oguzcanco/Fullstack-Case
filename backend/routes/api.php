<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AuthorController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ContentGalleryController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\FeaturedContentController;
use App\Http\Controllers\Api\ImageController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::group(['prefix' => 'auth'], function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
});

//Publc Api
Route::get('/images/{folder}/{filename}', [ImageController::class, 'show']);
Route::get('contents', [ContentController::class, 'index']);
Route::get('contents/latest-content', [ContentController::class, 'getLatestContents']);
Route::get('contents/{content}', [ContentController::class, 'show']);
Route::get('featured-contents', [FeaturedContentController::class, 'index']);
Route::get('categories/{categoryId}', [CategoryController::class, 'getCategoryContents']);
Route::get('categories', [CategoryController::class, 'index']);
Route::get('roles', [RoleController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('auth/verify-token', [AuthController::class, 'verifyToken']);
    Route::get('user', [UserController::class, 'show']);
    Route::get('users', [UserController::class, 'index']);
    Route::get('edit-user/{user}', [UserController::class, 'edit']);
    
    Route::post('categories', [CategoryController::class, 'store']);
    Route::get('panel/categories/{category}', [CategoryController::class, 'show']);
    Route::put('categories/{category}', [CategoryController::class, 'update']);
    Route::delete('category/{category}', [CategoryController::class, 'destroy']);
    Route::delete('content/{content}', [ContentController::class, 'destroy']);

    Route::post('users', [UserController::class, 'store']);
    Route::put('users/{user}', [UserController::class, 'update']);
    Route::post('authors', [AuthorController::class, 'getAuthors']);
    Route::post('contents', [ContentController::class, 'store']);
    Route::post('contents/{content}/gallery', [ContentGalleryController::class, 'store']);
});

Route::get('/example', function () {
    return response()->json(['message' => 'This is an example API route']);
});