import {
  WebSocket,
  isWebSocketCloseEvent,
} from 'https://deno.land/std/ws/mod.ts';

const sockets = new Map<string, WebSocket>();
const broadcastEvent = (message: IBroadcastEvent) => {
  sockets.forEach((ws: WebSocket) => {
    ws.send(JSON.stringify(message));
  });
};

export const gameConnection = async (ws: WebSocket) => {
  console.log('new socket connection');
  const uid = globalThis.crypto.randomUUID();
  sockets.set(uid, ws);

  for await (const evt of ws) {
    if (isWebSocketCloseEvent(evt)) {
      // what if its accidental close? how can we let user reconnect
      sockets.delete(uid);
    }
    // msg from client
    if (typeof evt === 'string') {
      const parsedEvt = JSON.parse(evt);
      broadcastEvent(parsedEvt);
    }
  }
};

interface IBroadcastEvent {
  nick: string;
}
