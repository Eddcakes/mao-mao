import { serve } from 'https://deno.land/std/http/server.ts';
import { acceptWebSocket, acceptable } from 'https://deno.land/std/ws/mod.ts';
import { gameConnection } from './ws/game.ts';

const serverPort = Number(Deno.env.get('SERVER_PORT')) || 8000;

const server = serve({ port: serverPort });
console.log(`http://localhost:${serverPort}/`);

for await (const req of server) {
  (async () => {
    if (req.url === '/') {
      req.respond({
        status: 200,
        body: await Deno.open('./public/index.html'),
      });
    }

    if (req.url === '/ws') {
      if (acceptable(req)) {
        acceptWebSocket({
          conn: req.conn,
          bufReader: req.r,
          bufWriter: req.w,
          headers: req.headers,
        }).then(gameConnection);
      }
    }
  })();
  // accept websocket
}
