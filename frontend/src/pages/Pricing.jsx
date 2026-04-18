import React from 'react';
import { Check, Zap, Shield, Crown } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Pricing = () => {
  const { user } = useAuth();

  const handleSubscribe = async (plan) => {
    try {
      // In a real app, this would call your backend which redirects to Stripe
      alert(`Redirecting to Stripe for ${plan} plan... \n\n(Demo: Success simulation triggered)`);
      // Simulating Stripe Success
      window.location.href = '/dashboard?success=true';
    } catch (err) {
      console.error(err);
    }
  };

  const plans = [
    {
      name: 'Monthly Pro',
      price: '£9',
      period: '/month',
      description: 'Standard access to the monthly prize draw and personal analytics.',
      features: ['1 Monthly Prize Draw Entry', 'Basic Score Tracking', 'Community Access', 'Email Notifications'],
      buttonText: 'Get Started',
      accent: 'var(--primary)'
    },
    {
      name: 'Yearly Elite',
      price: '£79',
      period: '/year',
      desc: 'Most Popular',
      description: 'The best value for committed golfers wanting to maximize their impact.',
      features: ['12 Monthly Prize Draw Entries', 'Priority Draw Notifications', 'Advanced Analytics Dashboard', 'Annual Impact Report', '3 Months Free (£29 savings)'],
      buttonText: 'Go Elite',
      accent: 'var(--premium-gradient)',
      premium: true
    }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '4rem auto', padding: '0 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>Elevate Your Game & Impact</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Choose the tier that fits your swing. Every subscription fuels our monthly charity jackpot.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {plans.map((plan, i) => (
          <div 
            key={i} 
            className="card" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              border: plan.premium ? '1px solid #8b5cf6' : '1px solid var(--border-glass)',
              background: plan.premium ? 'linear-gradient(145deg, rgba(99, 102, 241, 0.05) 0%, transparent 100%)' : 'var(--card-bg)'
            }}
          >
            {plan.premium && (
              <div style={{ alignSelf: 'flex-start', background: 'var(--premium-gradient)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase' }}>
                Most Popular
              </div>
            )}
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{plan.name}</h2>
            <div style={{ margin: '1.5rem 0' }}>
              <span style={{ fontSize: '3rem', fontWeight: 800 }}>{plan.price}</span>
              <span style={{ color: 'var(--text-muted)' }}>{plan.period}</span>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', height: '3rem' }}>{plan.description}</p>
            
            <div style={{ flex: 1, marginBottom: '2rem' }}>
              {plan.features.map((feature, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                  <Check size={18} color={plan.premium ? '#8b5cf6' : 'var(--primary)'} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button 
              className="btn-primary" 
              onClick={() => handleSubscribe(plan.name)}
              style={{ 
                width: '100%', 
                background: plan.premium ? 'var(--premium-gradient)' : 'var(--primary)',
                color: '#fff'
              }}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
        <div>
          <Shield size={32} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
          <h3>Secure Checkout</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>All transactions are secured by Stripe with industry-leading encryption.</p>
        </div>
        <div>
          <Zap size={32} color="#8b5cf6" style={{ margin: '0 auto 1rem' }} />
          <h3>Instant Access</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Upgrade takes effect immediately. Start tracking scores and winning prizes.</p>
        </div>
        <div>
          <Crown size={32} color="#fbbf24" style={{ margin: '0 auto 1rem' }} />
          <h3>VIP Support</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pro members get priority draw notifications and premium support.</p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
