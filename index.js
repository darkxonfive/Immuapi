const express = require('express');
const axios = require('axios');
const metascraper = require('metadata-scraper');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/instagram', async (req, res) => {
  const { url } = req.query;
  if (!url || !url.includes('instagram.com')) return res.json({ error: 'Invalid Instagram URL' });

  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const metadata = await metascraper({ html, url });

    if (metadata.video || metadata.image) {
      return res.json({
        success: true,
        url: metadata.video || metadata.image
      });
    } else {
      return res.json({ error: 'No media found' });
    }

  } catch (err) {
    console.log(err);
    return res.json({ error: 'Failed to scrape media' });
  }
});

app.listen(PORT, () => console.log('✅ Server started on port ' + PORT));
