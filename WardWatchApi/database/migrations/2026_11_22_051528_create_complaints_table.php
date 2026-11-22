
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();

            $table->string('complaint_number')->unique();

            $table->text('address')->nullable();

            $table->string('province');
            $table->string('district');
            $table->string('municipality');
            $table->unsignedSmallInteger('ward_no');

            $table->text('location')->nullable();

            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();

            $table->string('image')->nullable();

            $table->string('status')->default('pending');

            $table->string('category');

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->unsignedInteger('people_affected')->default(1);

            $table->timestamps();

            $table->index(['municipality', 'ward_no']);
            $table->index(['category', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
