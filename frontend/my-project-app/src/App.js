// import logo from './logo.svg';
import './App.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomerInfo from './components/Customer';

function App() {
  return (
    <div className="App">
        <div className="App-container">
            <CustomerInfo/>
        </div>
    </div>
  );
}

export default App;
