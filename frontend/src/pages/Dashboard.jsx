import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);
  const [newScore, setNewScore] = useState({ points: '', courseName: '' });

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/scores', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setScores(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchScores();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5001/api/scores', newScore, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setScores([data, ...scores]);
      setNewScore({ points: '', courseName: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        {user?.subscriptionStatus === 'active' ? (
           <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓ Active Subscriber</span>
        ) : (
           <button className="btn-primary">Upgrade to Premium</button>
        )}
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Log New Score</h3>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Course Name</label>
              <input 
                type="text" 
                required 
                value={newScore.courseName}
                onChange={e => setNewScore({...newScore, courseName: e.target.value})}
              />
            </div>
            <div className="input-group">
              <label>Stableford Points</label>
              <input 
                type="number" 
                required 
                value={newScore.points}
                onChange={e => setNewScore({...newScore, points: e.target.value})}
              />
            </div>
            <button type="submit" className="btn-primary">Save Score</button>
          </form>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Recent Scores</h3>
          {scores.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No scores logged yet.</p>
          ) : (
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {scores.map(score => (
                <li key={score._id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                  <div>
                    <strong>{score.courseName}</strong>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      {new Date(score.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                    {score.points} pts
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <div className="card" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <h3>Monthly Charity Draw</h3>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
          You need an active subscription and at least one score this month to enter.
        </p>
        <button className="btn-primary" disabled>Check Eligibility</button>
      </div>
    </div>
  );
};

export default Dashboard;
