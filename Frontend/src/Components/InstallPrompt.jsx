import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if we already showed it to avoid annoying the user
    const hasShown = localStorage.getItem('pwaPromptShown');

    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show immediately upon entering
      if (!hasShown) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show the native install prompt
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
    localStorage.setItem('pwaPromptShown', 'true');
  };

  const handleClose = () => {
    setShowPrompt(false);
    localStorage.setItem('pwaPromptShown', 'true');
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto"
          />

          {/* Modal/Drawer */}
          <motion.div 
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-[#0F0F11] border border-orange-500/20 sm:rounded-3xl rounded-t-[2rem] rounded-b-none p-6 sm:p-8 max-w-sm w-full shadow-[0_-10px_50px_rgba(249,115,22,0.15)] sm:shadow-[0_0_50px_rgba(249,115,22,0.15)] relative pointer-events-auto pb-8 sm:pb-8"
          >
            {/* Mobile Drag Handle */}
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6 sm:hidden" />

            <button 
              onClick={handleClose}
              className="absolute top-5 right-5 sm:top-6 sm:right-6 text-white/40 hover:text-white transition bg-white/5 rounded-full p-2"
            >
              <X size={20} />
            </button>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 rounded-[1.5rem] flex items-center justify-center p-4 mb-6 shadow-inner border border-white/10 backdrop-blur-md relative overflow-hidden">
                <div className="absolute inset-0 bg-orange-500/20 blur-xl animate-pulse" />
                <img src="/favicon.png" alt="App Logo" className="w-full h-full object-contain relative z-10" />
              </div>
              
              <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Install Stack Adda</h3>
              <p className="text-white/50 text-sm mb-8 leading-relaxed px-2 font-medium">
                Install our official app for a faster, distraction-free experience directly from your home screen.
              </p>
              
              <div className="w-full flex flex-col gap-3">
                <button 
                  onClick={handleInstall}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold py-4 rounded-2xl shadow-[0_0_30px_rgba(249,115,22,0.25)] hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-2 text-lg hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Download size={22} />
                  Install App
                </button>
                <button 
                  onClick={handleClose}
                  className="w-full bg-transparent hover:bg-white/5 text-white/50 hover:text-white font-semibold py-3 rounded-xl transition-all text-sm"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
