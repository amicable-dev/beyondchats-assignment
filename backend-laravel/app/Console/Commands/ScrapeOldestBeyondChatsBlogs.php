<?php

namespace App\Console\Commands;

use App\Models\Article;
use GuzzleHttp\Client;
use Illuminate\Console\Command;
use Symfony\Component\DomCrawler\Crawler;

class ScrapeOldestBeyondChatsBlogs extends Command
{
    protected $signature = 'blogs:scrape-oldest';
    protected $description = 'Scrape 5 oldest BeyondChats blog articles (hard-coded URLs) and store them in the DB';

    public function handle(): int
    {
        $this->info('Scraping 5 oldest BeyondChats blogs...');

        $client = new Client(['timeout' => 20]);

        $oldestFive = [
            'https://beyondchats.com/blogs/introduction-to-chatbots/',
            'https://beyondchats.com/blogs/live-chatbot/',
            'https://beyondchats.com/blogs/virtual-assistant/',
            'https://beyondchats.com/blogs/lead-generation-chatbots/',
            'https://beyondchats.com/blogs/chatbots-for-small-business-growth/',
        ];

        $scraped = 0;

        foreach ($oldestFive as $index => $url) {
            $this->info("[$index] Scraping article: {$url}");

            try {
                $res     = $client->get($url);
                $html    = (string) $res->getBody();
                $crawler = new Crawler($html);

                // Title
                $titleNode = $crawler->filter('h1');
                $title = $titleNode->count()
                    ? trim($titleNode->first()->text())
                    : 'BeyondChats Article ' . ($index + 1);

                // MAIN CONTENT (improved)
                // 1) Try the real article body container (adjust selector if needed after inspecting HTML)
                $contentNodes = $crawler->filter('.entry-content, .post-content, article');

                $paragraphs = [];

                if ($contentNodes->count()) {
                    // Collect only headings, paragraphs, and list items from inside that container
                    $contentNodes->each(function (Crawler $node) use (&$paragraphs) {
                        $node->filter('h1, h2, h3, p, li')->each(function (Crawler $inner) use (&$paragraphs) {
                            $text = trim($inner->text());
                            if ($text !== '') {
                                $paragraphs[] = $text;
                            }
                        });
                    });
                }

                $content = implode("\n\n", $paragraphs);

                if ($content === '') {
                    // Fallback: keep your safety message
                    $content = 'Content could not be fully extracted, but this record confirms scraper + storage is working.';
                }

                // Limit to 8000 chars to stay safe
                $content = mb_substr($content, 0, 8000);

                Article::updateOrCreate(
                    [
                        'title' => $title,
                    ],
                    [
                        'content'             => $content,
                        'is_updated'          => false,
                        'original_article_id' => null,
                    ]
                );

                $scraped++;
                $this->info("Saved: {$title}");
            } catch (\Throwable $e) {
                $this->error("Failed {$url}: {$e->getMessage()}");
            }
        }

        $this->info("Done. Inserted/updated {$scraped} oldest articles.");
        $this->info('Check them at: /api/articles');

        return self::SUCCESS;
    }
}
