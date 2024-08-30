<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }


    public function role()
    {
        return $this->belongsTo(Role::class);
    }


    public function contents()
    {
        return $this->hasMany(Content::class);
    }

    /**
     * Bu fonksiyon, User modelinin Ban modeli ile bire çok ilişkisini tanımlar.
     * Bir kullanıcının birden fazla yasak kaydı olabilir.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function bans()
    {
        return $this->hasMany(Ban::class);
    }

    /**
     * @return bool
     */
    /**
     * Bu fonksiyon, kullanıcının şu anda yasaklı olup olmadığını kontrol eder.
     * Eğer kullanıcı yasaklı değilse false döndürür.
     * Eğer kullanıcı yasaklı ise, yasak hakkında detaylı bilgileri içeren bir dizi döndürür.
     * 
     * İlişki: Bu fonksiyon, User modelinin Ban modeli ile olan ilişkisini kullanır.
     * Kullanıcının en son ve hala aktif olan yasağını kontrol eder.
     * 
     * @return bool|array Kullanıcı yasaklı değilse false, yasaklı ise yasak bilgilerini içeren bir dizi
     */
    public function isBanned()
    {
        $activeBan = $this->bans()
            ->where(function ($query) {
                $query->where('is_permanent', true)->orWhere('expires_at', '>', now());
            })->latest()->first();

        if (!$activeBan) {
            return false;
        }

        return [
            'is_banned' => true,
            'is_permanent' => $activeBan->is_permanent,
            'expires_at' => $activeBan->expires_at,
            'reason' => $activeBan->reason
        ];
    }
}
