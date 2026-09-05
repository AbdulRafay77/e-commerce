import { createContext, useContext, useState } from 'react';
import api, { setAccessToken as setApiToken } from '../api/axios.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setAccessToken(res.data.accessToken);
    setApiToken(res.data.accessToken);
    setUser(res.data.user);
  };

  const signup = async (username, email, password) => {
    const res = await api.post('/auth/signup', { username, email, password });
    setAccessToken(res.data.accessToken);
    setApiToken(res.data.accessToken);
    setUser(res.data.user);
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setAccessToken(null);
    setApiToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);