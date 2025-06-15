
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthHandlers } from './constant/api/apiInterceptors';
import { refreshToken, logout } from './redux/slices/userSlice';
import AllRouter from './components/AllRouter';
import { useEffect, useRef } from 'react';
const App = () => {
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
