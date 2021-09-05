import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home } from './routes/Home';
import { Room } from './routes/Room';
import { UserProvider } from './contexts/UserProvider';
import { PrivateRoute } from './routes/PrivateRoute';

function App() {
  return (
    <UserProvider>
      <Router>
        <Switch>
          <PrivateRoute path='/:roomId'>
            <Room />
          </PrivateRoute>
          <Route path='/' exact>
            <Home />
          </Route>
        </Switch>
      </Router>
    </UserProvider>
  );
}

export default App;
