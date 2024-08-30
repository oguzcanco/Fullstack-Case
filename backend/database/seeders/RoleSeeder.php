<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['name' => 'admin', 'description' => 'Yönetici rolü'],
            ['name' => 'lead-editor', 'description' => 'Lead Editör rolü'],
            ['name' => 'editor', 'description' => 'Editör rolü'],
            ['name' => 'user', 'description' => 'Kullanıcı rolü']
        ];
    
        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
