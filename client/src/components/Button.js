import './Button.css';

export function Button({ handleClick = () => {}, text = 'text' }) {
  return (
    <button className='btn' onClick={handleClick}>
      {text}
    </button>
  );
}
