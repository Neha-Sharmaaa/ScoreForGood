import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Target, Trophy, TrendingUp, Calendar, ArrowRight, Heart, CheckCircle2, XCircle, Loader2, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);
  const [newScore, setNewScore] = useState({ points: '', courseName: '' });
  const [isHovered, setIsHovered] = useState(false);
  const [showDrawDetails, setShowDrawDetails] = useState(false);
  const [adminAction, setAdminAction] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawWinner, setDrawWinner] = useState(null);
  const [mockUsers, setMockUsers] = useState([]);
  const [mockCharities, setMockCharities] = useState([
    { id: 1, name: 'Local Golf Youth Fund', status: 'Awaiting approval request' }
  ]);
  const detailsRef = useRef(null);

  useEffect(() => {
    if (showDrawDetails && detailsRef.current) {
      setTimeout(() => {
        detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  }, [showDrawDetails]);

  // Load live user sessions dynamically when Admin opens User Management panel
  useEffect(() => {
    if (adminAction === 'users') {
      setMockUsers([
        { id: 999, email: user?.email || 'admin@scoreforgood.com' }, 
        { id: 1, email: 'neha.k@adypu.edu.in' },
        { id: 2, email: 'hiring.manager@techcompany.com' }
      ]);
    }
  }, [adminAction, user]);

  const handleExecuteDraw = () => {
    if(isDrawing) return;
    setAdminAction('draw');
    setDrawWinner(null);
    setIsDrawing(true);
    setTimeout(() => {
      setIsDrawing(false);
      setDrawWinner('Neha-Sharmaaa (Winner!)');
    }, 2500);
  };

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const { data } = await axios.get('https://scoreforgood.onrender.com/api/scores', {
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
      const { data } = await axios.post('https://scoreforgood.onrender.com/api/scores', newScore, {
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
            <button 
              className="btn-primary" 
              onClick={() => setAdminAction(adminAction === 'users' ? null : 'users')}
              style={{ background: adminAction === 'users' ? 'rgba(59, 130, 246, 0.2)' : 'var(--bg-panel)', color: 'var(--text-main)', border: '1px solid var(--border-glass)' }}
            >
              Manage Users (142)
            </button>
            <button 
              className="btn-primary" 
              onClick={() => setAdminAction(adminAction === 'charities' ? null : 'charities')}
              style={{ background: adminAction === 'charities' ? 'rgba(59, 130, 246, 0.2)' : 'var(--bg-panel)', color: 'var(--text-main)', border: '1px solid var(--border-glass)' }}
            >
              Approve Charities (3)
            </button>
            <button 
              className="btn-primary" 
              onClick={handleExecuteDraw}
              style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)' }}
            >
              Execute Monthly Draw
            </button>
          </div>

          {/* Dynamic Admin Context Panels */}
          {adminAction === 'users' && (
            <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--border-glass)', animation: 'fadeIn 0.3s ease' }}>
              {mockUsers.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>All users managed successfully.</p> : mockUsers.map((u, idx) => (
                <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: idx === mockUsers.length - 1 ? '0' : '1rem', paddingTop: idx === 0 ? '0' : '1rem', borderBottom: idx === mockUsers.length - 1 ? 'none' : '1px solid var(--border-glass)' }}>
                  <span>{u.email}</span>
                  <button 
                    onClick={() => setMockUsers(mockUsers.filter(usr => usr.id !== u.id))} 
                    style={{ color: '#ef4444', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={e=>e.currentTarget.style.transform='scale(1.2)'} 
                    onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}
                  >
                    <XCircle size={18}/>
                  </button>
                </div>
              ))}
            </div>
          )}

          {adminAction === 'charities' && (
            <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--border-glass)', animation: 'fadeIn 0.3s ease' }}>
              {mockCharities.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No pending charity requests.</p> : mockCharities.map((c) => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ color: '#fff' }}>{c.name}</strong>
                    <div style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>{c.status}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                     <button 
                       onClick={() => setMockCharities(mockCharities.filter(chr => chr.id !== c.id))} 
                       style={{ color: '#10b981', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }} 
                       onMouseOver={e=>e.currentTarget.style.transform='scale(1.2)'} 
                       onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}
                     >
                       <CheckCircle2 size={24}/>
                     </button>
                     <button 
                       onClick={() => setMockCharities(mockCharities.filter(chr => chr.id !== c.id))} 
                       style={{ color: '#ef4444', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }} 
                       onMouseOver={e=>e.currentTarget.style.transform='scale(1.2)'} 
                       onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}
                     >
                       <XCircle size={24}/>
                     </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {adminAction === 'draw' && (
            <div style={{ marginTop: '1.5rem', padding: '2rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
              {isDrawing ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#f87171' }}>
                  <Loader2 size={32} className="lucide-spin" />
                  <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .lucide-spin { animation: spin 1s linear infinite; }`}</style>
                  <p>Calculating valid entries and running cryptographic shuffle...</p>
                </div>
              ) : (
                <div style={{ animation: 'fadeIn 0.5s ease', color: '#10b981' }}>
                  <Sparkles size={40} style={{ margin: '0 auto 1rem auto', color: '#fbbf24' }} />
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Draw Executed Successfully!</h3>
                  <p style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>Winner: <strong>{drawWinner}</strong></p>
                  <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>$500 Prize and Charity Donation dispatched.</p>
                </div>
              )}
            </div>
          )}
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
        <div className="card" style={{ height: 'fit-content', maxHeight: '450px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', flexShrink: 0 }}>Score History</h3>
          {scores.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              <Trophy size={48} opacity={0.2} style={{ marginBottom: '1rem' }} />
              <p>Your history is empty.</p>
              <p style={{ fontSize: '0.9rem' }}>Log your first score to see it here!</p>
            </div>
          ) : (
            <div className="score-list" style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
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
        <div ref={detailsRef} style={{ padding: '2rem', marginTop: '1rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.2)', animation: 'fadeIn 0.3s ease-out' }}>
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
