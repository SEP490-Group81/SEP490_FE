
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import AllRouter from './components/AllRouter';
import { useEffect, useRef } from 'react';
import { setAuthHandlers } from './constants/api/apiInterceptors';
import { refreshToken } from './services/authService';
import { logout } from './redux/slices/userSlice';

function App() {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.user.accessToken);
  const accessTokenRef = useRef(accessToken);
  useEffect(() => {
    accessTokenRef.current = accessToken;
    console.log("Access token updated in App component: " + accessTokenRef.current);
  }, [accessToken]);
  useEffect(() => {
    setAuthHandlers({
      getAccessToken: () => accessTokenRef.current,
      refreshToken: () => dispatch(refreshToken()).unwrap(),
      logout: () => dispatch(logout()),
    });
  }, [dispatch]);
  return (
    <AllRouter />
  );
}

export default App;
