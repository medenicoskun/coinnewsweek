
import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    const content = await page.content();
    await browser.close();
    res.status(200).send(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
