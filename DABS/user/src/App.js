
import { useDispatch } from 'react-redux';
import './App.css';
import AllRouter from './components/AllRouter';
import { useEffect } from 'react';
import { restoreSession } from './redux/slices/userSlice';
function App() {
 
  return (
     <AllRouter/>
  );
}

export default App;
