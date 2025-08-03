const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/instagram', async (req, res) => {
  const { url } = req.query;
  if (!url || !url.includes('instagram.com')) {
    return res.json({ error: 'Invalid Instagram URL' });
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    const $ = cheerio.load(response.data);
    const video = $('meta[property="og:video"]').attr('content');
    const image = $('meta[property="og:image"]').attr('content');

    if (video) {
      res.json({ success: true, type: 'video', url: video });
    } else if (image) {
      res.json({ success: true, type: 'image', url: image });
    } else {
      res.json({ error: 'No media found' });
    }

  } catch (err) {
    console.error(err.message);
    res.json({ error: 'Failed to scrape media' });
  }
});

app.listen(PORT, () => console.log('✅ Server running on port ' + PORT));
