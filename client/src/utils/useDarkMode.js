import { useState, useEffect } from 'react';

const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    // Initialize darkmode.js
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/darkmode-js@1.5.7/lib/darkmode-js.min.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const options = {
        bottom: '32px',
        right: '32px',
        left: 'unset',
        time: '0.5s',
        mixColor: '#fff',
        backgroundColor: '#fff',
        buttonColorDark: '#100f2c',
        buttonColorLight: '#fff',
        saveInCookies: true,
        label: '🌓',
        autoMatchOsTheme: true
      };

      window.darkmode = new window.Darkmode(options);
      
      // Set initial state
      if (isDarkMode) {
        window.darkmode.toggle();
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const toggleDarkMode = () => {
    if (window.darkmode) {
      window.darkmode.toggle();
      setIsDarkMode(!isDarkMode);
      localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
    }
  };

  return { isDarkMode, toggleDarkMode };
};

export default useDarkMode; 