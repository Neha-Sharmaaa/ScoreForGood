import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Artificially delay to show the nice loader
    setTimeout(async () => {
      try {
        await login(email, password);
      } catch (error) {
        alert('Login failed. Ensure backend is running and user exists.');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '420px', margin: '6rem auto', position: 'relative' }} className="card">
      {isLoading && (
        <div className="loader-overlay">
          <div className="golf-ball"></div>
          <div className="golf-path"></div>
          <p style={{ marginTop: '1rem', color: 'var(--primary)', fontWeight: '600' }}>Swinging into action...</p>
        </div>
      )}
      <h2 style={{ marginBottom: '0.5rem', textAlign: 'center', fontSize: '2rem', fontWeight: 800 }}>Welcome Back</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>Sign in to track your charity progress</p>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email Address</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="admin@scoreforgood.com"
            required 
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••"
            required 
          />
        </div>
        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Sign In</button>
      </form>
    </div>
  );
};

export default Login;
