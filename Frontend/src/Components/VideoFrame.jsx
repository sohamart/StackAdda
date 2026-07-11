const getYoutubeEmbed = (url) => {
  try {
    const parsed = new URL(url);

    let videoId = "";

    if (parsed.hostname.includes("youtu.be")) {
      videoId = parsed.pathname.slice(1);
    } else if (parsed.hostname.includes("youtube.com")) {
      videoId =
        parsed.searchParams.get("v") ||
        parsed.pathname.split("/").pop();
    }

    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&fs=1&iv_load_policy=3&cc_load_policy=0&disablekb=0`;
  } catch {
    return null;
  }
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
