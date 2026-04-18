import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login started...");
    setIsLoading(true);
    // Increased delay to 3 seconds so user definitely sees it
    setTimeout(async () => {
      console.log("Executing login logic...");
      try {
        await login(email, password);
      } catch (error) {
        console.error("Login Error:", error);
        alert('Login failed. Ensure backend is running and user exists.');
        setIsLoading(false);
      }
    }, 3000);
  };

  return (
    <div style={{ maxWidth: '420px', margin: '6rem auto', position: 'relative' }} className="card">
      {isLoading && (
        <div className="loader-overlay">
          <img 
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHY1ZGp6ampqampqampqampqampqampqampqampqampqampqampqJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpx5OdfH9G0M/giphy.gif" 
            alt="Golfing..." 
            style={{ width: '150px', borderRadius: '12px', marginBottom: '1rem' }}
          />
          <p style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '1.2rem', letterSpacing: '1px' }}>
            SWINGING INTO ACTION...
          </p>
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
