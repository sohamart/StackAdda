import { useState } from "react";
import { X } from "lucide-react";
import API from "../../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/AuthContext";

const EditProfileModal = ({ open, onClose }) => {
  const { user, setUser } = useAuth();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await API.put(
        "/profile",
        formData,
        {
          withCredentials: true,
        }
      );
      console.log(data);

      setUser(data.user);

      toast.success(data.message);
      

      onClose();

    } catch (error) {
      toast.error(
        error.response?.data.message ||
          "Something went wrong"

      );
     
      console.log(error.response?.data|| "Not done");
    } finally {
      setLoading(false);
      console.log(data);

    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">

      <div
        className="
w-full
max-w-xl
rounded-3xl
border
border-white/10
bg-[#111111]
p-8
shadow-[0_0_60px_rgba(249,115,22,.15)]
"
      >

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-bold text-white">
            Edit Profile
          </h2>

          <button
            onClick={onClose}
            className="text-white/60 hover:text-white"
          >
            <X />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white outline-none"
          />

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white outline-none"
          />

          <textarea
            rows={4}
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Bio"
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white outline-none resize-none"
          />

          <button
            disabled={loading}
            className="
w-full
rounded-xl
bg-orange-600
py-3
font-semibold
text-white
transition
hover:bg-orange-500
"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default EditProfileModal;