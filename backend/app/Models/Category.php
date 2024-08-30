<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    public function contents()
    {
        //return $this->belongsToMany(Content::class, 'content_category');
        return $this->belongsToMany(Content::class, 'content_category', 'category_id', 'content_id');
    }
}