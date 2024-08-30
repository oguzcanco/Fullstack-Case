<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Content extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'summary',
        'content',
        'featured_image',
        'meta_data',
        'status',
        'published_at',
    ];

    protected $casts = [
        'meta_data' => 'array',
        'published_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function categories()
    {
        //return $this->belongsToMany(Category::class, 'content_category');
        return $this->belongsToMany(Category::class, 'content_category', 'content_id', 'category_id');
    }

    public function gallery()
    {
        return $this->hasMany(ContentGallery::class);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published')
            ->where('published_at', '<=', now());
    }

    public function publish()
    {
        if ($this->status !== 'published') {
            $this->status = 'published';
            $this->published_at = now();
            $this->save();
        }
    }

    public function scopeLatestPublished(Builder $query, $limit = 5)
    {
        return $query->where('status', 'published')
            ->where('published_at', '<=', now())
            ->orderBy('published_at', 'desc')
            ->limit($limit);
    }
}
