
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import AllRouter from './components/AllRouter';
import { useEffect, useRef } from 'react';
import { setAuthHandlers } from './constants/api/apiInterceptors';
import { decodeToken, isTokenExpired } from './utils/jwtUtils';
import { getUserById } from './services/userService';
import { refreshToken, logout, setUser, updateAccessToken } from './redux/slices/userSlice';
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
  
  useEffect(() => {
    const init = async () => {
    let accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken || isTokenExpired(accessToken)) {
      console.log("Token expired or not found, refreshing...");
      try {
        await dispatch(refreshToken()).unwrap();
        accessToken = localStorage.getItem('accessToken');
        dispatch(updateAccessToken(accessToken))
      } catch {
        dispatch(logout());
        return;
      }
    }
  
    const decoded = decodeToken(accessToken);
    if (decoded) {
      const user = await getUserById(decoded.nameidentifier);
      dispatch(setUser(user));
    }
  };
    init();
  }, [dispatch]);
  return (
    <AllRouter />
  );
}

export default App;
