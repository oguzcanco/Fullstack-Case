<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ban extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'expires_at', 'is_permanent', 'reason'];

    protected $casts = [
        'expires_at' => 'datetime',
        'is_permanent' => 'boolean',
    ];

    /**
     * Bu fonksiyon, Ban modelinin User modeli ile ilişkisini tanımlar.
     * Bir yasak kaydının yalnızca bir kullanıcıya ait olabileceğini belirtir.
     * Aynı zamanda, bir kullanıcının birden fazla yasak kaydı olabilir.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}