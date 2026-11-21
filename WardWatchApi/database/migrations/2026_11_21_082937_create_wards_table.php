<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('municipality_id')
                  ->constrained('municipalities')
                  ->onDelete('cascade');
            $table->unsignedTinyInteger('ward_number'); // e.g., 1 to 33
            $table->string('name')->nullable();           // optional ward label/area name
            $table->string('office_location')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['municipality_id', 'ward_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wards');
    }
};