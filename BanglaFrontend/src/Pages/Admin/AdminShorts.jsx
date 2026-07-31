import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import { Plus, Trash2, Eye, EyeOff, Star, CheckCircle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

const AdminShorts = () => {
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const [formData, setFormData] = useState({
    videoUrl: "",
    title: "",
    description: "",
    category: "Education",
  });

  useEffect(() => {
    fetchShorts();
  }, []);

  const fetchShorts = async () => {
    try {
      const res = await API.get("/shorts/admin/all");
      if (res.data.success) {
        setShorts(res.data.shorts);
      }
    } catch (error) {
      toast.error("Failed to fetch shorts");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.videoUrl) return toast.error("YouTube URL is required");

    setAdding(true);
    try {
      const res = await API.post("/shorts/admin/add", formData);
      if (res.data.success) {
        toast.success("Short added successfully");
        setFormData({ videoUrl: "", title: "", description: "", category: "Education" });
        fetchShorts();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add short");
    } finally {
      setAdding(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await API.post("/shorts/admin/sync", {});
      if (res.data.success) {
        toast.success(res.data.message || "Synced successfully");
        fetchShorts();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to sync shorts");
    } finally {
      setSyncing(false);
    }
  };

  const togglePublish = async (id) => {
    try {
      const res = await API.put(`/shorts/admin/publish/${id}`, {});
      if (res.data.success) {
        toast.success("Publish status updated");
        setShorts(shorts.map((s) => (s._id === id ? { ...s, isPublished: !s.isPublished } : s)));
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const toggleFeature = async (id) => {
    try {
      const res = await API.put(`/shorts/admin/feature/${id}`, {});
      if (res.data.success) {
        toast.success("Featured status updated");
        setShorts(shorts.map((s) => (s._id === id ? { ...s, featured: !s.featured } : s)));
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this short?")) return;
    try {
      const res = await API.delete(`/shorts/admin/${id}`);
      if (res.data.success) {
        toast.success("Short deleted");
        setShorts(shorts.filter((s) => s._id !== id));
      }
    } catch (error) {
      toast.error("Failed to delete short");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Manage Shorts</h1>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-500 disabled:opacity-50 transition"
        >
          <RefreshCw size={18} className={syncing ? "animate-spin" : ""} />
          {syncing ? "Syncing..." : "Sync Channels"}
        </button>
      </div>

      {/* Add Form */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <h2 className="mb-4 text-lg font-semibold text-white">Add New Short</h2>
        <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="YouTube Shorts URL (e.g. youtube.com/shorts/abc123)"
            value={formData.videoUrl}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            className="rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-white/40 focus:border-orange-500 focus:outline-none"
            required
          />
          <input
            type="text"
            placeholder="Title (Optional)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-white/40 focus:border-orange-500 focus:outline-none"
          />
          <textarea
            placeholder="Description (Optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-white/40 focus:border-orange-500 focus:outline-none md:col-span-2"
            rows="2"
          ></textarea>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={adding}
              className="flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-500 disabled:opacity-50 transition"
            >
              {adding ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Plus size={20} />
              )}
              Add Short
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-white/5 text-white">
              <tr>
                <th className="px-6 py-4 font-semibold">Video</th>
                <th className="px-6 py-4 font-semibold">Stats</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-white/50">Loading...</td>
                </tr>
              ) : shorts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-white/50">No shorts added yet</td>
                </tr>
              ) : (
                shorts.map((short) => (
                  <tr key={short._id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={short.thumbnail} alt="" className="h-16 w-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-semibold text-white line-clamp-1">{short.title}</p>
                          <p className="text-xs text-white/50">{new Date(short.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs flex flex-col gap-1">
                        <span>Views: <strong className="text-white">{short.views}</strong></span>
                        <span>Likes: <strong className="text-white">{short.likes?.length || 0}</strong></span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {short.isPublished ? (
                          <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-400">
                            <CheckCircle size={12} /> Published
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-1 text-xs text-yellow-400">
                            Draft
                          </span>
                        )}
                        {short.featured && (
                          <span className="flex items-center gap-1 rounded-full bg-orange-500/20 px-2 py-1 text-xs text-orange-400">
                            <Star size={12} className="fill-orange-400" /> Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleFeature(short._id)}
                          title="Toggle Featured"
                          className={`rounded-lg p-2 transition ${short.featured ? 'bg-orange-500/20 text-orange-400' : 'bg-white/5 hover:bg-white/10 text-white/70'}`}
                        >
                          <Star size={18} />
                        </button>
                        <button
                          onClick={() => togglePublish(short._id)}
                          title="Toggle Publish"
                          className="rounded-lg bg-white/5 p-2 text-white/70 hover:bg-white/10 transition"
                        >
                          {short.isPublished ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        <button
                          onClick={() => handleDelete(short._id)}
                          title="Delete"
                          className="rounded-lg bg-red-500/10 p-2 text-red-500 hover:bg-red-500/20 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminShorts;
