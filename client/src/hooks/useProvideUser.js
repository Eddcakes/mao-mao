import { useState } from 'react';

export function useProvideUser() {
  const [user, setUser] = useState(null);
  const setupUser = (details) => {
    const { nick, room } = details;
    setUser({ nick, room });
    // not using local storage atm, not sure how to allow multiple tabs in different rooms
  };
  return {
    user,
    setupUser,
  };
}
