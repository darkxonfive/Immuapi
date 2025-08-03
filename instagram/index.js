const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/instagram', async (req, res) => {
  const url = req.query.url;
  if (!url || !url.includes('instagram.com')) {
    return res.json({ error: 'Invalid Instagram URL' });
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);
    const script = $('script[type="application/ld+json"]').html();

    if (!script) return res.json({ error: 'No media found' });

    const json = JSON.parse(script);
    const mediaUrl = json.contentUrl || json.thumbnailUrl;

    res.json({ success: true, url: mediaUrl });

  } catch (err) {
    res.json({ error: 'Failed to scrape' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
