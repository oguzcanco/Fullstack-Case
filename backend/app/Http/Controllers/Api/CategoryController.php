<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class CategoryController extends Controller
{
    protected $table = 'categories';

    
    public function index()
    {
        $categories = Category::all();
        return response()->json($categories);
    }

    //public function store(Request $request)
    //{
    //    Gate::authorize('create', Category::class);
    //    $validatedData = $request->validate([
    //        'name' => 'required|string|max:255|unique:categories',
    //        'description' => 'required|string',
    //    ]);
    //    // $category = ContentCategory::create([]);
    //    $category = new ContentCategory();
    //    $category->name = $validatedData['name'];
    //    $category->description = $validatedData['description'];
    //    $category->save();
    //    return response()->json($category, 201);
    //}

    public function store(Request $request)
    {
        Gate::authorize('create', Category::class);

        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:categories',
            'description' => 'required|string',
        ]);
        $category = Category::create($validatedData);
        return response()->json($category, 201);
    }

    public function show(Category $category)
    {
        Gate::authorize('view', $category);
        return response()->json($category);
    }
    public function getCategoryContents($categoryId)
    {
        $category = Category::findOrFail($categoryId);
        $contents = $category->contents()->with('categories', 'user')->get();
        return response()->json([ 'contents' => $contents ]);
    }

    public function update(Request $request, Category $category)
    {
        Gate::authorize('update', $category);
    
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            // Diğer gerekli alanları buraya ekleyin
        ]);
    
        $category->update($validatedData);
    
        return response()->json($category, 200);
    }

    public function destroy(Category $category)
    {
        Gate::authorize('delete', $category);
        $category->delete();
        return response()->json(['message' => 'Category successfully deleted'], 200);
    }

    public function contents(ContentCategory $category)
    {
        $contents = $category->contents()->with('user')->paginate(10);
        return response()->json($contents);
    }
}
