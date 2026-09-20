import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = process.cwd();
const port = process.env.PORT || 3000;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

http.createServer(async (req, res) => {
  try {
    const raw = decodeURIComponent((req.url || '/').split('?')[0]);
    const safe = normalize(raw).replace(/^([.][.][\/])+/, '');
    const hasExtension = extname(safe) !== '';
    let file = join(root, safe === '/' ? 'index.html' : safe);

    try {
      const s = await stat(file);
      if (s.isDirectory()) file = join(file, 'index.html');
    } catch {
      // Fichier introuvable : on ne bascule sur index.html que pour les
      // routes sans extension (navigation type SPA). Un asset manquant
      // (image, css, js...) renvoie un vrai 404 au lieu de servir la page HTML.
      if (hasExtension) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not found');
        return;
      }
      file = join(root, 'index.html');
    }

    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': extname(file) === '.html' ? 'no-cache' : 'public, max-age=86400' });
    res.end(data);
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Server error');
  }
}).listen(port, '0.0.0.0', () => console.log(`ATS site listening on :${port}`));
