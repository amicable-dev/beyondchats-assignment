require('dotenv').config();
const axios = require('axios');

const api = axios.create({
  baseURL: 'https://api.groq.com/openai/v1',
  headers: {
    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

async function rewriteArticle({ original, refs }) {
  try {
    const truncatedOriginal = original.slice(0, 4000);
    const truncatedRefs = refs.map((r) => r.slice(0, 1500)).slice(0, 2);

    console.log('📝 LLM inputs - Original:', truncatedOriginal.length);
    console.log(
      '📝 LLM inputs - Refs total:',
      truncatedRefs.reduce((a, b) => a + b.length, 0),
    );

    const response = await api.post('/chat/completions', {
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: `You are an AI blog editor.

Task:
1) Rewrite the ORIGINAL article using the style, structure, and key ideas from the TWO REFERENCE BLOGS.
2) Then generate a short AI-written tag for the title that clearly reflects the topic and angle of the TWO REFERENCE BLOGS (not just the original).

ORIGINAL ARTICLE:
${truncatedOriginal}

REFERENCE BLOGS CONTENT:
${truncatedRefs.join('\n\n--- REFERENCE BLOG ---\n\n')}

Return ONLY a JSON object with exactly these keys:
{
  "content": "the improved markdown article",
  "tag": "a 3-6 word, AI-written, catchy tag summarizing the topic and angle of the two reference blogs, e.g. 'AI-Powered Lead Funnel Playbook'"
}

No backticks, no extra text, just valid JSON.`,
        },
      ],
      max_tokens: 3200,
      temperature: 0.7,
    });

    const raw = response.data.choices[0].message.content.trim();
    console.log('LLM raw output:', raw);

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse LLM JSON, falling back to plain content');
      return {
        content: raw,
        tag: 'AI-Optimized Lead Gen Guide',
      };
    }

    console.log(
      '✅ LLM output length:',
      parsed.content?.length ?? 0,
      'Tag:',
      parsed.tag,
    );

    return parsed; // { content, tag }
  } catch (err) {
    console.error('Groq Error:', err.response?.status, err.message);
    if (err.response?.data) console.error('Groq details:', err.response.data);
    throw err;
  }
}

module.exports = { rewriteArticle };
