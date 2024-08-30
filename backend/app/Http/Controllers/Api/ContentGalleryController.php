<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContentGallery;
use App\Models\Content;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ContentGalleryController extends Controller
{
    public function index(Content $content)
    {
        return response()->json($content->gallery);
    }

    public function store(Request $request, Content $content)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'image_order' => 'required|integer|min:1'
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('content_gallery', 'public');
            $gallery = $content->gallery()->create([
                'image_path' => $path,
                'image_order' => $request->image_order
            ]);

            return response()->json($gallery, 201);
        }

        return response()->json(['error' => 'No image uploaded'], 400);
    }

    public function show(ContentGallery $contentGallery)
    {
        return response()->json($contentGallery);
    }

    public function update(Request $request, ContentGallery $contentGallery)
    {
        $request->validate([
            'image_order' => 'sometimes|integer|min:1'
        ]);

        $contentGallery->update($request->only('image_order'));

        return response()->json($contentGallery);
    }

    public function destroy(ContentGallery $contentGallery)
    {
        Storage::disk('public')->delete($contentGallery->image_path);
        $contentGallery->delete();

        return response()->json(null, 204);
    }
}