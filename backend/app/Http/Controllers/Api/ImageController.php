<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;

class ImageController extends Controller
{
    public function show($filename)
    {
        $path = Storage::disk('public')->path('featured_images/' . $filename);
        
        if (!Storage::disk('public')->exists('featured_images/' . $filename)) {
            abort(404);
        }
    
        return response()->file($path);
    }
}