import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Target, Trophy, TrendingUp, Calendar, ArrowRight, Heart } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);
  const [newScore, setNewScore] = useState({ points: '', courseName: '' });
  const [isHovered, setIsHovered] = useState(false);
  const [showDrawDetails, setShowDrawDetails] = useState(false);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/scores', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setScores(data);
      } catch (err) {
        // Advanced Mock Data Fallback
        setScores([
          { _id: '1', courseName: 'Pebble Beach Golf Links', points: 38, date: new Date().toISOString() },
          { _id: '2', courseName: 'Augusta National', points: 41, date: new Date(Date.now() - 86400000).toISOString() },
          { _id: '3', courseName: 'St Andrews Links', points: 36, date: new Date(Date.now() - 172800000).toISOString() }
        ]);
      }
    };
    if (user) fetchScores();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newScore.courseName || !newScore.points) return;
    try {
      const { data } = await axios.post('http://localhost:5001/api/scores', newScore, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setScores([data, ...scores]);
    } catch (err) {
      // Mock score addition
      const mockScore = { 
        ...newScore, 
        _id: Math.random().toString(36).substr(2, 9), 
        date: new Date().toISOString() 
      };
      setScores([mockScore, ...scores]);
    }
    setNewScore({ points: '', courseName: '' });
  };

  // Stats Calculations
  const averageScore = scores.length ? (scores.reduce((a, b) => a + Number(b.points), 0) / scores.length).toFixed(1) : 0;
  const bestScore = scores.length ? Math.max(...scores.map(s => Number(s.points))) : 0;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* Header Section */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name.split(' ')[0] || 'Golfer'}! 🏌️‍♂️</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem', fontSize: '1.1rem' }}>
            Ready to log your latest achievements?
          </p>
        </div>
        
        {user?.subscriptionStatus === 'active' ? (
           <div className="status-badge" style={{ padding: '0.75rem 1.25rem' }}>
             <Trophy size={18} /> Active Premium Member
           </div>
        ) : (
           <button className="btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
             Upgrade Plan <ArrowRight size={18} />
           </button>
        )}
      </div>

      {/* Admin Privilege Panel */}
      {user?.role === 'admin' && (
        <div className="card" style={{ marginBottom: '2.5rem', borderColor: 'var(--primary)', background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.05) 0%, transparent 100%)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontSize: '1.25rem' }}>
            System Administrator Panel
          </h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            Elevated privileges. Manage platform users, execute global draws, and configure charities.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ background: 'var(--bg-panel)', color: 'var(--text-main)', border: '1px solid var(--border-glass)' }}>Manage Users (142)</button>
            <button className="btn-primary" style={{ background: 'var(--bg-panel)', color: 'var(--text-main)', border: '1px solid var(--border-glass)' }}>Approve Charities (3)</button>
            <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)' }}>Execute Monthly Draw</button>
          </div>
        </div>
      )}

      {/* Analytics Row */}
      <div className="stats-row">
        <div className="stat-card">
          <Target className="stat-icon" size={100} color="var(--primary)" />
          <h4>Total Rounds</h4>
          <span className="value">{scores.length}</span>
        </div>
        <div className="stat-card">
          <TrendingUp className="stat-icon" size={100} color="var(--secondary)" />
          <h4>Avg. Stableford</h4>
          <span className="value">{averageScore}</span>
        </div>
        <div className="stat-card">
          <Trophy className="stat-icon" size={100} color="#fbbf24" />
          <h4>Personal Best</h4>
          <span className="value">{bestScore}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Left Column: Form */}
        <div className="card" style={{ position: 'relative', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} color="var(--primary)"/> Log New Score
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Course Name</label>
              <input 
                type="text" 
                placeholder="e.g., TPC Sawgrass"
                required 
                value={newScore.courseName}
                onChange={e => setNewScore({...newScore, courseName: e.target.value})}
              />
            </div>
            <div className="input-group">
              <label>Points Scored (Stableford)</label>
              <input 
                type="number" 
                placeholder="0 - 50"
                min="0"
                max="100"
                required 
                value={newScore.points}
                onChange={e => setNewScore({...newScore, points: e.target.value})}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Publish Score
            </button>
          </form>
        </div>

        {/* Right Column: List */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Score History</h3>
          {scores.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              <Trophy size={48} opacity={0.2} style={{ marginBottom: '1rem' }} />
              <p>Your history is empty.</p>
              <p style={{ fontSize: '0.9rem' }}>Log your first score to see it here!</p>
            </div>
          ) : (
            <div className="score-list">
              {scores.map((score, idx) => (
                <div 
                  key={score._id} 
                  className="score-item"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div>
                    <div className="score-course">{score.courseName}</div>
                    <div className="score-date">
                      {new Date(score.date).toLocaleDateString(undefined, {
                        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </div>
                  </div>
                  <div className="score-points">
                    {score.points} <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>pts</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Exclusive Monthly Charity Draw Section */}
      <div 
        className="charity-banner"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ transform: isHovered ? 'scale(1.02)' : 'scale(1)', transition: 'var(--transition)' }}
      >
        <div className="charity-content">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Heart color="#ef4444" fill={isHovered ? "#ef4444" : "transparent"} size={24} style={{ transition: 'var(--transition)' }}/>
            ScoreForGood Monthly Draw
          </h3>
          <p>
            You have {scores.length} qualifying entries for this month's premium draw! 
            Portion of subscription is actively going to your default charity.
          </p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => setShowDrawDetails(!showDrawDetails)}
          style={{ background: '#3b82f6', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)' }}
        >
          {showDrawDetails ? 'Hide Details' : 'View Details'}
        </button>
      </div>

      {/* Expandable Draw Details Panel */}
      {showDrawDetails && (
        <div style={{ padding: '2rem', marginTop: '1rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.2)', animation: 'fadeIn 0.3s ease-out' }}>
          <h4 style={{ color: '#3b82f6', marginBottom: '0.75rem', fontSize: '1.2rem' }}>🎉 Upcoming Draw Status</h4>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            The next monthly draw occurs on the last Friday of this month. By actively tracking {scores.length} rounds, you have successfully secured {scores.length} entries into the raffle pool! Good luck!
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.95rem' }}>
             <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-glass)', padding: '1rem', borderRadius: '12px' }}>
               <strong style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Prize Pool</strong>
               <span style={{ fontSize: '1.1rem', color: '#fff', fontWeight: '600' }}>$500 Pro Shop Voucher</span>
             </div>
             <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-glass)', padding: '1rem', borderRadius: '12px' }}>
               <strong style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Your Supported Charity</strong>
               <span style={{ fontSize: '1.1rem', color: '#fff', fontWeight: '600' }}>Global Golf Foundation</span>
             </div>
             <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-glass)', padding: '1rem', borderRadius: '12px' }}>
               <strong style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Win Probability</strong>
               <span style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: '600' }}>High ({scores.length} Tickets)</span>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
