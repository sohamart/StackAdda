import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Camera,
  LoaderCircle,
  Mail,
  Phone,
  User,
  ShieldCheck,
  Calendar,
  Pencil,
  Lock,
  GraduationCap,
  Award,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useAuth } from "../../Context/AuthContext";
import EditProfileModal from "../../Components/Student/EditProfileModal";
import API from "../../api/axios";
import { toast } from "react-toastify";
import ChangePasswordModal from "../../Components/Student/ChangePasswordModal";


const Profile = () => {
  const { user, getCurrentUser } = useAuth();
  const [openPassword, setOpenPassword] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFileForCrop, setSelectedFileForCrop] = useState(null);
  const enrolledCourses = user?.enrolledCourses?.length || 0;
  const joinedYear = user?.createdAt
    ? new Date(user.createdAt).getFullYear()
    : new Date().getFullYear();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please select an image.");
    }
    setSelectedFileForCrop(file);
    e.target.value = "";
  };

  const uploadCroppedImage = async (croppedFile) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("profileImage", croppedFile);

      const { data } = await API.put(
        "/profile/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      await getCurrentUser();
      toast.success(data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Image upload failed."
      );
    } finally {
      setUploading(false);
    }
  };


  return (
    <div className="relative min-h-screen overflow-hidden bg-[#09090B] text-white">

      {/* Glow */}

      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[420px] w-[420px] rounded-full bg-orange-500/20 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Cover */}

        <div
          className="
relative
overflow-hidden
rounded-3xl
border
border-orange-500/20
bg-gradient-to-r
from-orange-600/40
via-orange-500/10
to-black
h-36
sm:h-48
lg:h-56
shadow-[0_0_80px_rgba(249,115,22,.15)]
"
        >

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.18),transparent_45%)]" />

          <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-orange-500/20 blur-xl" />

        </div>

        {/* Card */}

        <div className="-mt-16 sm:-mt-24">

          <div
            className="
rounded-3xl
border
border-white/10
bg-white/[0.05]
backdrop-blur-md
p-5
sm:p-8
"
          >

            <div className="flex flex-col lg:flex-row gap-10">

              {/* Left */}

              <div className="lg:w-[330px] flex flex-col items-center">

                <div className="relative">

                  <img
                    src={
                      user?.profileImage?.url ||
                      `https://ui-avatars.com/api/?name=${user?.name}&background=f97316&color=fff`
                    }
                    alt=""
                    className="
w-32
h-32
sm:w-40
sm:h-40
lg:w-44
lg:h-44
rounded-full
border-4
border-orange-500
object-cover
shadow-[0_0_45px_rgba(249,115,22,.45)]
"
                  />

                  <label
  htmlFor="profileImage"
  className="
absolute
bottom-2
right-2
w-12
h-12
rounded-full
bg-orange-600
hover:bg-orange-500
cursor-pointer
transition
flex
items-center
justify-center
shadow-lg
"
>
  {uploading ? (
    <LoaderCircle
      size={18}
      className="animate-spin"
    />
  ) : (
    <Camera size={18} />
  )}
</label>

<input
  id="profileImage"
  type="file"
  accept="image/*"
  className="hidden"
  onChange={handleImageUpload}
/>

                </div>

                <h2 className="mt-5 text-2xl sm:text-3xl lg:text-4xl font-bold text-center">
                  {user?.name}
                </h2>

                <p className="mt-2 capitalize text-orange-400 font-medium">
                  {user?.role}
                </p>

                {/* Stats */}

                <div className="grid grid-cols-3 gap-3 w-full mt-8">

                  <div className="rounded-2xl border border-white/10 bg-white/5 py-4">

                    <GraduationCap
                      size={22}
                      className="mx-auto text-orange-400"
                    />

                    <h2 className="text-xl font-bold text-center mt-2">
                      {enrolledCourses}
                    </h2>

                    <p className="text-xs text-center text-white/60">
                      Courses
                    </p>

                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 py-4">

                    <Award
                      size={22}
                      className="mx-auto text-orange-400"
                    />

                    <h2 className="text-xl font-bold text-center mt-2">
                      0
                    </h2>

                    <p className="text-xs text-center text-white/60">
                      Certificates
                    </p>

                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 py-4">

                    <Calendar
                      size={22}
                      className="mx-auto text-orange-400"
                    />

                    <h2 className="text-sm font-bold text-center mt-2">
                      {joinedYear}
                    </h2>

                    <p className="text-xs text-center text-white/60">
                      Joined
                    </p>

                  </div>

                </div>

              </div>

              {/* Right */}

              <div className="flex-1">

                <h2 className="text-2xl sm:text-3xl font-bold mb-8">
                  Account Information
                </h2>

                <div className="grid md:grid-cols-2 gap-5">
                                    {/* Name */}

                  <div
                    className="
group
rounded-3xl
border
border-white/10
bg-white/[0.04]
backdrop-blur-2xl
p-5
transition-all
duration-300
hover:-translate-y-1
hover:border-orange-500/40
"
                  >
                    <div className="flex items-center gap-3 text-orange-400">
                      <User size={20} />
                      <span>Name</span>
                    </div>

                    <p className="mt-4 text-lg font-medium">
                      {user?.name}
                    </p>
                  </div>

                  {/* Email */}

                  <div
                    className="
group
rounded-3xl
border
border-white/10
bg-white/[0.04]
backdrop-blur-2xl
p-5
transition-all
duration-300
hover:-translate-y-1
hover:border-orange-500/40
"
                  >
                    <div className="flex items-center gap-3 text-orange-400">
                      <Mail size={20} />
                      <span>Email</span>
                    </div>

                    <p className="mt-4 break-all">
                      {user?.email}
                    </p>
                  </div>

                  {/* Phone */}

                  <div
                    className="
group
rounded-3xl
border
border-white/10
bg-white/[0.04]
backdrop-blur-2xl
p-5
transition-all
duration-300
hover:-translate-y-1
hover:border-orange-500/40
"
                  >
                    <div className="flex items-center gap-3 text-orange-400">
                      <Phone size={20} />
                      <span>Phone</span>
                    </div>

                    <p className="mt-4">
                      {user?.phone || "Not Added"}
                    </p>
                  </div>

                  {/* Role */}

                  <div
                    className="
group
rounded-3xl
border
border-white/10
bg-white/[0.04]
backdrop-blur-2xl
p-5
transition-all
duration-300
hover:-translate-y-1
hover:border-orange-500/40
"
                  >
                    <div className="flex items-center gap-3 text-orange-400">
                      <ShieldCheck size={20} />
                      <span>Account Type</span>
                    </div>

                    <p className="mt-4 capitalize">
                      {user?.role}
                    </p>
                  </div>

                  {/* Bio */}

                  <div
                    className="
group
md:col-span-2
rounded-3xl
border
border-white/10
bg-white/[0.04]
backdrop-blur-2xl
p-5
transition-all
duration-300
hover:border-orange-500/40
"
                  >
                    <div className="flex items-center gap-3 text-orange-400">
                      <Calendar size={20} />
                      <span>Bio</span>
                    </div>

                    <p className="mt-4 text-white/70 leading-7">
                      {user?.bio || "No bio added yet."}
                    </p>
                  </div>

                </div>

                {/* Buttons */}

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <button
                    onClick={() => setOpenEdit(true)}
                    className="
flex
items-center
justify-center
gap-2
rounded-2xl
bg-gradient-to-r
from-orange-600
to-orange-500
py-4
font-semibold
transition
hover:scale-[1.02]
hover:shadow-[0_0_35px_rgba(249,115,22,.35)]
"
                  >
                    <Pencil size={18} />

                    Edit Profile
                  </button>

                  <button
  onClick={() => setOpenPassword(true)}
  className="
flex
items-center
justify-center
gap-2
rounded-2xl
border
border-white/10
bg-white/[0.04]
py-4
font-semibold
transition
hover:border-orange-500
hover:bg-white/10
"
>
  <Lock size={18} />

  Change Password
</button>

                </div>
                              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Edit Profile Modal */}

      <EditProfileModal
  open={openEdit}
  onClose={() => setOpenEdit(false)}
  
/>

<ChangePasswordModal
  open={openPassword}
  onClose={() => setOpenPassword(false)}
  
/>

      {/* Mobile Bottom Space */}

      <div className="h-20 lg:hidden"></div>

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

export default Profile;
