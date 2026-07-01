import { once } from 'node:events';
import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = 3001;
const DATA_FILE_PATH = join(__dirname, '..', 'public', 'data', 'users-v2.json');
const CHUNK_SIZE = 32 * 1024;
const CHUNK_DELAY_MS = 15;

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload));
}

const server = createServer(async (request, response) => {
  if (request.method === 'GET' && request.url === '/api/users') {
    let size = 0;

    try {
      ({ size } = statSync(DATA_FILE_PATH));
    } catch {
      sendJson(response, 500, { message: 'Data file is not available' });
      return;
    }

    response.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': size,
      'Cache-Control': 'no-store',
    });

    const stream = createReadStream(DATA_FILE_PATH, { highWaterMark: CHUNK_SIZE });
    let isCancelled = false;

    const cancelStream = () => {
      isCancelled = true;
      stream.destroy();
    };

    request.on('close', cancelStream);
    response.on('close', cancelStream);

    stream.on('error', () => {
      if (!response.headersSent) {
        sendJson(response, 500, { message: 'Failed to read data file' });
        return;
      }

      response.destroy();
    });

    try {
      for await (const chunk of stream) {
        if (isCancelled || response.destroyed) {
          break;
        }

        const canContinue = response.write(chunk);

        if (!canContinue) {
          await once(response, 'drain');
        }

        await delay(CHUNK_DELAY_MS);
      }

      if (!isCancelled && !response.destroyed) {
        response.end();
      }
    } finally {
      request.off('close', cancelStream);
      response.off('close', cancelStream);
    }

    return;
  }

  sendJson(response, 404, { message: 'Not found' });
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  }

  console.error('Server failed to start', error);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`JSON service is running on http://localhost:${PORT}`);
});
