import './Client.css';
import { useEffect, useRef, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { useUser } from '../hooks/useUser';

const wsPort = process.env.REACT_APP_SERVER_PORT || 8000;
// const client = new W3CWebSocket(`ws://localhost:${wsPort}/ws`);

export function Client() {
  const { user } = useUser();
  const websocket = useRef(null);
  const [memberList, setMemberList] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const handleInputChange = (evt) => {
    setMessage(evt.target.value);
  };
  const handleClick = (evt) => {
    evt.preventDefault();
    websocket.current.send(
      JSON.stringify({ user, message, action: 'message' })
    );
  };

  useEffect(() => {
    websocket.current = new W3CWebSocket(`ws://localhost:${wsPort}/ws`);
    websocket.current.onopen = () => {
      console.log('WebSocket Client Connected');
      // send join event to add to room on server
      websocket.current.send(JSON.stringify({ user, action: 'join' }));
    };
    websocket.current.onmessage = ({ data }) => {
      const msg = JSON.parse(data);
      switch (msg.action) {
        case 'users':
          console.log(msg);
          setMemberList(msg.data);
          break;
        case 'message':
          setMessages((prev) => {
            return [...prev, msg.message];
          });
          break;
        default:
          console.error('Cannot find data.action for socket message');
      }
    };
    return () => {
      websocket.current.close();
    };
  }, [user]);
  return (
    <div className='App'>
      <header className='App-header'>
        <h1>web sockets</h1>
      </header>
      <div>Nick: {user.nick}</div>
      <div>Room: {user.room}</div>
      <div>User list:</div>
      <ul>
        {memberList.map((member) => {
          return (
            <li key={member.userId}>
              {member.nick} - {member.userId}
            </li>
          );
        })}
      </ul>
      <form>
        <label htmlFor='message'>message</label>
        <input name='message' value={message} onChange={handleInputChange} />
        <button onClick={handleClick}>Send</button>
      </form>
      <div id='connections'>{JSON.stringify(messages)}</div>
    </div>
  );
}
