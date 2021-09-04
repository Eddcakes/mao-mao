import { useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import './App.css';

const client = new W3CWebSocket(
  `ws://localhost:${process.env.REACT_APP_SERVER_PORT}/ws`
);

function App() {
  const [nick, setNick] = useState('');
  const [messages, setMessages] = useState([]);
  const handleInputChange = (evt) => {
    setNick(evt.target.value);
  };

  const handleClick = (evt) => {
    evt.preventDefault();
    client.send(JSON.stringify({ nick }));
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
  }, []);
  return (
    <div className='App'>
      <header className='App-header'>
        <h1>web sockets</h1>
      </header>
      <form>
        <label htmlFor='first'>Nick</label>
        <input name='nickname' value={nick} onChange={handleInputChange} />
        <button onClick={handleClick}>Send</button>
      </form>
      <div id='connections'>{JSON.stringify(messages)}</div>
    </div>
  );
}

export default App;
