<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckBanned
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check()) {
            $banStatus = Auth::user()->isBanned();
            if ($banStatus !== false) {
                Auth::logout();
                return response()->json([
                    'error' => 'Hesabınız banlanmıştır.',
                    'ban_details' => [
                        'is_permanent' => $banStatus['is_permanent'],
                        'expires_at' => $banStatus['expires_at'],
                        'reason' => $banStatus['reason']
                    ]
                ], 403);
            }
        }

        return $next($request);
    }
}