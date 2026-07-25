import { useEffect, useState, useCallback } from "react";
import { Search, Tv, RefreshCw, Eye, EyeOff, Loader2, Plus, Edit2, Trash2, X, Star } from "lucide-react";
import { toast } from "react-toastify";
import API from "../../api/axios";

export default function AdminChannels() {
  const [channels, setChannels] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    description: "",
    url: "",
    avatar: "",
    subscribers: "0",
    videos: "0",
    status: "Coming Soon",
    featured: false
  });

  const fetchChannels = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/channels");
      if (data.success) {
        setChannels(data.channels || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load channels.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      name: "",
      description: "",
      url: "",
      avatar: "",
      subscribers: "0",
      videos: "0",
      status: "Coming Soon",
      featured: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (channel) => {
    setEditingId(channel._id);
    setForm({
      name: channel.name,
      description: channel.description,
      url: channel.url || "",
      avatar: channel.avatar,
      subscribers: channel.subscribers || "0",
      videos: channel.videos || "0",
      status: channel.status || "Coming Soon",
      featured: channel.featured || false
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "Published" ? "Coming Soon" : "Published";
      const { data } = await API.put(`/channels/${id}`, { status: newStatus });
      if (data.success) {
        setChannels((prev) =>
          prev.map((c) => (c._id === id ? { ...c, status: data.channel.status } : c))
        );
        toast.success(`Channel is now ${data.channel.status}`);
      }
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this channel?")) return;
    try {
      const { data } = await API.delete(`/channels/${id}`);
      if (data.success) {
        setChannels((prev) => prev.filter((c) => c._id !== id));
        toast.success("Channel deleted successfully.");
      }
    } catch (error) {
      toast.error("Failed to delete channel.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingId) {
        const { data } = await API.put(`/channels/${editingId}`, form);
        if (data.success) {
          setChannels((prev) =>
            prev.map((c) => (c._id === editingId ? data.channel : c))
          );
          toast.success("Channel updated successfully");
        }
      } else {
        const { data } = await API.post("/channels", form);
        if (data.success) {
          setChannels((prev) => [...prev, data.channel]);
          toast.success("Channel added successfully");
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = channels.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10 text-white">
      {/* Header Section */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Tv size={38} className="text-orange-500" /> Channel Directory
          </h1>
          <p className="mt-2 text-white/50">
            Manage YouTube channel links, visibility, and features.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-500 px-5 py-3 font-semibold text-white transition active:scale-95 shadow-[0_4px_20px_rgba(249,115,22,0.25)] cursor-pointer"
        >
          <Plus size={18} />
          Add Channel
        </button>
      </div>

      {/* Stats and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-3xl">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search channels..."
            className="w-full rounded-2xl border border-white/15 bg-black/40 py-3.5 pl-11 pr-4 text-white outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex gap-4 text-sm text-white/55">
          <div>
            Total: <span className="font-bold text-white">{channels.length}</span>
          </div>
          <div>
            Published:{" "}
            <span className="font-bold text-green-400">
              {channels.filter((c) => c.status === "Published").length}
            </span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="animate-spin text-orange-500" size={48} />
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((channel) => (
            <article
              key={channel._id}
              className={`group relative overflow-hidden rounded-[2rem] border transition-all duration-300 flex flex-col ${
                channel.status === "Published"
                  ? "border-white/10 bg-white/[0.04] hover:border-orange-500/50"
                  : "border-white/5 bg-white/[0.01] opacity-75 hover:opacity-100 hover:border-yellow-500/30"
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <img
                    src={channel.avatar}
                    alt={channel.name}
                    className="h-16 w-16 rounded-2xl object-cover border border-white/10 shadow-lg"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(channel)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(channel._id)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold line-clamp-1">{channel.name}</h3>
                    {channel.featured && (
                      <Star size={14} className="text-orange-400" fill="currentColor" />
                    )}
                  </div>
                  <p className="mt-2 text-sm text-white/50 line-clamp-2 min-h-[40px]">
                    {channel.description}
                  </p>
                </div>

                <div className="mt-6 flex justify-between border-t border-white/10 pt-4">
                  <div className="text-xs text-white/40 flex flex-col gap-1">
                    <span>Subs: {channel.subscribers}</span>
                    <span>Vids: {channel.videos}</span>
                  </div>

                  <button
                    onClick={() => handleToggleStatus(channel._id, channel.status)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition duration-300 cursor-pointer ${
                      channel.status === "Published"
                        ? "bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20"
                        : "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/20"
                    }`}
                  >
                    {channel.status === "Published" ? (
                      <>
                        <Eye size={14} /> Published
                      </>
                    ) : (
                      <>
                        <EyeOff size={14} /> Coming Soon
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0c0c0e] border border-white/10 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-6 top-6 text-white/40 hover:text-white"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? "Edit Channel" : "Add Channel"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1 uppercase tracking-wider">Channel Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1 uppercase tracking-wider">Description</label>
                <textarea
                  required
                  rows="3"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1 uppercase tracking-wider">YouTube URL</label>
                <input
                  required
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1 uppercase tracking-wider">Avatar Image URL</label>
                <input
                  required
                  type="url"
                  value={form.avatar}
                  onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-1 uppercase tracking-wider">Subscribers</label>
                  <input
                    value={form.subscribers}
                    onChange={(e) => setForm({ ...form, subscribers: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-1 uppercase tracking-wider">Videos</label>
                  <input
                    value={form.videos}
                    onChange={(e) => setForm({ ...form, videos: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500 text-white"
                  >
                    <option value="Published">Published</option>
                    <option value="Coming Soon">Coming Soon</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-5 h-5 rounded accent-orange-500 bg-white/10 border-white/20"
                  />
                  <label htmlFor="featured" className="text-sm font-semibold cursor-pointer">
                    Main / Featured
                  </label>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition disabled:opacity-50 flex items-center justify-center"
                >
                  {submitting ? <Loader2 size={20} className="animate-spin" /> : "Save Channel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
