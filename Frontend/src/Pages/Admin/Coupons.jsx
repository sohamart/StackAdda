import { useEffect, useState } from "react";
import { Loader2, Plus, Tag, Trash2, Edit2, X } from "lucide-react";
import { toast } from "react-toastify";
import API from "../../api/axios";

const initialForm = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  minimumAmount: 0,
  maxDiscount: 0,
  usageLimit: 0,
  validTill: "",
};

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    try {
      const { data } = await API.get("/coupon");
      setCoupons(data.coupons || []);
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not load coupons.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const saveCoupon = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      
      const payload = {
        ...form,
        discountValue: Number(form.discountValue),
        validTill: new Date(form.validTill).toISOString(),
      };

      if (editingId) {
        const { data } = await API.put(`/coupon/${editingId}`, payload);
        toast.success(data.message || "Coupon updated.");
      } else {
        const { data } = await API.post("/coupon", payload);
        toast.success(data.message || "Coupon created.");
      }

      setForm(initialForm);
      setEditingId(null);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not save coupon.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      await API.delete(`/coupon/${id}`);
      toast.success("Coupon deleted.");
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not delete coupon.");
    }
  };

  const handleEdit = (coupon) => {
    // Format the date to "YYYY-MM-DDThh:mm" for the datetime-local input
    const d = new Date(coupon.validTill);
    // Pad with zeros to ensure correct format
    const formatNumber = (num) => num.toString().padStart(2, '0');
    const validTillFormatted = `${d.getFullYear()}-${formatNumber(d.getMonth() + 1)}-${formatNumber(d.getDate())}T${formatNumber(d.getHours())}:${formatNumber(d.getMinutes())}`;

    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minimumAmount: coupon.minimumAmount || 0,
      maxDiscount: coupon.maxDiscount || 0,
      usageLimit: coupon.usageLimit || 0,
      validTill: validTillFormatted,
    });
    setEditingId(coupon._id);
  };

  const cancelEdit = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  if (loading)
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={46} />
      </div>
    );

  return (
    <section className="space-y-7">
      <header>
        <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
          <Tag className="text-orange-500" /> Coupons
        </h1>
        <p className="mt-2 text-white/55">Create and manage course discount codes.</p>
      </header>

      <form
        onSubmit={saveCoupon}
        className="grid gap-3 rounded-3xl border border-white/10 bg-white/[.045] p-5 backdrop-blur-2xl md:grid-cols-2 xl:grid-cols-4"
      >
        <input
          required
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
          placeholder="Code e.g. STACK20"
          className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-orange-500"
        />

        <select
          value={form.discountType}
          onChange={(e) => setForm({ ...form, discountType: e.target.value })}
          className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-orange-500"
        >
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed amount</option>
        </select>

        <input
          required
          min="1"
          type="number"
          value={form.discountValue}
          onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
          placeholder="Discount value"
          className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-orange-500"
        />

        <input
          required
          type="datetime-local"
          value={form.validTill}
          onChange={(e) => setForm({ ...form, validTill: e.target.value })}
          className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-orange-500"
        />

        <input
          min="0"
          type="number"
          value={form.minimumAmount}
          onChange={(e) => setForm({ ...form, minimumAmount: e.target.value })}
          placeholder="Minimum amount"
          className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-orange-500"
        />

        <input
          min="0"
          type="number"
          value={form.maxDiscount}
          onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
          placeholder="Max discount (0 = none)"
          className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-orange-500"
        />

        <input
          min="0"
          type="number"
          value={form.usageLimit}
          onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
          placeholder="Usage limit (0 = unlimited)"
          className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-orange-500"
        />

        <div className="flex gap-2">
          <button
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 font-medium text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {editingId ? <Edit2 size={18} /> : <Plus size={18} />}
            {editingId ? "Update Coupon" : "Create Coupon"}
          </button>
          
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="flex items-center justify-center rounded-xl bg-white/10 px-4 py-3 text-white/70 hover:bg-white/20 hover:text-white"
              title="Cancel Edit"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </form>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[.045] backdrop-blur-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-white/40">
              <tr>
                <th className="p-5">Code</th>
                <th>Discount</th>
                <th>Usage</th>
                <th>Expiry</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="border-b border-white/5 text-sm transition hover:bg-white/5">
                  <td className="p-5 font-semibold text-orange-300">{coupon.code}</td>
                  <td className="text-white">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}%`
                      : `₹${coupon.discountValue}`}
                  </td>
                  <td className="text-white/60">
                    {coupon.usedCount} / {coupon.usageLimit || "∞"}
                  </td>
                  <td className="text-white/60">
                    {new Date(coupon.validTill).toLocaleDateString()}
                  </td>
                  <td>
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        coupon.isActive && new Date(coupon.validTill) > new Date()
                          ? "bg-green-500/15 text-green-300"
                          : "bg-red-500/15 text-red-300"
                      }`}
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="text-white/50 hover:text-orange-400 transition"
                        title="Edit Coupon"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => remove(coupon._id)}
                        className="text-white/50 hover:text-red-400 transition"
                        title="Delete Coupon"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!coupons.length && (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-white/45">
                    No coupons created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
