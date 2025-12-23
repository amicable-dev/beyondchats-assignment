const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrape main textual content from a blog/article URL.
 */
async function scrapeMainContent(url) {
  const { data: html } = await axios.get(url, { timeout: 20000 });
  const $ = cheerio.load(html);

  let text = '';

  // Try typical article containers
  const selectors = ['article', 'main', '.post-content', '.entry-content', '.blog-post'];

  for (const sel of selectors) {
    if ($(sel).length) {
      text = $(sel).first().text();
      break;
    }
  }

  if (!text) {
    text = $('body').text();
  }

  // Normalize and limit size
  const cleaned = text.replace(/\s+/g, ' ').trim();
  return cleaned.split(' ').slice(0, 4000).join(' ');
}

module.exports = { scrapeMainContent };
