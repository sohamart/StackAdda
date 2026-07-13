const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const imageTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];
  const videoTypes = [
    "video/mp4",
    "video/webm",
    "video/quicktime",
  ];
  const resourceTypes = [
    "application/pdf",
    "application/zip",
    "application/x-zip-compressed",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/plain",
  ];

  const isVideoUpload = file.fieldname === "video" || file.fieldname === "introVideo";
  const isResourceUpload = file.fieldname === "resource";
  const isAllowed = isVideoUpload ? videoTypes.includes(file.mimetype) : isResourceUpload ? resourceTypes.includes(file.mimetype) : imageTypes.includes(file.mimetype);

  if (isAllowed) {
    cb(null, true);
  } else {
    const error = new Error(
        isVideoUpload ? "Only MP4, WEBM and MOV videos are allowed." : isResourceUpload ? "Only PDF, DOCX, DOC, TXT and ZIP resources are allowed." : "Only JPG, JPEG, PNG and WEBP images are allowed."
    );
    error.statusCode = 400;
    cb(error, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1000 * 1024 * 1024, // 1000MB
  },
});

module.exports = upload;
