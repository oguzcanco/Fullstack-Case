<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AuthorController extends Controller
{
    public function getAuthors(Request $request)
    {
        $authors = User::where('role_id', '!=', 4)->with('role')->get();
        return response()->json($authors);
    }
}