<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContentGallery extends Model
{
    use HasFactory;

    protected $fillable = [
        'content_id',
        'image_path',
        'image_order',
    ];

    /**
     * Bu fonksiyon, ContentGallery modelinin Content modeli ile ilişkisini tanımlar.
     * Bir ContentGallery kaydının yalnızca bir Content ile ilişkisi olabilir.
     * Aynı zamanda, bir Content kaydının birden fazla ContentGallery ile ilişkisi olabilir.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function content()
    {
        return $this->belongsTo(Content::class);
    }
}