import React, { useState } from 'react';
import * as api from '../api';

function LoginGate({ onAuthenticated }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login(password);
      if (res.data.success) {
        localStorage.setItem('expense_token', res.data.token);
        onAuthenticated();
      }
    } catch (err) {
      setError('Invalid password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">🔐</div>
        <h2>Expense Tracker</h2>
        <p className="login-subtitle">Enter password to access expenses</p>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="login-input"
            required
            autoFocus
          />
          {error && <span className="login-error">{error}</span>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Verifying...' : '🔓 Unlock'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginGate;
