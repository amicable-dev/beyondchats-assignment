const axios = require('axios');

async function realSearch(query) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CX;

  if (!apiKey || !cx) throw new Error('Missing Google keys');

  const res = await axios.get('https://www.googleapis.com/customsearch/v1', {
    params: { key: apiKey, cx, q: query },
  });

  const items = res.data.items || [];

  const blogs = items.filter((item) => {
    if (!item.link) return false;
    const url = item.link;
    if (url.includes('beyondchats.com')) return false;
    return url.includes('/blog') || url.includes('/article') || url.includes('/posts');
  });

  return blogs.slice(0, 2).map((b) => ({ title: b.title, url: b.link }));
}

async function searchBlogs(query) {
  try {
    return await realSearch(query);
  } catch (err) {
    console.warn('Google Search failed, falling back to static URLs:', err.message);
    return [
      {
        title: 'Chatbots Demystified',
        url: 'https://www.prismbizsol.com/blog/chatbots-demystified',
      },
      {
        title: 'The Complete Chatbot Guide',
        url: 'https://www.chatbot.com/blog/chatbot-guide/',
      },
    ];
  }
}

module.exports = { searchBlogs };
