const getYoutubeEmbed = (url) => {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    }

    if (parsed.hostname.includes("youtube.com")) {
      return `https://www.youtube.com/embed/${
        parsed.searchParams.get("v") ||
        parsed.pathname.split("/").pop()
      }`;
    }
  } catch {
    return null;
  }

  return null;
};

export default function VideoFrame({
  url,
  title = "Course video",
}) {
  const embed = url ? getYoutubeEmbed(url) : null;

  return (
    <div className="relative h-full">
      {embed ? (
        <iframe
          className="h-full w-full"
          src={embed}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : url ? (
        <video
          className="h-full w-full"
          controls
          src={url}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-white/45">
          No video added for this lesson.
        </div>
      )}
      
      
    </div>
    
  );
}
