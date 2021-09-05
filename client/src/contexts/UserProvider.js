import { UserContext } from './UserContext';
import { useProvideUser } from '../hooks/useProvideUser';

export function UserProvider({ children }) {
  const user = useProvideUser();
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
