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
