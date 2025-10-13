import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import { useAuth } from './context/AuthContext'; 

function App() {
  const { token } = useAuth(); 

  return (
    <Router>
      <div className="container">
        <header className="header-brand" style={{justifyContent: 'space-between', marginBottom: '16px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <div className="logo-badge">MS</div>
            <div style={{textAlign: 'left'}}>
              <h1 style={{margin: 0}}>Meeting Scheduler <span className="muted" style={{fontSize: '0.8rem'}}></span></h1>
              <div className="muted" style={{fontSize: '0.85rem'}}>Organize meetings like a shinobi</div>
            </div>
          </div>
        </header>
        <Routes>
          <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/signup" element={token ? <Navigate to="/dashboard" /> : <Signup />} />
          <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
