import './Client.css';
import { useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { useUser } from '../hooks/useUser';

const wsPort = process.env.REACT_APP_SERVER_PORT || 8000;
const client = new W3CWebSocket(`ws://localhost:${wsPort}/ws`);

export function Client() {
  const { user } = useUser();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const handleInputChange = (evt) => {
    setMessage(evt.target.value);
  };

  const handleClick = (evt) => {
    evt.preventDefault();
    client.send(JSON.stringify({ user, message }));
  };

  useEffect(() => {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = ({ data }) => {
      const msg = JSON.parse(data);
      setMessages((prev) => {
        return [...prev, msg];
      });
    };
    return () => {
      client.close();
    };
  }, []);
  return (
    <div className='App'>
      <header className='App-header'>
        <h1>web sockets</h1>
      </header>
      <div>Nick: {user.nick}</div>
      <div>Room: {user.room}</div>
      <form>
        <label htmlFor='message'>message</label>
        <input name='message' value={message} onChange={handleInputChange} />
        <button onClick={handleClick}>Send</button>
      </form>
      <div id='connections'>{JSON.stringify(messages)}</div>
    </div>
  );
}
