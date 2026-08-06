import React from 'react';
import ComingSoon from './ComingSoon';
import Home from './Pages/Home';
import AIAvatar from './Components/AIAvatar';

function App() {
  // Check the environment variable
  // Set VITE_SHOW_COMING_SOON=true in Vercel to hide the app and show Coming Soon
  const showComingSoon = import.meta.env.VITE_SHOW_COMING_SOON === 'true';

  // Show Coming Soon page if the variable is set to true
  if (showComingSoon) {
    return (
      <div className="no-scrollbar overflow-x-hidden">
        <ComingSoon />
        <AIAvatar />
      </div>
    );
  }

  // Otherwise, show the Real Website
  return (
    <div className="no-scrollbar overflow-x-hidden">
      <Home />
      <AIAvatar />
    </div>
  );
}

export default App;
