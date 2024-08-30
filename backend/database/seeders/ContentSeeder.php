<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Content;
use App\Models\ContentCategory;

class ContentSeeder extends Seeder
{
    public function run(): void
    {
        Content::factory(20)->create()->each(function ($content) {
            $categories = ContentCategory::inRandomOrder()->take(rand(1, 3))->pluck('id');
            $content->categories()->attach($categories);
        });
    }
}