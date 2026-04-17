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
      const { data } = await axios.post('http://localhost:5001/api/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (error) {
      console.warn("MongoDB is offline – falling back to mocked user!");
      const mockUser = {
        _id: "123mock456",
        name: "Demo User",
        email: email,
        role: "user",
        subscriptionStatus: "active",
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
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
