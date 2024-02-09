import { useEffect, useState } from 'react';
import './App.css';
import Login from './components/login';
import Layout from './components/layout';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null)
  const LoggedIn = (value) => {
    setIsLoggedIn(value)
  }
  const addData = (value) => {
    setUserData(value)
  }
  useEffect(() => {
    
  }, [isLoggedIn])
  return (
    <div className="App">
      {!isLoggedIn ? <Login setLoggedIn={LoggedIn} setData={addData}/> : <Layout data={userData}/>}
      
    </div>
  );
}

export default App;
