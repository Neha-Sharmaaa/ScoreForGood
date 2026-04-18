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
          {/* Custom SVG Golf Animation */}
          <div style={{ marginBottom: '2rem' }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="80" r="12" fill="white">
                <animate 
                  attributeName="cy" 
                  values="80;30;80" 
                  dur="1.2s" 
                  repeatCount="indefinite" 
                  keyTimes="0;0.5;1"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
                />
                <animate 
                  attributeName="cx" 
                  values="50;55;50" 
                  dur="1.2s" 
                  repeatCount="indefinite" 
                />
              </circle>
              <path d="M10 90 Q 50 85 90 90" stroke="var(--primary)" strokeWidth="4" fill="none" opacity="0.4" />
              <path d="M45 90 L45 70 M45 70 L55 75 L45 80" stroke="white" strokeWidth="2" fill="var(--primary)" transform="translate(40, -60)" />
            </svg>
          </div>
          <p style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '1.2rem', letterSpacing: '2px', textAlign: 'center' }}>
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
