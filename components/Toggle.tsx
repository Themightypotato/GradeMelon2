import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";

export default function DarkModeToggle(){
  const [isDarkMode, setIsDarkMode] = useState(
    () =>  ((Cookies.get("theme")=="light"||Cookies.get("theme")=="dark")? (Cookies.get("theme")=="dark") : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches))
  );

 
  useEffect(() => {
    const root = window.document.documentElement; // This is the <html> element
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    Cookies.set('theme',!isDarkMode? "dark":"light",{expires:365});
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="rounded-lg p-2.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
    >
      {!isDarkMode ? (<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 20 20" aria-label="Currently light mode" className="h-5 w-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>):(<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 20 20" aria-label="Currently dark mode" className="h-5 w-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path></svg>)}
    </button>
  );
};
