<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ban;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function index()
    {
        $users = User::paginate(10);
        return response()->json($users);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:roles,id',
        ]);

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'role_id' => $validatedData['role_id'],
        ]);

        return response()->json($user, 201);
    }

    public function show(Request $request)
    {
        $user = $request->user()->load('role');
        return response()->json($user);
    }

    public function edit(User $user)
    {
        $user = $user->load('role');
        return response()->json($user);
    }

    public function update(Request $request, User $user)
    {
        Gate::authorize('update', $user);
        
        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'sometimes|required|string|min:8',
            'role_id' => 'sometimes|required|exists:roles,id',
        ]);

        if (isset($validatedData['password'])) {
            $validatedData['password'] = Hash::make($validatedData['password']);
        }

        $user->update($validatedData);

        return response()->json($user->load('role'));
    }

    public function destroy(User $user)
    {
        Gate::authorize('delete', $user);
        $user->delete();
        return response()->json(null, 204);
    }

    // Admin Functions
    public function createAuthor(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:roles,id',
        ]);

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'role_id' => $validatedData['role_id'],
        ]);

        $authorRole = Role::where('name', 'author')->first();
        $user->roles()->attach($authorRole);

        return response()->json($user, 201);
    }

    public function assignRole(Request $request, User $user)
    {
        $validatedData = $request->validate([
            'role_id' => 'required|exists:roles,id',
        ]);

        $user->role_id = $validatedData['role_id'];
        $user->save();

        return response()->json($user->load('role'));
    }

    public function banUser(Request $request, User $user)
    {
        $validatedData = $request->validate([
            'reason' => 'required|string',
            'duration' => 'required|integer|min:1',
            'is_permanent' => 'required|boolean',
        ]);

        $ban = new Ban([
            'reason' => $validatedData['reason'],
            'is_permanent' => $validatedData['is_permanent'],
            'expires_at' => $validatedData['is_permanent'] ? null : now()->addDays($validatedData['duration']),
        ]);

        $user->bans()->save($ban);

        return response()->json(['message' => 'User banned successfully']);
    }

    public function unban(User $user)
    {
        $user->bans()->where('is_permanent', false)->where('expires_at', '>', now())->update(['expires_at' => now()]);
        $user->bans()->where('is_permanent', true)->delete();

        return response()->json(['message' => 'User unbanned successfully']);
    }
}