/**
 * Helper to transform video links (YouTube, Vimeo, etc.) into secure embeddable URLs
 * that can be played in an iframe without "refused to connect" (X-Frame-Options) errors.
 */
export const getEmbedVideoUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();

  // 1. YouTube watch format: https://www.youtube.com/watch?v=VIDEO_ID
  if (trimmed.includes("youtube.com/watch")) {
    try {
      const parsed = new URL(trimmed);
      const id = parsed.searchParams.get("v");
      if (id) {
        return `https://www.youtube.com/embed/${id}?rel=0`;
      }
    } catch {
      const match = trimmed.match(/[?&]v=([^&#]+)/);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}?rel=0`;
      }
    }
  }

  // 2. YouTube short link: https://youtu.be/VIDEO_ID
  if (trimmed.includes("youtu.be/")) {
    try {
      const parsed = new URL(trimmed);
      const id = parsed.pathname.replace(/^\/+/, "");
      if (id) {
        return `https://www.youtube.com/embed/${id}?rel=0`;
      }
    } catch {
      const parts = trimmed.split("youtu.be/");
      if (parts[1]) {
        const id = parts[1].split(/[?&#]/)[0];
        return `https://www.youtube.com/embed/${id}?rel=0`;
      }
    }
  }

  // 3. YouTube shorts: https://www.youtube.com/shorts/VIDEO_ID
  if (trimmed.includes("youtube.com/shorts/")) {
    const parts = trimmed.split("youtube.com/shorts/");
    if (parts[1]) {
      const id = parts[1].split(/[?&#]/)[0];
      return `https://www.youtube.com/embed/${id}?rel=0`;
    }
  }

  // 4. YouTube live: https://www.youtube.com/live/VIDEO_ID
  if (trimmed.includes("youtube.com/live/")) {
    const parts = trimmed.split("youtube.com/live/");
    if (parts[1]) {
      const id = parts[1].split(/[?&#]/)[0];
      return `https://www.youtube.com/embed/${id}?rel=0`;
    }
  }

  // 5. Vimeo format: https://vimeo.com/VIDEO_ID
  if (trimmed.includes("vimeo.com/") && !trimmed.includes("player.vimeo.com")) {
    const match = trimmed.match(/vimeo\.com\/(\d+)/);
    if (match && match[1]) {
      return `https://player.vimeo.com/video/${match[1]}`;
    }
  }

  return trimmed;
};

/**
 * Checks whether the URL points directly to an HTML5 video file (.mp4, .webm, etc.)
 */
export const isDirectVideoFile = (url) => {
  if (!url || typeof url !== "string") return false;
  const clean = url.split("?")[0].toLowerCase();
  return (
    clean.endsWith(".mp4") ||
    clean.endsWith(".webm") ||
    clean.endsWith(".ogg") ||
    clean.endsWith(".mov") ||
    clean.endsWith(".m4v")
  );
};
