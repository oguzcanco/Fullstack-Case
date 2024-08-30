<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_galleries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('content_id')->constrained()->onDelete('cascade');
            $table->string('image_path');
            $table->integer('image_order');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_galleries');
    }
};