import { useReactiveVar } from '@apollo/client';
import { HelmetProvider } from 'react-helmet-async';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { darkModeVar, isLoggedInVar } from './apollo';
import routes from './routes';
import Home from './screens/Home';
import Login from './screens/Login';
import NotFound from './screens/NotFound';
import SignUp from './screens/SignUp';
import { darkTheme, lightTheme, GlobalStyles } from './styles';

const App: React.FC = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const darkMode = useReactiveVar(darkModeVar);
  return (
    <>
      <HelmetProvider>
        <ThemeProvider theme={ darkMode ? darkTheme : lightTheme }>
          <GlobalStyles />
          <Router>
            <Switch>
              <Route path={routes.home} exact>
                { isLoggedIn ? (
                  <Home />
                ) : (
                  <Login />
                ) }
              </Route>
              {/* Public ONLY route */}
              {!isLoggedIn ? (
                <Route path={routes.signUp}>
                  <SignUp/>
                </Route>
              ) : null }
              <Route>
                <NotFound/>
              </Route>
            </Switch>
          </Router>
        </ThemeProvider>
      </HelmetProvider>
    </>
  );
}

export default App;
