<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Role::where('name', 'admin')->first();
        User::factory()->admin()->create(['role_id' => $adminRole->id]);

        User::factory(10)->create()->each(function ($user) {
            $user->role()->associate(Role::where('name', '!=', 'admin')->inRandomOrder()->first());
            $user->save();
        });
    }
}
