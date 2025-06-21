
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthHandlers } from './constant/api/apiInterceptors';
import { refreshToken, logout, setUser } from './redux/slices/userSlice';
import AllRouter from './components/AllRouter';
import { useEffect, useRef } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getDecryptedUserFromLocalStorage } from './utils/decryptedUtils';
import { getCookie } from './utils/cookieSettings';
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

useEffect(() => {
  const init = async () => {
    const user = await getDecryptedUserFromLocalStorage();
    if (user && accessTokenRef.current) {
      dispatch(setUser(user));
    } else {
      if (getCookie('refreshToken')) {
        try {
          await dispatch(refreshToken()).unwrap();
        } catch {
          dispatch(logout());
        }
      }
    }
  };
  init();
}, [dispatch]);



  return (
    <AllRouter />
  );
}

export default App;
