import { useEffect } from "react";
import { useAuth } from "../Context/AuthContext";

export default function useAntiPiracy() {
  const { user, loading } = useAuth();

  useEffect(() => {
    // If auth is loading, do not apply protection
    if (loading) {
      document.body.style.userSelect = "auto";
      document.body.style.WebkitUserSelect = "auto";
      document.body.style.filter = "none";
      document.body.style.opacity = "1";
      return;
    }

    // 1. Prevent Right Click
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    // 2. Prevent Keyboard Shortcuts (Screenshots, DevTools, Print)
    const handleKeyDown = (e) => {
      // Print Screen
      if (e.key === "PrintScreen") {
        navigator.clipboard.writeText(""); // Attempt to clear clipboard
        e.preventDefault();
      }

      // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Print, Save, Mac Screenshots
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")) ||
        (e.ctrlKey && (e.key === "U" || e.key === "u")) ||
        (e.ctrlKey && (e.key === "P" || e.key === "p")) ||
        (e.ctrlKey && (e.key === "S" || e.key === "s")) ||
        (e.metaKey && e.shiftKey && (e.key === "S" || e.key === "s")) || // Mac snipping tool
        (e.metaKey && e.shiftKey && (e.key === "3" || e.key === "4" || e.key === "5")) // Mac screenshots
      ) {
        e.preventDefault();
      }
    };

    // 3. Blur screen on visibility loss (Snipping tool / Background recording)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.body.style.filter = "blur(20px)";
        document.body.style.opacity = "0";
      } else {
        document.body.style.filter = "none";
        document.body.style.opacity = "1";
      }
    };

    const handleBlur = () => {
      document.body.style.filter = "blur(20px)";
      document.body.style.opacity = "0";
    };

    const handleFocus = () => {
      document.body.style.filter = "none";
      document.body.style.opacity = "1";
    };

    // Disable text selection globally
    document.body.style.userSelect = "none";
    document.body.style.WebkitUserSelect = "none";

    // Add event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      // Cleanup
      document.body.style.userSelect = "auto";
      document.body.style.WebkitUserSelect = "auto";
      document.body.style.filter = "none";
      document.body.style.opacity = "1";
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [user, loading]);
}
