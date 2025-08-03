const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/instagram', async (req, res) => {
  const igurl = req.query.url;
  if (!igurl || !igurl.includes('instagram.com')) {
    return res.json({ error: 'Invalid Instagram URL' });
  }

  try {
    const { data } = await axios.get(igurl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    const videoRegex = /"video_url":"([^"]+)"/;
    const imageRegex = /"display_url":"([^"]+)"/;

    const videoMatch = data.match(videoRegex);
    const imageMatch = data.match(imageRegex);

    if (videoMatch) {
      const videoUrl = videoMatch[1].replace(/\\u0026/g, "&").replace(/\\\//g, "/");
      return res.json({ success: true, url: videoUrl });
    } else if (imageMatch) {
      const imageUrl = imageMatch[1].replace(/\\u0026/g, "&").replace(/\\\//g, "/");
      return res.json({ success: true, url: imageUrl });
    } else {
      return res.json({ error: 'No media found' });
    }

  } catch (e) {
    return res.json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
