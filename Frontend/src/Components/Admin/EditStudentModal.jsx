import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import API from "../../api/axios";
import { Camera, X, ShieldCheck, UploadCloud, ZoomIn, ZoomOut } from "lucide-react";
import { toast } from "react-toastify";

const EditStudentModal = ({
  open,
  onClose,
  student,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [selectedFileForCrop, setSelectedFileForCrop] = useState(null);

  const [previewImage, setPreviewImage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    role: "student",
    instagram: "",
    telegram: "",
    showOnHome: false,
    isInstructor: false,
  });

  useEffect(() => {
    if (!student) return;

    setFormData({
      name: student.name || "",
      email: student.email || "",
      phone: student.phone || "",
      bio: student.bio || "",
      role: student.role || "student",
      instagram: student.instagram || "",
      telegram: student.telegram || "",
      showOnHome: student.showOnHome || false,
      isInstructor: student.isInstructor || false,
    });

    setPreviewImage(
      student.profileImage?.url ||
        `https://ui-avatars.com/api/?name=${student.name}&background=f97316&color=fff`
    );
  }, [student]);

  if (!open) return null;

  // --------------------------
  // Handle Inputs
  // --------------------------

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // --------------------------
  // Update Student
  // --------------------------

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const { data } = await API.put(
        `/admin/student/${student._id}`,
        formData,
        {
          withCredentials: true,
        }
      );

      toast.success(
        data.message || "Student updated successfully."
      );

      onSuccess();
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Update failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // Upload Image
  // --------------------------

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFileForCrop(file);
    e.target.value = "";
  };

  const uploadCroppedImage = async (croppedFile) => {
    setPreviewImage(URL.createObjectURL(croppedFile));

    try {
      setImageLoading(true);

      const formData = new FormData();
      formData.append("image", croppedFile);

      const { data } = await API.put(
        `/admin/student/${student._id}/profile-image`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(data.message || "Image Updated");
      onSuccess();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Upload Failed"
      );
    } finally {
      setImageLoading(false);
    }
  };

  // --------------------------
  // Verify Student
  // --------------------------

  const handleVerify = async () => {
    try {
      setVerifyLoading(true);

      const { data } = await API.put(
        `/admin/student/${student._id}/verify`,
        {},
        {
          withCredentials: true,
        }
      );

      toast.success(data.message);

      onSuccess();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Verification Failed"
      );
    } finally {
      setVerifyLoading(false);
    }
  };

  // --------------------------
  // Unverify Student
  // --------------------------

  const handleUnverify = async () => {
    try {
      setVerifyLoading(true);

      const { data } = await API.put(
        `/admin/student/${student._id}/unverify`,
        {},
        {
          withCredentials: true,
        }
      );

      toast.success(data.message);

      onSuccess();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Operation Failed"
      );
    } finally {
      setVerifyLoading(false);
    }
  };
    return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md">

      <div className="h-full overflow-y-auto py-6 sm:py-10 px-4">

        <div
          className="
relative
mx-auto
w-full
max-w-6xl
overflow-hidden
rounded-[32px]
border
border-white/10
bg-[#0b0b0b]/95
backdrop-blur-3xl
shadow-[0_0_60px_rgba(249,115,22,0.15)]
"
        >

          {/* Orange Glow */}
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/20 blur-[120px]" />
          <div className="absolute -left-16 bottom-0 h-52 w-52 rounded-full bg-orange-500/10 blur-[100px]" />

          {/* Header */}

          <div className="relative border-b border-white/10 px-6 py-6 sm:px-8">

            <div className="flex items-start justify-between gap-5">

              <div>

                <h2 className="text-3xl font-bold text-white">
                  Edit Student Profile
                </h2>

                <p className="mt-2 text-sm text-white/50">
                  Update profile information, verification
                  status and profile picture.
                </p>

              </div>

              <button
                onClick={onClose}
                className="
flex
h-11
w-11
items-center
justify-center
rounded-xl
border
border-white/10
bg-white/[0.04]
text-white/70
transition
hover:border-red-500/30
hover:bg-red-500
hover:text-white
"
              >
                <X size={20} />
              </button>

            </div>

          </div>

          {/* Body */}

          <div className="relative grid gap-8 p-6 lg:grid-cols-[340px_1fr] lg:p-8">

            {/* LEFT SIDE */}

            <div className="space-y-6">

              {/* Profile Card */}

              <div
                className="
rounded-3xl
border
border-orange-500/20
bg-gradient-to-b
from-orange-500/10
to-white/[0.03]
p-6
"
              >

                <div className="flex flex-col items-center">

                  <img
                    src={previewImage}
                    alt=""
                    className="
h-36
w-36
rounded-full
border-4
border-orange-500
object-cover
transition
duration-300
hover:scale-105
"
                  />

                  <label
                    className="
mt-6
flex
cursor-pointer
items-center
gap-2
rounded-2xl
bg-orange-500
px-5
py-3
font-medium
text-white
transition
hover:bg-orange-600
"
                  >

                    {imageLoading ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <UploadCloud size={18} />
                        Change Image
                      </>
                    )}

                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                    />

                  </label>

                </div>

              </div>

              {/* Verification Card */}

              <div
                className="
rounded-3xl
border
border-white/10
bg-white/[0.04]
p-6
"
              >

                <div className="flex items-center gap-3">

                  <div className="rounded-xl bg-orange-500/15 p-3">

                    <ShieldCheck
                      size={22}
                      className="text-orange-400"
                    />

                  </div>

                  <div>

                    <h3 className="font-semibold text-white">
                      Verification
                    </h3>

                    <p className="text-sm text-white/50">
                      Student verification status
                    </p>

                  </div>

                </div>

                <div className="mt-6">

                  <span
                    className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                      student.isVerified
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {student.isVerified
                      ? "Verified"
                      : "Pending Verification"}
                  </span>

                </div>

                {student.isVerified && (

                  <div className="mt-6 space-y-3 text-sm">

                    <div>

                      <p className="text-white/40">
                        Verified By
                      </p>

                      <p className="mt-1 text-white">
                        {student.verifiedBy?.name ||
                          "Admin"}
                      </p>

                    </div>

                    <div>

                      <p className="text-white/40">
                        Email
                      </p>

                      <p className="mt-1 text-white break-all">
                        {student.verifiedBy?.email ||
                          "-"}
                      </p>

                    </div>

                    <div>

                      <p className="text-white/40">
                        Verified On
                      </p>

                      <p className="mt-1 text-white">
                        {student.verifiedAt
                          ? new Date(
                              student.verifiedAt
                            ).toLocaleString()
                          : "-"}
                      </p>

                    </div>

                  </div>

                )}

                <button
                  disabled={verifyLoading}
                  onClick={
                    student.isVerified
                      ? handleUnverify
                      : handleVerify
                  }
                  className={`
mt-8
w-full
rounded-2xl
py-3
font-semibold
text-white
transition
${
  student.isVerified
    ? "bg-red-500 hover:bg-red-600"
    : "bg-green-500 hover:bg-green-600"
}
`}
                >
                  {verifyLoading
                    ? "Processing..."
                    : student.isVerified
                    ? "Remove Verification"
                    : "Verify Student"}
                </button>

              </div>

            </div>

            {/* RIGHT SIDE STARTS HERE */}
            <div className="space-y-6">

                          {/* Student Information */}

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

                <h3 className="text-xl font-semibold text-white">
                  Student Information
                </h3>

                <p className="mt-1 text-sm text-white/50">
                  Update the student's basic information.
                </p>

                <div className="mt-8 grid gap-6 md:grid-cols-2">

                  {/* Name */}

                  <div>

                    <label className="mb-2 block text-sm font-medium text-white/70">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter student name"
                      className="
w-full
rounded-2xl
border
border-white/10
bg-white/[0.04]
px-5
py-4
text-white
placeholder:text-white/30
outline-none
transition
focus:border-orange-500
focus:ring-4
focus:ring-orange-500/20
"
                    />

                  </div>

                  {/* Phone */}

                  <div>

                    <label className="mb-2 block text-sm font-medium text-white/70">
                      Phone Number
                    </label>

                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="
w-full
rounded-2xl
border
border-white/10
bg-white/[0.04]
px-5
py-4
text-white
placeholder:text-white/30
outline-none
transition
focus:border-orange-500
focus:ring-4
focus:ring-orange-500/20
"
                    />

                  </div>

                </div>

                {/* Email */}

                <div className="mt-6">

                  <label className="mb-2 block text-sm font-medium text-white/70">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className="
w-full
rounded-2xl
border
border-white/10
bg-white/[0.04]
px-5
py-4
text-white
placeholder:text-white/30
outline-none
transition
focus:border-orange-500
focus:ring-4
focus:ring-orange-500/20
"
                  />

                </div>

                {/* Bio */}

                <div className="mt-6">

                  <label className="mb-2 block text-sm font-medium text-white/70">
                    Bio
                  </label>

                  <textarea
                    rows={6}
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Write something about the student..."
                    className="
w-full
resize-none
rounded-2xl
border
border-white/10
bg-white/[0.04]
px-5
py-4
text-white
placeholder:text-white/30
outline-none
transition
focus:border-orange-500
focus:ring-4
focus:ring-orange-500/20
"
                  />

                </div>

                {/* Role selection */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-medium text-white/70">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none focus:border-orange-500"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Social Media & Teammate Toggles */}
                <h3 className="mt-8 text-xl font-semibold text-white">
                  Social & Profile Highlights
                </h3>
                <p className="mt-1 text-sm text-white/50">
                  Configure social contact info and profile visibility.
                </p>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/70">
                      Instagram Username
                    </label>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      placeholder="e.g. stackadda_official"
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/70">
                      Telegram Username
                    </label>
                    <input
                      type="text"
                      name="telegram"
                      value={formData.telegram}
                      onChange={handleChange}
                      placeholder="e.g. stackadda_channel"
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-5">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.isInstructor}
                      onChange={(e) => setFormData(prev => ({ ...prev, isInstructor: e.target.checked }))}
                      className="h-5 w-5 rounded border-white/20 bg-black/40 text-orange-500 focus:ring-0 focus:ring-offset-0"
                    />
                    <span className="text-sm font-medium text-white/70">Publish as Instructor (Student Panel)</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.showOnHome}
                      onChange={(e) => setFormData(prev => ({ ...prev, showOnHome: e.target.checked }))}
                      className="h-5 w-5 rounded border-white/20 bg-black/40 text-orange-500 focus:ring-0 focus:ring-offset-0"
                    />
                    <span className="text-sm font-medium text-white/70">Show on Home Page Teammates</span>
                  </label>
                </div>

              </div>

              {/* Action Buttons */}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  onClick={onClose}
                  className="
w-full
rounded-2xl
border
border-white/10
bg-white/[0.04]
px-6
py-3
font-medium
text-white
transition
hover:border-white/20
hover:bg-white/[0.08]
sm:w-auto
"
                >
                  Cancel
                </button>

                <button
                  disabled={loading}
                  onClick={handleUpdate}
                  className="
w-full
rounded-2xl
bg-orange-500
px-8
py-3
font-semibold
text-white
transition
hover:bg-orange-600
disabled:cursor-not-allowed
disabled:opacity-70
sm:w-auto
"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">

                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />

                      Saving...

                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </button>

              </div>
                          </div>
            {/* End Right Side */}

          </div>
          {/* End Body */}

        {selectedFileForCrop && createPortal(
          <ImageCropperModal
            file={selectedFileForCrop}
            onClose={() => setSelectedFileForCrop(null)}
            onCrop={async (croppedFile) => {
              setSelectedFileForCrop(null);
              await uploadCroppedImage(croppedFile);
            }}
          />,
          document.body
        )}
      </div>
      </div>
      </div>
  );
};

const ImageCropperModal = ({ file, onCrop, onClose }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  // Disable scrolling on body when open
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  }, [file]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - offsetX, y: e.clientY - offsetY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffsetX(e.clientX - dragStart.current.x);
    setOffsetY(e.clientY - dragStart.current.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStart.current = { x: e.touches[0].clientX - offsetX, y: e.touches[0].clientY - offsetY };
    }
  };

  const handleTouchMove = (e) => {
    if (e.cancelable) e.preventDefault();
    if (!isDragging || e.touches.length !== 1) return;
    setOffsetX(e.touches[0].clientX - dragStart.current.x);
    setOffsetY(e.touches[0].clientY - dragStart.current.y);
  };

  const handleCrop = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      ctx.fillStyle = "#121214";
      ctx.fillRect(0, 0, 400, 400);

      const imgWidth = img.width;
      const imgHeight = img.height;
      const minDimension = Math.min(imgWidth, imgHeight);

      const drawWidth = (imgWidth / minDimension) * 400 * zoom;
      const drawHeight = (imgHeight / minDimension) * 400 * zoom;

      const container = containerRef.current;
      const viewSize = container ? container.getBoundingClientRect().width * 0.8 : 280;
      
      const x = 200 - drawWidth / 2 + (offsetX / viewSize) * 400;
      const y = 200 - drawHeight / 2 + (offsetY / viewSize) * 400;

      ctx.drawImage(img, x, y, drawWidth, drawHeight);

      canvas.toBlob((blob) => {
        const croppedFile = new File([blob], file.name || "avatar.jpg", { type: "image/jpeg" });
        onCrop(croppedFile);
      }, "image/jpeg", 0.9);
    };
  };

  return (
    <div className="fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center bg-black/95 backdrop-blur-xl p-4 overflow-hidden select-none">
      <div className="relative w-full max-w-[320px] rounded-[2rem] border border-white/10 bg-[#0c0c0e] p-5 text-white shadow-2xl flex flex-col items-center">
        <div className="flex w-full items-center justify-between">
          <h3 className="text-lg font-bold">Crop Profile Picture</h3>
          <button onClick={onClose} className="rounded-full border border-white/10 bg-white/5 p-1 text-white/50 hover:text-white">
            <X size={15} />
          </button>
        </div>
        <p className="w-full text-left text-[10px] text-white/50 mt-0.5">Drag to adjust position. Use slider to zoom.</p>

        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          className="relative mt-4 w-60 h-60 overflow-hidden rounded-2xl border border-white/5 bg-black/80 cursor-move flex items-center justify-center touch-none"
        >
          {imageSrc && (
            <img
              ref={imgRef}
              src={imageSrc}
              alt=""
              style={{
                transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`,
                maxWidth: "80%",
                maxHeight: "80%",
                transition: isDragging ? "none" : "transform 0.1s ease-out",
              }}
              className="object-contain"
              draggable={false}
            />
          )}

          <div className="absolute inset-0 pointer-events-none rounded-3xl border-2 border-orange-500/80 m-[10%]" />
          <div className="absolute inset-0 pointer-events-none" style={{
            boxShadow: "0 0 0 9999px rgba(12, 12, 14, 0.75)",
            borderRadius: "1.5rem",
            margin: "10%",
          }} />
        </div>

        <div className="mt-4 flex items-center gap-3 bg-white/[0.02] p-2.5 rounded-2xl border border-white/5 w-full">
          <ZoomOut size={14} className="text-white/40" />
          <input
            type="range"
            min="1"
            max="3"
            step="0.02"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500 focus:outline-none"
          />
          <ZoomIn size={14} className="text-white/40" />
        </div>

        <div className="mt-4 flex gap-3 w-full">
          <button onClick={onClose} className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-3 font-bold hover:bg-white/10 transition duration-150 text-sm">
            Cancel
          </button>
          <button onClick={handleCrop} className="flex-1 rounded-2xl bg-orange-500 py-3 font-bold text-white hover:bg-orange-600 transition duration-150 shadow-lg shadow-orange-500/20 text-sm">
            Crop & Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStudentModal;