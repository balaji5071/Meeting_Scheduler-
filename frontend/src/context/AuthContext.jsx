import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

// Lightweight JWT decode helper. Avoids depending on package default export
// which can cause issues with some bundlers (Vite) / package versions.
// Returns decoded payload object or null if decoding fails.
const decodeJWT = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    // pad base64 string
    const pad = payload.length % 4;
    const padded = pad ? payload + '='.repeat(4 - pad) : payload;
    const decoded = atob(padded);
    return JSON.parse(decodeURIComponent(
      decoded.split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    ));
  } catch (e) {
    return null;
  }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      try {
        const decoded = decodeJWT(token);
        // If token has expired (exp in seconds), clear it
        if (!decoded) {
          throw new Error('Invalid token');
        }
        if (decoded && decoded.exp && decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          return;
        }

        setUser(decoded.user);
        api.defaults.headers.common['x-auth-token'] = token;
      } catch (error) {
        // Handle invalid token
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['x-auth-token'];
    setToken(null);
    setUser(null);
  };

  const authContextValue = {
    user,
    token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};