<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index()
    {
    return response()->json(
        Article::orderByDesc('id')->get()
    );
    }
    // GET /api/articles/latest-original
    public function latestOriginal()
    {
        $article = Article::whereNull('original_article_id')
            ->orderByDesc('id')
            ->first();

        if (! $article) {
            return response()->json(['message' => 'No original article found'], 404);
        }

        return response()->json($article);
    }
    


    // POST /api/articles
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'               => 'required|string|max:255',
            'content'             => 'required|string',
            'is_updated'          => 'boolean',
            'original_article_id' => 'nullable|exists:articles,id',
        ]);

        $article = Article::create($data);

        return response()->json($article, 201);
    }

    // Optional: PUT /api/articles/{article} (not used right now but safe to keep)
    public function update(Request $request, Article $article)
    {
        $data = $request->validate([
            'title'   => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
        ]);

        $article->update($data);

        return response()->json($article);
    }
}
