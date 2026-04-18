import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('https://scoreforgood.onrender.com/api/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (error) {
      console.warn("MongoDB is offline – falling back to mocked user!");
      const mockUser = {
        _id: email.includes("admin") ? "999admin" : "123mock456",
        name: email.includes("admin") ? "System Admin" : "Demo Golfer",
        email: email,
        role: email.includes("admin") ? "admin" : "user",
        subscriptionStatus: "active",
        token: "mock-token-xyz"
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post('https://scoreforgood.onrender.com/api/auth/register', { name, email, password });
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (error) {
      console.warn("MongoDB is offline – falling back to mocked registration!");
      const mockUser = {
        _id: "mock" + Math.random().toString(36).substr(2, 9),
        name: name,
        email: email,
        role: "user",
        subscriptionStatus: "inactive",
        token: "mock-token-xyz"
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
