import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());

app.get('/api', async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: 'URL parametresi eksik' });
  }

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });

    const pageContent = await page.content();
    await browser.close();

    res.status(200).send(pageContent);
  } catch (error) {
    res.status(500).json({ error: 'Sayfa alınamadı', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Sunucu http://localhost:${port}/api üzerinde çalışıyor`);
});
