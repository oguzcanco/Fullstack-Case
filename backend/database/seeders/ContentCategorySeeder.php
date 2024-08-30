<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Content;

class ContentCategorySeeder extends Seeder
{
    public function run()
    {
        // Önce kategorileri oluştur (eğer daha önce oluşturulmadıysa)
        if (Category::count() == 0) {
            Category::factory()->count(8)->create();
        }

        $contents = Content::all();
        $categories = Category::all();

        foreach ($contents as $content) {
            $selectedCategories = $categories->random(rand(1, 3))->pluck('id')->toArray();
            $content->categories()->attach($selectedCategories);
        }
    }
}