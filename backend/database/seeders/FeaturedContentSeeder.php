<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Content;
use App\Models\FeaturedContent;

class FeaturedContentSeeder extends Seeder
{
    public function run(): void
    {
        $contents = Content::inRandomOrder()->take(5)->get();
        foreach ($contents as $index => $content) {
            FeaturedContent::create([
                'content_id' => $content->id,
                'order' => $index + 1,
            ]);
        }
    }
}