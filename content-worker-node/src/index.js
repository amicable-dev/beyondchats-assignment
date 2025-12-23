require('dotenv').config();
const { getLatestOriginalArticle, createArticle } = require('./apiClient');
const { searchBlogs } = require('./googleSearch');
const { scrapeMainContent } = require('./scrapePage');
const { rewriteArticle } = require('./llmClient');

async function run() {
  try {
    console.log('Fetching latest original article from Laravel...');
    const original = await getLatestOriginalArticle();
    console.log('Using article:', `${original.title} (#${original.id})`);

    console.log('Searching Google for related blogs...');
    const results = await searchBlogs(original.title);

    if (results.length === 0) {
      console.log('No external blog results found. Exiting.');
      return;
    }

    const topTwo = results.slice(0, 2);
    console.log('Top two reference URLs:');
    topTwo.forEach((r) => console.log(' -', r.url));

    const refContents = [];
    for (const ref of topTwo) {
      console.log('Scraping reference:', ref.url);
      const content = await scrapeMainContent(ref.url);
      refContents.push({ url: ref.url, content });
    }

    console.log('Calling Groq LLM to rewrite article...');
    const result = await rewriteArticle({
      original: original.content,
      refs: refContents.map((r) => r.content),
    });

    // rewriteArticle now returns { content, tag } (or a string fallback)
    const updatedMarkdown =
      typeof result === 'string' ? result : result.content;
    const aiTag =
      typeof result === 'string'
        ? 'AI-Rewritten Article'
        : result.tag || 'AI-Rewritten Article';

    const referencesBlock =
      '\n\n## References\n' +
      topTwo.map((r, i) => `${i + 1}. ${r.url}`).join('\n');

    let finalContent = (updatedMarkdown || original.content) + referencesBlock;

    const MAX_CHARS = 4000;
    if (finalContent.length > MAX_CHARS) {
      console.log(
        `Truncating article from ${finalContent.length} to ${MAX_CHARS} characters`,
      );
      finalContent = finalContent.slice(0, MAX_CHARS);
    }

    console.log('Final content length:', finalContent.length);
    console.log(
      'Approx payload size (KB):',
      Buffer.byteLength(
        JSON.stringify({
          title: original.title,
          content: finalContent,
          is_updated: true,
          original_article_id: original.id,
        }),
        'utf8',
      ) / 1024,
    );

    const payload = {
      title: `${aiTag}`, // AI-generated tag based on refs
      content: finalContent,
      is_updated: true,
      original_article_id: original.id,
    };

    console.log('Creating new updated article for original #' + original.id);
    const created = await createArticle(payload);
    console.log('SUCCESS: Created updated article ID:', created.id);
  } catch (err) {
    console.error('Error in worker:', err.message);
    if (err.response) {
      console.error('Response status:', err.response.status);
      console.error('Response data:', err.response.data);
    }
  }
}

run();
