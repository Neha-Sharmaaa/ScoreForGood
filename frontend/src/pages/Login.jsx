import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Artificial delay for premium feel
    setTimeout(async () => {
      try {
        if (isSignUp) {
          await register(name, email, password);
        } else {
          await login(email, password);
        }
      } catch (error) {
        console.error("Auth Error:", error);
        alert('Authentication failed. Please try again.');
        setIsLoading(false);
      }
    }, 2000);
  };

  return (
    <div style={{ maxWidth: '420px', margin: '6rem auto', position: 'relative' }} className="card">
      {isLoading && (
        <div className="loader-overlay">
          <div style={{ marginBottom: '2rem' }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="80" r="12" fill="white">
                <animate attributeName="cy" values="80;30;80" dur="1.2s" repeatCount="indefinite" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
                <animate attributeName="cx" values="50;55;50" dur="1.2s" repeatCount="indefinite" />
              </circle>
              <path d="M10 90 Q 50 85 90 90" stroke="var(--primary)" strokeWidth="4" fill="none" opacity="0.4" />
              <path d="M45 90 L45 70 M45 70 L55 75 L45 80" stroke="white" strokeWidth="2" fill="var(--primary)" transform="translate(40, -60)" />
            </svg>
          </div>
          <p style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '1.2rem', letterSpacing: '2px', textAlign: 'center' }}>
            {isSignUp ? 'CREATING ACCOUNT...' : 'SWINGING INTO ACTION...'}
          </p>
        </div>
      )}
      <h2 style={{ marginBottom: '0.5rem', textAlign: 'center', fontSize: '2.25rem', fontWeight: 800 }}>
        {isSignUp ? 'Join ScoreForGood' : 'Welcome Back'}
      </h2>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        {isSignUp ? 'Start your mission for good today' : 'Sign in to track your charity progress'}
      </p>
      
      <form onSubmit={handleSubmit}>
        {isSignUp && (
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="John Doe"
              required 
            />
          </div>
        )}
        <div className="input-group">
          <label>Email Address</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="golfer@example.com"
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
        <button type="submit" className="btn-primary" style={{ width: '100%', marginBottom: '1.5rem' }}>
          {isSignUp ? 'Create Account' : 'Sign In'}
        </button>
      </form>

      <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem', marginTop: '1rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button 
            onClick={() => {
              setIsSignUp(!isSignUp);
              setName('');
              setEmail('');
              setPassword('');
            }}
            style={{ 
              background: 'none', 
              color: 'var(--primary)', 
              fontWeight: '700', 
              marginLeft: '8px',
              fontSize: '0.9rem',
              padding: 0
            }}
          >
            {isSignUp ? 'Sign In' : 'Register Now'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
