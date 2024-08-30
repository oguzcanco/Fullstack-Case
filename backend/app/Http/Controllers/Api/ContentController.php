<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Content;
use App\Models\ContentCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

class ContentController extends Controller
{
    public function index()
    {
        $contents = Content::with('user', 'categories')->latest()->paginate(10);
        return response()->json($contents);
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Content::class);

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'summary' => 'nullable|string',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'category_ids' => 'required|array',
            'category_ids.*' => 'exists:categories,id',
            'status' => 'required|in:draft,published',
            'meta_data' => 'nullable|json',
        ]);

        $validatedData['user_id'] = auth()->user()->id;
        $validatedData['slug'] = Str::slug($validatedData['title']);
        $validatedData['published_at'] = now();

        if ($request->hasFile('featured_image')) {
            $validatedData['featured_image'] = $request->file('featured_image')->store('featured_images', 'public');
        }

        $content = Content::create($validatedData);
        $content->categories()->attach($validatedData['category_ids']);

        if ($validatedData['status'] === 'published') {
            $content->publish();
        }

        return response()->json($content->load('categories'), 201);
    }

    public function show(Content $content)
    {
        $content->load('user', 'categories', 'gallery');
        return response()->json($content);
    }

    public function update(Request $request, Content $content)
    {
        Gate::authorize('create', $content);

        $validatedData = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'summary' => 'nullable|string',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'category_ids' => 'sometimes|required|array',
            'category_ids.*' => 'exists:categories,id',
            'status' => 'sometimes|required|in:draft,published',
            'meta_data' => 'nullable|json',
        ]);

        if (isset($validatedData['title'])) {
            $validatedData['slug'] = Str::slug($validatedData['title']);
        }

        if ($request->hasFile('featured_image')) {
            $validatedData['featured_image'] = $request->file('featured_image')->store('featured_images', 'public');
        }

        $content->update($validatedData);

        if (isset($validatedData['category_ids'])) {
            $content->categories()->sync($validatedData['category_ids']);
        }

        if (isset($validatedData['status']) && $validatedData['status'] === 'published') {
            $content->publish();
        }

        return response()->json($content->load('categories'));
    }

    public function destroy(Content $content)
    {
        try {
            Gate::authorize('delete', [$content, Content::class]);

            $content->delete();
            return response()->json(["msg" => "Succesfuly deleted content"], 204);
        } catch (\Exception $e) {
            return response()->json(["msg" => "Failed to delete content", "error" => $e->getMessage()], 500);
        }
    }

    public function getLatestContents()
    {
        $latestContents = Content::latestPublished()->with('user', 'categories')->get();
        return response()->json($latestContents);
    }

    public function changeStatus(Content $content, $status)
    {
        $content->status = $status;
        $content->save();

        return response()->json($content);
    }

    public function categoryContents(ContentCategory $category)
    {
        $contents = Content::whereHas('categories', function($query) use ($category) {
                $query->where('content_category.content_category_id', $category->id);
            })
            ->where('status', 'published')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($contents);
    }
}
