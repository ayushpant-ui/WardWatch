<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('municipalities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('district_id')
                  ->constrained('districts')
                  ->onDelete('cascade');
            $table->string('name');
            $table->string('name_np')->nullable();
            $table->enum('type', [
                'metropolitan',
                'sub_metropolitan',
                'municipality',
                'rural_municipality',
            ])->default('municipality');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['district_id', 'name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('municipalities');
    }
};