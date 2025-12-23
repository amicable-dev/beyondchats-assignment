# BeyondChats Assignment – AI Article Pipeline

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

## Project Structure

