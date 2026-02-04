import { Link } from 'react-router-dom';
import React from 'react';

type Props = { theme: string; toggleTheme: () => void };

export default function Header({ theme, toggleTheme }: Props) {
  return (
    <header className="app-header">
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <div className="header-controls">
        <button onClick={toggleTheme} aria-label="Toggle theme">{theme === 'dark' ? '🌙' : '☀️'}</button>
      </div>
    </header>
  );
}
