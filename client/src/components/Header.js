import React from 'react';

function Header({ completed, total, page, onNavigate }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <header className="header">
      <div className="header-title">
        <span className="icon">🪔</span>
        <h1>Kothai &amp; Kannan — Shashtipurti</h1>
      </div>
      <nav className="header-nav">
        <button
          className={`nav-btn${page === 'home' ? ' active' : ''}`}
          onClick={() => onNavigate('home')}
        >
          🏠 Home
        </button>
        <button
          className={`nav-btn${page === 'tasks' ? ' active' : ''}`}
          onClick={() => onNavigate('tasks')}
        >
          📋 Arrangements
        </button>
        <button
          className={`nav-btn${page === 'menu' ? ' active' : ''}`}
          onClick={() => onNavigate('menu')}
        >
          🍽️ Food Menu
        </button>
        <button
          className={`nav-btn${page === 'expenses' ? ' active' : ''}`}
          onClick={() => onNavigate('expenses')}
        >
          💰 Expenses
        </button>
      </nav>
      <div className="header-stats">
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${pct}%` }}></div>
        </div>
        <span className="progress-text">
          {completed}/{total} done ({pct}%)
        </span>
      </div>
    </header>
  );
}

export default Header;
