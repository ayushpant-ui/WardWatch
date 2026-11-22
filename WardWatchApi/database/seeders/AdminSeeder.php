<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $admins = [
            [
                'name' => 'Admin patan',
                'email' => 'patan@example.com',
                'phone' => '9800000001',
                'municipality' => 'patan Municipality',
                'password' => 'Admin@123456',
                'is_active' => true,
            ],
            [
                'name' => 'Admin Dodhara Chandani',
                'email' => 'dodharachandani@example.com',
                'phone' => '9800000002',
                'municipality' => 'Dodhara Chandani Municipality',
                'password' => 'Admin@123456',
                'is_active' => true,
            ],
            [
                'name' => 'Admin Bedkot',
                'email' => 'bedkot@example.com',
                'phone' => '9800000003',
                'municipality' => 'Bedkot Municipality',
                'password' => 'Admin@123456',
                'is_active' => true,
            ],
            [
                'name' => 'Admin Belauri',
                'email' => 'belauri@example.com',
                'phone' => '9800000004',
                'municipality' => 'Belauri Municipality',
                'password' => 'Admin@123456',
                'is_active' => true,
            ],
            [
                'name' => 'Admin Punarbas',
                'email' => 'punarbas@example.com',
                'phone' => '9800000005',
                'municipality' => 'Punarbas Municipality',
                'password' => 'Admin@123456',
                'is_active' => true,
            ],
        ];

        foreach ($admins as $admin) {

            DB::table('admins')->updateOrInsert(
                ['email' => $admin['email']],
                [
                    'name' => $admin['name'],
                    'phone' => $admin['phone'],
                    'municipality' => $admin['municipality'],
                    'password' => Hash::make($admin['password']),
                    'is_active' => $admin['is_active'],
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }
    }
}
