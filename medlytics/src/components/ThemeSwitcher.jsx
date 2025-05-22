// ThemeSwitcher.jsx — Enhanced with system preference and CSS transitions
import React, { useEffect, useState } from 'react';

const ThemeSwitcher = () => {
  const getInitialTheme = () => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [darkMode, setDarkMode] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark-mode');
      root.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.add('light-mode');
      root.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="text-end mb-3">
      <button
        onClick={() => setDarkMode(prev => !prev)}
        className={`btn btn-sm ${darkMode ? 'btn-light' : 'btn-dark'}`}
        aria-label="Toggle Theme"
        title="Toggle Light/Dark Mode"
      >
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
    </div>
  );
};

export default ThemeSwitcher;
