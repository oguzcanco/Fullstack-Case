<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FeaturedContent;
use Illuminate\Http\Request;

class FeaturedContentController extends Controller
{
    public function index()
    {
        $featuredContents = FeaturedContent::orderBy('order', 'ASC')->with('content')->get();
        return response()->json($featuredContents);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'content_id' => 'required|exists:contents,id',
            'order' => 'required|integer|min:1'
        ]);

        $featuredContent = FeaturedContent::create($validatedData);
        return response()->json($featuredContent, 201);
    }

    public function show(FeaturedContent $featuredContent)
    {
        return response()->json($featuredContent->load('content'));
    }

    public function update(Request $request, FeaturedContent $featuredContent)
    {
        $validatedData = $request->validate([
            'order' => 'sometimes|required|integer|min:1'
        ]);

        $featuredContent->update($validatedData);
        return response()->json($featuredContent);
    }

    public function destroy(FeaturedContent $featuredContent)
    {
        $featuredContent->delete();
        return response()->json(null, 204);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'featured_contents' => 'required|array',
            'featured_contents.*.id' => 'required|exists:featured_contents,id',
            'featured_contents.*.order' => 'required|integer|min:1'
        ]);

        foreach ($request->featured_contents as $item) {
            FeaturedContent::where('id', $item['id'])->get()->update(['order' => $item['order']]);
        }

        return response()->json(['message' => 'Reordered successfully']);
    }
}
