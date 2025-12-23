# BeyondChats Assignment – AI Article Pipeline
#Live Preview <a href="https://beyondchats-assignment-seven.vercel.app/">Live Demo</a>

This project implements an end‑to‑end content pipeline:

- Scrape 5 “oldest” BeyondChats blog posts into a Laravel backend.
- Run a Node.js worker that:
  - Fetches an original article from Laravel.
  - Finds 2 related blogs from Google.
  - Scrapes their content.
  - Sends original + references to Groq (Llama 3.3) to rewrite the article and generate an AI tag.
  - Publishes the updated article back to Laravel.
- A frontend dashboard displays originals and AI‑updated articles.

---

## Tech Stack

- **Backend API:** Laravel 12 (PHP 8.2)  
- **Database:** MySQL (or any DB supported by Laravel)  
- **Scraper:** Laravel Artisan command using Guzzle + Symfony DomCrawler  
- **Worker:** Node.js (content-worker-node)  
  - HTTP: Axios  
  - LLM: Groq API (`llama-3.3-70b-versatile`)  
- **Search & Scrape:**  
  - Google Custom Search (or similar)  
  - Custom HTML scraper (`scrapeMainContent`)  
- **Frontend:** React / Vite app (`article-dashboard`)  
- **Env Management:** dotenv (with dotenvx tips in logs)

---
##Project Flow
![Workflow](https://raw.githubusercontent.com/amicable-dev/beyondchats-assignment/main/Images/workflow.png)

## Project Structure

beyondchats-assignment/
├── article-dashboard/ # Frontend UI
├── backend-laravel/ # Laravel API + scraper command
└── content-worker-node/ # Node worker that rewrites & posts articles

---

## 1. Backend (Laravel) Setup

### 1.1 Install dependencies

cd backend-laravel
composer install
cp .env.example .env
php artisan key:generate

Update `.env` DB settings:

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=beyondchats
DB_USERNAME=your_user
DB_PASSWORD=your_password

### 1.2 Migrations


`articles` table (simplified):

- `id`
- `title`
- `content`
- `is_updated` (bool)
- `original_article_id` (nullable, self‑reference)
- timestamps

### 1.3 Seed 5 “oldest” BeyondChats blogs

Command: `ScrapeOldestBeyondChatsBlogs`

php artisan blogs:scrape-oldest

This:

- Scrapes 5 hard‑coded BeyondChats URLs.
- Extracts title + cleaned content.
- Inserts/updates them as **original** articles (`is_updated = false`, `original_article_id = null`).

### 1.4 API Routes

`routes/api.php` exposes:

GET /api/articles # list all articles
GET /api/articles/latest-original
POST /api/articles # create (used by worker)
PUT /api/articles/{article} # (optional) update

Key controller: `App\Http\Controllers\Api\ArticleController`.

---

## 2. Node Worker Setup (`content-worker-node`)

### 2.1 Install dependencies
cd content-worker-node
npm install
cp .env.example .env # if present, otherwise create .env

`.env` should include:
GROQ_API_KEY=your_groq_key_here
LARAVEL_API_BASE_URL=http://127.0.0.1:8000
GOOGLE_API_KEY=your_google_key_here # if using Google Custom Search
GOOGLE_CX=your_search_engine_id_here

### 2.2 What the worker does

File: `content-worker-node/src/index.js`

High‑level flow:

1. `getLatestOriginalArticle()` – fetches one original article from Laravel:
   - `GET /api/articles/latest-original`
2. `searchBlogs(original.title)` – finds related blogs on Google.
3. Take top 2 URLs and `scrapeMainContent(url)` for each.
4. Call `rewriteArticle({ original, refs })`:
   - Sends original content + 2 reference contents to Groq.
   - Groq returns:
     - `content`: improved markdown article
     - `tag`: short AI‑generated tag based on the 2 reference blogs.
5. Append a “References” section with the 2 URLs.
6. Truncate the final content to 4,000 characters to avoid 413 errors.
7. POST to Laravel:

{
title: ${original.title} – ${aiTag},
content: finalContent,
is_updated: true,
original_article_id: original.id,
}

Laravel stores these as updated articles (shown as “Based on #<originalId>” in the UI).

### 2.3 LLM client (Groq)

File: `content-worker-node/src/llmClient.js`

- Uses `https://api.groq.com/openai/v1`
- Model: `llama-3.3-70b-versatile`
- Prompt asks Groq to:
  - Rewrite the article using the style/ideas of the 2 reference blogs.
  - Return JSON with `content` and an AI‑written `tag` derived from those blogs.

---

## 3. Frontend (`article-dashboard`)

### 3.1 Install & run
cd article-dashboard
npm install
npm run dev

The dashboard:

- Calls `GET http://127.0.0.1:8000/api/articles`.
- Lists originals and updated articles.
- Shows updated articles grouped “Based on #<originalId>”.
- Titles for updated articles include AI‑generated tags (e.g.  
  `10X Your Leads… – AI-Powered Lead Funnel Playbook`).

---

## 4. How to Run Everything Locally

1. **Start Laravel backend**
cd backend-laravel
php artisan serve --host=127.0.0.1 --port=8000

2. **Seed the 5 BeyondChats originals (if needed)**
php artisan blogs:scrape-oldest

3. **Run the Node worker**
cd content-worker-node
node src/index.js

Each run will:

- Pick an original article.
- Generate a new AI‑updated version.
- Save it back to Laravel.

4. **Start the frontend**
cd article-dashboard
npm run dev

Visit the local URL shown in the terminal (usually `http://localhost:5173` or similar).

---

## 5. Notes / Decisions

- **Payload size control**  
  - Final article content truncated to ~4,000 characters to avoid HTTP 413 from Laravel.
- **LLM safety**  
  - Inputs (original + refs) truncated before sending to Groq to keep token usage reasonable.
- **IDs and grouping**  
  - Originals: `is_updated = false`, `original_article_id = null`.  
  - Updated: `is_updated = true`, `original_article_id = <original id>`, title includes AI tag.

---

## 6. Scripts Summary

**Laravel**
php artisan migrate # run migrations
php artisan blogs:scrape-oldest
php artisan serve

**Worker**
node src/index.js

**Frontend**
npm run dev

## Screenshorts
## Scraped Data
<img src="https://raw.githubusercontent.com/amicable-dev/beyondchats-assignment/main/Images/Data.png" alt="Data" width="500">
## Blog List
<img src="https://raw.githubusercontent.com/amicable-dev/beyondchats-assignment/main/Images/BlogsList.png" alt="Blogs List" width="500">
## Updated Blog
<img src="https://raw.githubusercontent.com/amicable-dev/beyondchats-assignment/main/Images/UpdatedBlog.png" alt="Updated Blog" width="500">





