import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const port = Number(process.env.PORT || 8000);
const clients = new Set();

const types = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.gif', 'image/gif'],
  ['.webp', 'image/webp'],
  ['.mov', 'video/quicktime'],
  ['.mp4', 'video/mp4'],
  ['.ico', 'image/x-icon'],
]);

const reloadClient = `<script>(() => {
  const events = new EventSource('/__reload');
  events.onmessage = (event) => {
    if (event.data === 'reload') window.location.reload();
  };
})();</script>`;

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const requested = decoded === '/' ? '/index.html' : decoded;
  const filePath = path.normalize(path.join(root, requested));

  if (!filePath.startsWith(root)) {
    return null;
  }

  return filePath;
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/__reload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Connection: 'keep-alive',
    });
    res.write('data: connected\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  const filePath = safePath(req.url || '/');

  if (!filePath) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  try {
    const fileStat = await stat(filePath);

    if (!fileStat.isFile()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    let body = await readFile(filePath);
    const type = types.get(ext) || 'application/octet-stream';

    if (ext === '.html') {
      body = Buffer.from(body.toString('utf8').replace('</body>', `${reloadClient}</body>`));
    }

    res.writeHead(200, {
      'Content-Type': type,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});

let reloadTimer;
function broadcastReload() {
  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(() => {
    for (const client of clients) {
      client.write('data: reload\n\n');
    }
  }, 80);
}

watch(root, { recursive: true }, (_event, filename) => {
  if (!filename || filename === 'dev-server.mjs') return;
  broadcastReload();
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Wedding site live at http://localhost:${port}`);
  console.log(`Local network preview available at http://<your-mac-ip>:${port}`);
  console.log('Live reload is watching for changes.');
});
