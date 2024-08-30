<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\ContentCategory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Content>
 */
class ContentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()->id,
            'title' => fake()->sentence(),
            'slug' => fake()->unique()->slug(),
            'summary' => fake()->paragraph(),
            'content' => fake()->paragraphs(3, true),
            'featured_image' => fake()->imageUrl(),
            'meta_data' => json_encode(['keywords' => fake()->words(3)]),
            'status' => fake()->randomElement(['draft', 'published']),
            'published_at' => fake()->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
