import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Club, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
        <Link to="/pricing" style={{ color: 'var(--text-muted)', fontWeight: '500', marginRight: '0.5rem' }}>Pricing</Link>
        <button 
          className="btn-logout" 
          onClick={toggleTheme} 
          style={{ marginRight: '1rem' }}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

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
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" style={{ color: 'var(--text-muted)', fontWeight: '500', alignSelf: 'center' }}>Sign In</Link>
            <Link to="/login" className="btn-primary">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
