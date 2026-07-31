const mimeExtensions = {
  "application/pdf": ".pdf",
  "application/zip": ".zip",
  "application/x-zip-compressed": ".zip",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "application/msword": ".doc",
  "text/plain": ".txt",
};

const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const getExtension = (value = "") => {
  try {
    const pathname = value.startsWith("http")
      ? new URL(value).pathname
      : value;
    const match = pathname.match(/\.([a-z0-9]+)$/i);
    return match ? `.${match[1].toLowerCase()}` : "";
  } catch {
    return "";
  }
};

export const getResourceFileName = (resource) => {
  const name = resource?.fileName || resource?.title || "resource";
  if (getExtension(name)) return name;

  const extension =
    mimeExtensions[resource?.mimeType] ||
    mimeExtensions[resource?.type] ||
    getExtension(resource?.url || "");

  return extension ? `${name}${extension}` : name;
};

export const getResourceDownloadUrl = ({
  courseId,
  chapterId,
  lessonId,
  resourceId,
}) => {
  const path = `/course/course/${courseId}/chapter/${chapterId}/lesson/${lessonId}/resource/${resourceId}/download`;
  return `${apiBaseUrl}${path}`;
};

const parseFilenameFromDisposition = (value = "") => {
  const utf8Match = value.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      return utf8Match[1];
    }
  }

  const asciiMatch = value.match(/filename="?([^";]+)"?/i);
  return asciiMatch?.[1] || "resource";
};

export const downloadResourceFile = async ({
  courseId,
  chapterId,
  lessonId,
  resourceId,
  fileName,
}) => {
  const link = document.createElement("a");
  link.href = getResourceDownloadUrl({ courseId, chapterId, lessonId, resourceId });
  link.target = "_self";
  link.rel = "noreferrer";
  if (fileName) {
    link.download = fileName;
  }
  document.body.appendChild(link);
  link.click();
  link.remove();
};
