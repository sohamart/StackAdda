import { useState } from "react";
import {
  X,
  Eye,
  EyeOff,
  Lock,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import API from "../../api/axios";

const PasswordInput = ({
  label,
  name,
  value,
  show,
  setShow,
  handleChange,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/70">
        {label}
      </label>

      <div className="relative">

        <Lock
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400"
        />

        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={handleChange}
          autoComplete="off"
          className="
w-full
rounded-2xl
border
border-white/10
bg-white/[0.04]
py-3
pl-11
pr-11
text-white
outline-none
transition
focus:border-orange-500
focus:ring-2
focus:ring-orange-500/20
"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="
absolute
right-4
top-1/2
-translate-y-1/2
text-white/60
hover:text-orange-400
transition
"
        >
          {show ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>

      </div>
    </div>
  );
};

const ChangePasswordModal = ({
  open,
  onClose,
}) => {

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
  e.preventDefault();

  setMessage("");
  setMessageType("");

  if (
    !formData.currentPassword ||
    !formData.newPassword ||
    !formData.confirmPassword
  ) {
    setMessage("Please fill all fields.");
    setMessageType("error");
    return;
  }

  if (formData.newPassword !== formData.confirmPassword) {
    setMessage("Passwords do not match.");
    setMessageType("error");
    return;
  }

  try {
    setLoading(true);

    const { data } = await API.put(
      "/profile/password",
      formData,
      {
        withCredentials: true,
      }
    );

    setMessage(
      data.message || "Password changed successfully."
    );

    setMessageType("success");

    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setTimeout(() => {
      setMessage("");
      onClose();
    }, 1500);

  } catch (error) {

    setMessage(
      error.response?.data?.message ||
        "Password update failed."
    );

    setMessageType("error");

  } finally {

    setLoading(false);

  }
};
return (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">

    <div
      className="
w-full
max-w-xl
overflow-hidden
rounded-3xl
border
border-white/10
bg-[#101010]
shadow-[0_0_70px_rgba(249,115,22,.12)]
"
    >

      {/* Header */}

      <div className="flex items-center justify-between border-b border-white/10 px-8 py-6">

        <div>
          <h2 className="text-2xl font-bold text-white">
            Change Password
          </h2>

          <p className="mt-1 text-sm text-white/50">
            Update your account password securely.
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
bg-white/5
text-white/60
transition
hover:bg-red-500/20
hover:text-red-400
"
        >
          <X size={20} />
        </button>

      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-8"
      >

        {/* Success / Error */}

        {message && (
          <div
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium ${
              messageType === "success"
                ? "border-green-500/30 bg-green-500/10 text-green-400"
                : "border-red-500/30 bg-red-500/10 text-red-400"
            }`}
          >
            {messageType === "success" ? (
              <CheckCircle2 size={20} />
            ) : (
              <AlertCircle size={20} />
            )}

            <span>{message}</span>

          </div>
        )}

        <PasswordInput
          label="Current Password"
          name="currentPassword"
          value={formData.currentPassword}
          show={showCurrent}
          setShow={setShowCurrent}
          handleChange={handleChange}
        />

        <PasswordInput
          label="New Password"
          name="newPassword"
          value={formData.newPassword}
          show={showNew}
          setShow={setShowNew}
          handleChange={handleChange}
        />

        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          show={showConfirm}
          setShow={setShowConfirm}
          handleChange={handleChange}
        />

        <button
          disabled={loading}
          className="
flex
w-full
items-center
justify-center
gap-2
rounded-2xl
bg-orange-600
py-3.5
font-semibold
text-white
transition
hover:bg-orange-500
hover:shadow-[0_0_30px_rgba(249,115,22,.45)]
disabled:cursor-not-allowed
disabled:opacity-60
"
        >
          {loading ? (
            <>
              <LoaderCircle
                size={20}
                className="animate-spin"
              />
              Updating...
            </>
          ) : (
            <>
              <Lock size={18} />
              Change Password
            </>
          )}
        </button>

      </form>

    </div>

  </div>
);
};

export default ChangePasswordModal;