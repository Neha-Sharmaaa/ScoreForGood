import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Target, Trophy, TrendingUp, Calendar, ArrowRight, Heart, 
  CheckCircle2, XCircle, Loader2, Sparkles, PartyPopper,
  LayoutDashboard, History, Settings, Users, Gift, HelpCircle, Crown
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [scores, setScores] = useState([]);
  const [newScore, setNewScore] = useState({ points: '', courseName: '' });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const detailsRef = useRef(null);

  // Check for success param after payment
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('success')) {
      setShowSuccessModal(true);
    }
  }, [location]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const { data } = await axios.get('https://scoreforgood.onrender.com/api/scores', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setScores(data);
      } catch (err) {
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
      const mockScore = { 
        ...newScore, 
        _id: Math.random().toString(36).substr(2, 9), 
        date: new Date().toISOString() 
      };
      setScores([mockScore, ...scores]);
    }
    setNewScore({ points: '', courseName: '' });
  };

  const averageScore = scores.length ? (scores.reduce((a, b) => a + Number(b.points), 0) / scores.length).toFixed(1) : 0;
  const bestScore = scores.length ? Math.max(...scores.map(s => Number(s.points))) : 0;

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* Sidebar - BirdiePay Style */}
      <div style={{ 
        width: '260px', 
        borderRight: '1px solid var(--border-glass)',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', paddingLeft: '0.75rem' }}>Menu</div>
        
        <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <SidebarLink icon={<History size={20}/>} label="History" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
        <SidebarLink icon={<Gift size={20}/>} label="Prize Draws" active={activeTab === 'draws'} onClick={() => setActiveTab('draws')} />
        <SidebarLink icon={<Heart size={20}/>} label="My Charity" active={activeTab === 'charity'} onClick={() => setActiveTab('charity')} />
        
        <div style={{ marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', paddingLeft: '0.75rem' }}>Settings</div>
        <SidebarLink icon={<Settings size={20}/>} label="Account" active={activeTab === 'account'} onClick={() => setActiveTab('account')} />
        <SidebarLink icon={<HelpCircle size={20}/>} label="Support" active={activeTab === 'support'} onClick={() => setActiveTab('support')} />

        {/* Premium Upgrade CTA in Sidebar */}
        <div style={{ marginTop: 'auto', padding: '1.5rem', background: 'var(--premium-gradient)', borderRadius: '16px', color: 'white' }}>
          <Crown size={24} style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>BIRDIE PRO</div>
          <p style={{ fontSize: '0.8rem', opacity: 0.9, marginBottom: '1rem' }}>Enter 10x more draws & get pro analytics.</p>
          <Link to="/pricing" style={{ 
            display: 'block', 
            textAlign: 'center', 
            background: 'white', 
            color: 'var(--secondary)', 
            padding: '0.5rem', 
            borderRadius: '8px', 
            fontWeight: 700, 
            fontSize: '0.85rem' 
          }}>Upgrade Now</Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '2.5rem 3rem', overflowY: 'auto' }}>
        
        {/* Success Modal */}
        {showSuccessModal && (
          <div className="loader-overlay" style={{ zIndex: 2000 }}>
             <div className="card" style={{ maxWidth: '400px', textAlign: 'center', borderColor: 'var(--primary)' }}>
                <Sparkles size={48} color="var(--primary)" style={{ margin: '0 auto 1.5rem' }} />
                <h2 style={{ marginBottom: '1rem' }}>Welcome to Elite!</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Your subscription is confirmed. You now have 12 tickets in every monthly draw!</p>
                <button className="btn-primary" style={{ width: '100%' }} onClick={() => setShowSuccessModal(false)}>Get Started</button>
             </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <>
            <div className="dashboard-header">
              <div>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '2.5rem' }}>
                  Welcome back, {user?.name?.split(' ')[0] || 'Golfer'}! <Sparkles color="#fbbf24" size={32} />
                </h1>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '1.1rem' }}>Your current handicap rank is <strong style={{ color: 'var(--primary)' }}>Top 15%</strong></p>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="status-badge" style={{ padding: '0.75rem 1.25rem', background: 'rgba(99, 102, 241, 0.1)', borderColor: 'var(--secondary)', color: 'var(--secondary)' }}>
                    <Users size={18} /> Community Rank: #42
                </div>
                {user?.subscriptionStatus === 'active' || showSuccessModal ? (
                  <div className="status-badge" style={{ padding: '0.75rem 1.25rem', background: 'var(--premium-gradient)', border: 'none', color: 'white' }}>
                    <Crown size={18} /> Elite Member
                  </div>
                ) : (
                  <Link to="/pricing" className="btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--premium-gradient)', border: 'none' }}>
                    Go Elite <Crown size={18} />
                  </Link>
                )}
              </div>
            </div>

            {/* Analytics Row */}
            <div className="stats-row">
              <StatCard icon={<Target size={24} />} title="Total Rounds" value={scores.length} color="var(--primary)" />
              <StatCard icon={<TrendingUp size={24} />} title="Avg. Stableford" value={averageScore} color="var(--secondary)" />
              <StatCard icon={<Trophy size={24} />} title="Personal Best" value={bestScore} color="#fbbf24" />
            </div>

            <div className="dashboard-grid">
              {/* Main Card: Charity Impact Slider */}
              <div className="card" style={{ gridColumn: 'span 2', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, transparent 100%)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                   <div>
                      <h3 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Heart color="#ef4444" fill="#ef4444" size={24} /> Your Positive Impact
                      </h3>
                      <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Every point you log contributes to Global Golf Foundation.</p>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>£142.50</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Donated</div>
                   </div>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                      <span>Monthly Goal Progress</span>
                      <span style={{ fontWeight: 700 }}>85%</span>
                   </div>
                   <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '85%', height: '100%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary-glow)' }}></div>
                   </div>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>You're only 3.5 points away from unlocking the next charity multiplier!</p>
              </div>

              {/* Quick Log */}
              <div className="card">
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={20} color="var(--primary)"/> Log Score
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="input-group">
                    <input type="text" placeholder="Course Name" required value={newScore.courseName} onChange={e => setNewScore({...newScore, courseName: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <input type="number" placeholder="Stableford Points" min="0" max="100" required value={newScore.points} onChange={e => setNewScore({...newScore, points: e.target.value})} />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem' }}>Publish Round</button>
                </form>
              </div>
            </div>
          </>
        )}

        {activeTab === 'history' && (
          <div className="card" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <h2 style={{ marginBottom: '2rem' }}>Round History</h2>
            <div className="score-list">
              {scores.map((score, idx) => (
                <div key={score._id} className="score-item" style={{ animationDelay: `${idx * 0.05}s`, padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', border: '1px solid var(--border-glass)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.25rem' }}>{score.courseName}</div>
                    <div style={{ color: 'var(--text-muted)' }}>{new Date(score.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.75rem' }}>{score.points}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Points</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'draws' && (
          <div className="card" style={{ animation: 'fadeIn 0.5s ease-out', textAlign: 'center', padding: '4rem 2rem' }}>
            <Gift size={64} color="var(--secondary)" style={{ marginBottom: '1.5rem' }} />
            <h2 style={{ marginBottom: '1rem' }}>Monthly Prize Draws</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 2rem' }}>
              Every point you log enters you into our monthly prize draws. Premium members get 12x the entries!
            </p>
            <div className="status-badge" style={{ margin: '0 auto', width: 'fit-content', padding: '1rem 2rem' }}>
              Next Draw: May 1st, 2026
            </div>
          </div>
        )}

        {activeTab === 'charity' && (
          <div className="card" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <h2 style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Heart color="#ef4444" fill="#ef4444" /> Charity Partner
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div className="card" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Current Partner</h4>
                <h3 style={{ marginBottom: '1rem' }}>Global Golf Foundation</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Providing access to golf facilities and coaching for underprivileged youth across the globe.
                </p>
              </div>
              <div className="card" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <h4 style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>Your Contribution</h4>
                <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>£142.50</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Thank you for making a difference.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="card" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <h2 style={{ marginBottom: '2rem' }}>Account Settings</h2>
            <div style={{ maxWidth: '400px' }}>
              <div className="input-group">
                <label>Display Name</label>
                <input type="text" value={user?.name} readOnly />
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" value={user?.email} readOnly />
              </div>
              <div className="input-group">
                <label>Subscription</label>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                  {user?.subscriptionStatus === 'active' ? 'Elite Member' : 'Free Tier'}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="card" style={{ animation: 'fadeIn 0.5s ease-out', textAlign: 'center', padding: '4rem 2rem' }}>
            <HelpCircle size={64} color="var(--text-muted)" style={{ marginBottom: '1.5rem' }} />
            <h2 style={{ marginBottom: '1rem' }}>Need Help?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Our team is here to support your mission for good.</p>
            <button className="btn-primary">Contact Support</button>
          </div>
        )}
      </div>
    </div>
  );
};

const SidebarLink = ({ icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '1rem', 
      padding: '0.85rem 1rem', 
      borderRadius: '12px', 
      cursor: 'pointer',
      background: active ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
      color: active ? 'var(--secondary)' : 'var(--text-muted)',
      fontWeight: active ? 700 : 500,
      transition: 'var(--transition)'
    }}
    onMouseOver={e => !active && (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
    onMouseOut={e => !active && (e.currentTarget.style.background = 'transparent')}
  >
    {icon}
    <span>{label}</span>
  </div>
);

const StatCard = ({ icon, title, value, color }) => (
  <div className="card" style={{ padding: '1.5rem', flex: 1, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
    <div style={{ 
      width: '50px', 
      height: '50px', 
      borderRadius: '12px', 
      background: `${color}15`, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: color
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</div>
      <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{value}</div>
    </div>
  </div>
);

export default Dashboard;

