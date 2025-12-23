<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->longText('content');
            $table->boolean('is_updated')->default(false);
            $table->unsignedBigInteger('original_article_id')->nullable();
            $table->timestamps();

            // Index + foreign key for original article relation
            $table->index('original_article_id');
            // If your table name is articles and model is Article:
            $table->foreign('original_article_id')
                  ->references('id')
                  ->on('articles')
                  ->onDelete('cascade');
        });
    }

    public function down() {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropForeign(['original_article_id']);
            $table->dropIndex(['original_article_id']);
        });

        Schema::dropIfExists('articles');
    }
};
