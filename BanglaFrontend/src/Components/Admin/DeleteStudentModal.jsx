import { TriangleAlert, X } from "lucide-react";

const DeleteStudentModal = ({
  open,
  onClose,
  onConfirm,
  loading,
  studentName,
}) => {

  if (!open) return null;

  return (

    <div
      className="
fixed
inset-0
z-[999]
flex
items-center
justify-center
bg-black/70
backdrop-blur-md
p-4
"
    >

      <div
        className="
w-full
max-w-md
overflow-hidden
rounded-3xl
border
border-white/10
bg-[#101010]
shadow-[0_0_60px_rgba(249,115,22,.12)]
"
      >

        {/* Header */}

        <div className="border-b border-white/10 p-6">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div
                className="
flex
h-12
w-12
items-center
justify-center
rounded-2xl
bg-red-500/20
text-red-400
"
              >

                <TriangleAlert size={24} />

              </div>

              <div>

                <h2 className="text-xl font-bold text-white">
                  Delete Student
                </h2>

                <p className="text-sm text-white/50">
                  This action cannot be undone.
                </p>

              </div>

            </div>

            <button
              onClick={onClose}
              className="
rounded-xl
p-2
text-white/50
transition
hover:bg-white/10
hover:text-white
"
            >

              <X size={20} />

            </button>

          </div>

        </div>
                {/* Body */}

        <div className="p-6">

          <p className="text-white/70 leading-7">

            Are you sure you want to permanently delete

            <span className="font-semibold text-orange-400">
              {" "}
              {studentName}
            </span>

            ?

          </p>

          <p className="mt-3 text-sm text-red-400">

            This will permanently remove the student account
            and this action cannot be undone.

          </p>

          {/* Buttons */}

          <div className="mt-8 flex gap-3">

            <button
              onClick={onClose}
              disabled={loading}
              className="
flex-1
rounded-2xl
border
border-white/10
bg-white/[0.05]
py-3
font-semibold
text-white
transition
hover:border-orange-500
"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              className="
flex-1
rounded-2xl
bg-red-500
py-3
font-semibold
text-white
transition
hover:bg-red-600
disabled:cursor-not-allowed
disabled:opacity-60
"
            >
              {loading
                ? "Deleting..."
                : "Delete Student"}
            </button>

          </div>

        </div>

      </div>

    </div>

  );
};

export default DeleteStudentModal;