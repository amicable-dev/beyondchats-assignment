<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Article extends Model {
    protected $fillable = ['title', 'content', 'is_updated', 'original_article_id'];
    protected $casts = ['is_updated' => 'boolean'];
}
