const getEmbedUrl = (url) => {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    // YouTube
    if (
      parsed.hostname.includes("youtube.com") ||
      parsed.hostname.includes("youtu.be")
    ) {
      let id = "";
      if (parsed.hostname.includes("youtu.be")) {
        id = parsed.pathname.slice(1);
      } else {
        id =
          parsed.searchParams.get("v") ||
          parsed.pathname.split("/").pop();
      }
      return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&controls=1&showinfo=0&iv_load_policy=3&playsinline=1`;
    }

    // Vimeo
    if (parsed.hostname.includes("vimeo.com")) {
      let id = parsed.pathname.split("/").pop();
      return `https://player.vimeo.com/video/${id}?controls=1&title=0&byline=0&portrait=0&dnt=1`;
    }

    // Google Drive
    if (parsed.hostname.includes("drive.google.com")) {
      const match = parsed.pathname.match(/\/d\/([^/]+)/);

      if (match) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }

    return null;
  } catch {
    return null;
  }
};

export default function VideoFrame({
  url,
  title = "Course Video",
}) {
  const embedUrl = getEmbedUrl(url);

  return (
    <div className="relative h-full w-full bg-black rounded-xl overflow-hidden">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : url ? (
        <video
          src={url}
          controls
          controlsList="nodownload"
          className="w-full h-full object-contain bg-black"
          playsInline
        />
      ) : (
        <div className="flex h-full items-center justify-center text-white/50">
          No video available
        </div>
      )}
    </div>
  );
}      
      
 