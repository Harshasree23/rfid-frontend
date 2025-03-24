import { useState } from 'react';
import './App.css';
import Dashboard from './components/dashboard/dashboard';
import Landing from './components/landing/landing';

function App() {

  const [logged , setLogged] = useState(false);

  return (
   <>
   {
      logged ?
        <Dashboard setLogged={setLogged} /> 
      :
        <Landing setLogged={setLogged} />
   }
   </>
  );
}

export default App;
