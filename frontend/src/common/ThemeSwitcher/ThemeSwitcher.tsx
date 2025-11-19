import React, { useEffect, useState } from 'react';
import './ThemeSwitcher.css';

export const ThemeSwitcher: React.FC = () => {
  const [theme, setTheme] = useState<'theme1' | 'theme2'>('theme1');

  useEffect(() => {
    // Load theme from localStorage or default to theme1
    const savedTheme = localStorage.getItem('theme') as 'theme1' | 'theme2' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'theme1');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'theme1' ? 'theme2' : 'theme1';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button 
      className="theme-switcher"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'theme1' ? 'Teal/Cyan' : 'Purple/Blue'} theme`}
    >
      <div className={`theme-switcher-icon ${theme === 'theme2' ? 'theme2-active' : ''}`}>
        <span className="theme-icon">🎨</span>
      </div>
    </button>
  );
};

