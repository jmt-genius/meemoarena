// /api/hashtag-count.js

export default async function handler(req, res) {
    const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
    const { q } = req.query;
  
    if (!q) {
      return res.status(400).json({ error: "Query param 'q' (hashtag) is required." });
    }
  
    const url = `https://api.twitter.com/2/tweets/counts/recent?granularity=day&query=${encodeURIComponent(q)}`;
  
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      });
  
      if (!response.ok) {
        const err = await response.text();
        return res.status(response.status).json({ error: err });
      }
  
      const data = await response.json();
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch data from Twitter API" });
    }
  }
  