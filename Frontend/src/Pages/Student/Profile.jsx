import { useState } from "react";
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
  const enrolledCourses = user?.enrolledCourses?.length || 0;
  const joinedYear = user?.createdAt
    ? new Date(user.createdAt).getFullYear()
    : new Date().getFullYear();

 const handleImageUpload = async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  // Image Validation
  if (!file.type.startsWith("image/")) {
    return toast.error("Please select an image.");
  }

  // 5MB Limit
  if (file.size > 5 * 1024 * 1024) {
    return toast.error("Maximum image size is 5MB.");
  }

  try {
    setUploading(true);

    const formData = new FormData();

    formData.append("profileImage", file);

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
      error.response?.data?.message ||
        "Image upload failed."
    );
  } finally {
    setUploading(false);
  }
};


  return (
    <div className="relative min-h-screen overflow-hidden bg-[#09090B] text-white">

      {/* Glow */}

      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[420px] w-[420px] rounded-full bg-orange-500/20 blur-[170px]" />

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

          <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-orange-500/20 blur-3xl" />

        </div>

        {/* Card */}

        <div className="-mt-16 sm:-mt-24">

          <div
            className="
rounded-3xl
border
border-white/10
bg-white/[0.05]
backdrop-blur-3xl
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

    </div>
  );
};

export default Profile;
