
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthHandlers } from './constant/api/apiInterceptors';
import { refreshToken, logout } from './redux/slices/userSlice';
import AllRouter from './components/AllRouter';
import { useEffect } from 'react';
const App = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.user.accessToken);

  useEffect(() => {
    setAuthHandlers({
      getAccessToken: () => accessToken,
      refreshToken: () => dispatch(refreshToken()).unwrap(),
      logout: () => dispatch(logout()),
    });
  }, [accessToken, dispatch]);
  return (
    <AllRouter />
  );
}

export default App;
