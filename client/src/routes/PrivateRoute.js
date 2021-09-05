import { Redirect, Route } from 'react-router';
import { useUser } from '../hooks/useUser';
import { Room } from './Room';

export function PrivateRoute({ children, ...rest }) {
  let { user } = useUser();
  return (
    <Route
      {...rest}
      render={() => (user != null ? <Room /> : <Redirect to='/' />)}
    />
  );
}
