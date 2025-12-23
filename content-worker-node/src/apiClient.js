require('dotenv').config();
const axios = require('axios');

const api = axios.create({
  baseURL: `${process.env.LARAVEL_API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

async function getLatestOriginalArticle() {
  const res = await api.get('/articles/latest-original');
  return res.data;
}

async function createArticle(payload) {
  try {
    const res = await api.post('/articles', payload);
    return res.data;
  } catch (err) {
    if (err.response) {
      console.error(
        'Laravel responded with:',
        err.response.status,
        err.response.statusText,
      );
      console.error('Response data:', err.response.data);
    } else {
      console.error('Network/axios error:', err.message);
    }
    throw err;
  }
}

module.exports = {
  getLatestOriginalArticle,
  createArticle,
};
