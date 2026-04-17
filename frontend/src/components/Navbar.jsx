import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Club } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <Club size={32} color="var(--primary)" fill="rgba(16, 185, 129, 0.2)" />
        <span>ScoreForGood</span>
      </Link>
      <div className="navbar-links">
        {user ? (
          <>
            <span style={{ display: 'flex', alignItems: 'center', fontWeight: '500', color: 'var(--text-muted)' }}>
              Logged in as <strong style={{ color: 'var(--text-main)', marginLeft: '6px' }}>{user.name}</strong>
            </span>
            <button className="btn-logout" aria-label="Sign Out" onClick={handleLogout}>
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <Link to="/login" className="btn-primary">Sign In</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
