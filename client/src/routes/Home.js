import { useState } from 'react';
import { useHistory } from 'react-router';
import { Button } from '../components/Button';
import { useUser } from '../hooks/useUser';
import './Home.css';

export function Home() {
  const { setupUser } = useUser();
  const [roomInput, setRoomInput] = useState('');
  const [nickInput, setNickInput] = useState('');
  const [errors, setErrors] = useState([]);
  let history = useHistory();

  const handleInput = (evt) => {
    resetErrors();
    setRoomInput(evt.target.value);
  };
  const handleNickInput = (evt) => {
    resetErrors();
    setNickInput(evt.target.value);
  };

  function resetErrors() {
    if (errors.length > 0) {
      setErrors([]);
    }
  }

  const handleJoin = () => {
    resetErrors();
    if (nickInput.trim().length < 1) {
      setErrors((errors) => [
        ...errors,
        { for: 'nick', message: 'You must have a nick' },
      ]);
    }
    if (roomInput.trim().length < 1) {
      setErrors((errors) => [
        ...errors,
        { for: 'room', message: 'You must have a room' },
      ]);
    }
    if (errors.length < 1) {
      setupUser({ room: roomInput, nick: nickInput });
      history.push(`/${roomInput}`);
    }
  };
  return (
    <div className='menu'>
      <h1>Mao-mao</h1>
      <input
        placeholder='Enter your nick'
        value={nickInput}
        onChange={handleNickInput}
      />
      <Button text='create a new room' />
      Or
      <input
        placeholder='join an existing room'
        value={roomInput}
        onChange={handleInput}
      />
      <Button handleClick={handleJoin} text='join' />
      {errors.length > 0 &&
        errors.map((error, idx) => (
          <span className='userError' key={error.for}>
            {error.message}
          </span>
        ))}
    </div>
  );
}
