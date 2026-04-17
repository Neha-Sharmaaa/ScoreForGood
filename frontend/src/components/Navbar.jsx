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
        <Club size={32} color="var(--primary)" />
        ScoreForGood
      </Link>
      <div className="navbar-links">
        {user ? (
          <>
            <span style={{ display: 'flex', alignItems: 'center', fontWeight: '500' }}>
              Welcome, {user.name}
            </span>
            <button className="btn-logout" onClick={handleLogout}>
              <LogOut size={20} />
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
