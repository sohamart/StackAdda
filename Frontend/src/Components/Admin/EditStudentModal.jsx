import { useEffect, useState } from "react";
import API from "../../api/axios";
import { Camera, X } from "lucide-react";
import { toast } from "react-toastify";

const EditStudentModal = ({
    open,
    onClose,
    student,
    onSuccess,
}) => {

    const [loading, setLoading] = useState(false);

    const [imageLoading, setImageLoading] =
        useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        bio: "",
    });

    useEffect(() => {

        if (student) {

            setFormData({
                name: student.name || "",
                email: student.email || "",
                phone: student.phone || "",
                bio: student.bio || "",
            });

        }

    }, [student]);

    if (!open) return null;

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

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

            toast.success(data.message);

            onSuccess();

            onClose();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Update Failed"
            );

        } finally {

            setLoading(false);

        }

    };

    const handleImage = async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        try {

            setImageLoading(true);

            const form = new FormData();

            form.append("image", file);

            const { data } = await API.put(
                `/admin/student/${student._id}/profile-image`,
                form,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

            toast.success(data.message);

            onSuccess();

        } catch (error) {

            toast.error(
                error.response?.data?.message
            );

        } finally {

            setImageLoading(false);

        }

    };

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-5">

            <div
                className="
w-full
max-w-2xl
rounded-3xl
border
border-white/10
bg-[#0d0d0d]
p-8
backdrop-blur-3xl
"
            >

                <div className="flex items-center justify-between">

                    <h2 className="text-2xl font-bold text-white">
                        Edit Student
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-white/60 hover:text-white"
                    >
                        <X />
                    </button>

                </div>

                <div className="mt-8 flex flex-col items-center">

                    <img
                        src={
                            student.profileImage?.url ||
                            `https://ui-avatars.com/api/?name=${student.name}&background=f97316&color=fff`
                        }
                        className="h-32 w-32 rounded-full border-4 border-orange-500 object-cover"
                    />

                    <label className="mt-4 cursor-pointer rounded-xl bg-orange-500 px-5 py-2 text-white hover:bg-orange-600">

                        <Camera
                            size={18}
                            className="inline mr-2"
                        />

                        {imageLoading
                            ? "Uploading..."
                            : "Change Image"}

                        <input
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={handleImage}
                        />

                    </label>

                </div>

                <div className="mt-8 grid gap-5">

                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Name"
                        className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white outline-none"
                    />

                    <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white outline-none"
                    />

                    <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone"
                        className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white outline-none"
                    />

                    <textarea
                        rows={5}
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Bio"
                        className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white outline-none"
                    />

                </div>

                <div className="mt-8 flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        className="rounded-xl border border-white/10 px-6 py-3 text-white"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={loading}
                        onClick={handleUpdate}
                        className="rounded-xl bg-orange-500 px-6 py-3 text-white hover:bg-orange-600"
                    >
                        {loading
                            ? "Saving..."
                            : "Save Changes"}
                    </button>

                </div>

            </div>

        </div>

    );

};

export default EditStudentModal;