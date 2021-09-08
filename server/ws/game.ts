import {
  isWebSocketCloseEvent,
  WebSocket,
} from 'https://deno.land/std/ws/mod.ts';

interface IBroadcastEvent {
  nick: string;
}

interface IUser {
  userId: string;
  nick: string;
  room: string;
  ws: WebSocket;
}

const sockets = new Map<string, WebSocket>();

const users = new Map<string, IUser>();

const rooms = new Map();

// messages all connected clients
const broadcastEvent = (message: IBroadcastEvent) => {
  sockets.forEach((ws: WebSocket) => {
    ws.send(JSON.stringify(message));
  });
};

const roomBroadcastUsers = (roomName: string) => {
  const users = rooms.get(roomName) || [];
  for (const user of users) {
    const event = {
      action: 'users',
      data: getDisplayUsers(roomName),
    };
    user.ws.send(JSON.stringify(event));
  }
};

const roomBroadcastMessage = (roomName: string, message: string) => {
  const users = rooms.get(roomName) || [];
  for (const user of users) {
    user.ws.send(JSON.stringify({ action: 'message', message: message }));
  }
};

function getDisplayUsers(roomName: string) {
  const users = rooms.get(roomName) || [];
  return users.map((user: IUser) => ({ userId: user.userId, nick: user.nick }));
}

export const gameConnection = async (ws: WebSocket) => {
  console.log('new socket connection');
  const uid = globalThis.crypto.randomUUID();
  // to be nuked in favour for users
  sockets.set(uid, ws);

  for await (const evt of ws) {
    if (isWebSocketCloseEvent(evt)) {
      // what if its accidental close? how can we let user reconnect
      console.log('closed socket connection');
      sockets.delete(uid);
      const thisUser = users.get(uid);
      const roomUsers = rooms.get(thisUser?.room) || [];
      const existing = roomUsers.filter((u: any) => u.userID !== uid);
      rooms.set(thisUser?.room, existing);
    }
    // msg from client
    if (typeof evt === 'string') {
      const parsedEvt = JSON.parse(evt);
      switch (parsedEvt.action) {
        case 'join':
          const newUser = {
            userId: uid,
            nick: parsedEvt.user.nick,
            room: parsedEvt.user.room,
            ws,
          };
          users.set(uid, newUser);
          const usersInRoom = rooms.get(parsedEvt.user.room) || [];
          usersInRoom.push(newUser);
          rooms.set(parsedEvt.user.room, usersInRoom);
          roomBroadcastUsers(parsedEvt.user.room);
          break;
        case 'message':
          roomBroadcastMessage(parsedEvt.user.room, parsedEvt.message);
          break;
        default:
          console.error('Cannot find action for socket event');
      }
    }
  }
};
