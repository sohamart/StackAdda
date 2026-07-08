import React from "react";
import { Mail, User, ShieldCheck, Pencil, Lock } from "lucide-react";

const Profile = () => {

  // পরে AuthContext থেকে আসবে
  const user = {
    name: "Soham Dutta",
    email: "soham@gmail.com",
    role: "Student",
  };

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Header */}

      <div className="border-b border-orange-500/20 bg-white/5 backdrop-blur-xl">

        <div className="max-w-5xl mx-auto px-5 py-5">

          <h1 className="text-3xl font-bold">
            My Profile
          </h1>

        </div>

      </div>

      <div className="max-w-5xl mx-auto px-5 py-10">

        {/* Profile Card */}

        <div className="rounded-3xl border border-orange-500/20 bg-white/5 p-8">

          <div className="flex flex-col md:flex-row gap-8 items-center">

            {/* Avatar */}

            <div className="h-36 w-36 rounded-full bg-orange-500 flex items-center justify-center text-5xl font-bold">

              {user.name.charAt(0)}

            </div>

            {/* Info */}

            <div className="flex-1 space-y-5">

              <div className="flex items-center gap-3">

                <User className="text-orange-500" />

                <div>

                  <p className="text-sm text-white/50">
                    Full Name
                  </p>

                  <h2 className="text-xl font-semibold">
                    {user.name}
                  </h2>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <Mail className="text-orange-500" />

                <div>

                  <p className="text-sm text-white/50">
                    Email
                  </p>

                  <h2 className="text-xl font-semibold">
                    {user.email}
                  </h2>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <ShieldCheck className="text-orange-500" />

                <div>

                  <p className="text-sm text-white/50">
                    Role
                  </p>

                  <h2 className="text-xl font-semibold">
                    {user.role}
                  </h2>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Buttons */}

        <div className="grid md:grid-cols-2 gap-6 mt-8">

          <button className="rounded-2xl bg-orange-500 py-4 font-semibold flex items-center justify-center gap-2 hover:bg-orange-600 transition">

            <Pencil size={20} />

            Edit Profile

          </button>

          <button className="rounded-2xl border border-orange-500 py-4 font-semibold flex items-center justify-center gap-2 hover:bg-orange-500 transition">

            <Lock size={20} />

            Change Password

          </button>

        </div>

      </div>

    </div>
  );
};

export default Profile;