<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('provinces', function (Blueprint $table) {
            $table->id();
            $table->enum('name', [
                'Koshi',
                'Madhesh',
                'Bagmati',
                'Gandaki',
                'Lumbini',
                'Karnali',
                'Sudurpashchim',
            ])->unique();
            $table->string('name_np')->nullable();
            $table->string('code')->unique()->nullable();
            $table->string('capital')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('provinces');
    }
};