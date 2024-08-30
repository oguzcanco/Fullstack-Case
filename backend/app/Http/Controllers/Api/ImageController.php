<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;

class ImageController extends Controller
{
    public function show($folder, $filename)
    {
        $validFolders = ['featured_images', 'content_gallery'];
        
        if (!in_array($folder, $validFolders)) {
            abort(404);
        }
    
        $path = Storage::disk('public')->path($folder . '/' . $filename);
        
        if (!Storage::disk('public')->exists($folder . '/' . $filename)) {
            abort(404);
        }
    
        return response()->file($path);
    }
}