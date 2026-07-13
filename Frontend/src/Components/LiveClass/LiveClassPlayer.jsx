import React, { useRef, useEffect } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { Loader2 } from "lucide-react";
import API from "../../api/axios";

export default function LiveClassPlayer({ liveClass, user, onLeave }) {
  const apiRef = useRef();

  useEffect(() => {
    // Log attendance join
    API.post(`/live-class/${liveClass._id}/attendance`, { action: "join" }).catch(console.error);

    return () => {
      // Log attendance leave on unmount
      API.post(`/live-class/${liveClass._id}/attendance`, { action: "leave" }).catch(console.error);
    };
  }, [liveClass._id]);

  const handleApiReady = (api) => {
    apiRef.current = api;
    
    api.addListener("videoConferenceLeft", () => {
      onLeave();
    });
  };

  const domain = "meet.jit.si";
  const roomName = liveClass.meetLink || `stackadda-live-${liveClass._id}`;
  const isAdmin = user?.role === "admin";

  return (
    <div className="h-full w-full overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl relative">
      <JitsiMeeting
        domain={domain}
        roomName={roomName}
        configOverwrite={{
          startWithAudioMuted: !isAdmin,
          startWithVideoMuted: !isAdmin,
          disableModeratorIndicator: true,
          startScreenSharing: false,
          enableEmailInStats: false,
          prejoinPageEnabled: false,
          hideLobbyButton: true,
          disableDeepLinking: true,
          toolbarButtons: isAdmin ? [
            'camera', 'chat', 'closedcaptions', 'desktop', 'download', 'embedmeeting', 'etherpad', 'feedback', 'filmstrip', 'fullscreen', 'hangup', 'help', 'highlight', 'invite', 'linktosalesforce', 'livestreaming', 'microphone', 'mute-everyone', 'mute-video-everyone', 'participants-pane', 'profile', 'raisehand', 'recording', 'security', 'select-background', 'settings', 'shareaudio', 'noisesuppression', 'sharedvideo', 'shortcuts', 'stats', 'tileview', 'toggle-camera', 'videoquality', 'whiteboard'
          ] : [
            'camera', 'chat', 'closedcaptions', 'desktop', 'fullscreen', 'hangup', 'microphone', 'participants-pane', 'profile', 'raisehand', 'select-background', 'settings', 'tileview', 'toggle-camera'
          ]
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          HIDE_INVITE_MORE_HEADER: true,
          SHOW_JITSI_WATERMARK: false,
          SHOW_BRAND_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          BRAND_WATERMARK_LINK: "",
        }}
        userInfo={{
          displayName: user?.name || "Student",
          email: user?.email || "",
        }}
        onApiReady={handleApiReady}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = "100%";
          iframeRef.style.width = "100%";
          iframeRef.style.border = "none";
        }}
        spinner={() => (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 text-white">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-full border-4 border-orange-500/30 border-t-orange-500 animate-spin" />
              <p className="text-xl font-medium animate-pulse">Entering Live Classroom...</p>
            </div>
          </div>
        )}
      />
    </div>
  );
}
