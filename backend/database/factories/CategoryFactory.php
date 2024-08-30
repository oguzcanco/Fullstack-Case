<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\ContentCategory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ContentCategory>
 */
class CategoryFactory extends Factory
{
    protected $model = Category::class;

    protected static $categoryIndex = 0;

    /**
     * Blog kategorileri listesi
     */
    protected $categories = [
        'Teknoloji' => 'Yazılım, donanım ve dijital yenilikler hakkında içerikler',
        'Yaşam Tarzı' => 'Sağlık, fitness, moda ve kişisel gelişim konuları',
        'Seyahat' => 'Gezi rehberleri, seyahat ipuçları ve deneyim paylaşımları',
        'Yemek' => 'Tarifler, restoran incelemeleri ve mutfak kültürü',
        'Bilim' => 'Bilimsel keşifler, araştırmalar ve ilginç bilgiler',
        'Kültür & Sanat' => 'Edebiyat, sinema, müzik ve sanat dünyasından haberler',
        'İş Dünyası' => 'Girişimcilik, kariyer tavsiyeleri ve ekonomi haberleri',
        'Spor' => 'Çeşitli spor dallarından haberler ve analizler'
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categoryNames = array_keys($this->categories);
        $categoryName = $categoryNames[self::$categoryIndex % count($categoryNames)];
        self::$categoryIndex++;

        return [
            'name' => $categoryName,
            'description' => $this->categories[$categoryName],
        ];
    }
}
