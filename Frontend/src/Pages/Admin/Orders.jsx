import { useEffect, useState } from "react";
import { CreditCard, Loader2, RotateCcw, Download } from "lucide-react";
import { toast } from "react-toastify";
import API from "../../api/axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refunding, setRefunding] = useState("");

  const load = async () => {
    try {
      const { data } = await API.get("/order/all");
      setOrders(data.orders || []);
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const refund = async (paymentId) => {
    if (!paymentId || !window.confirm("Refund this payment and remove course access?")) return;
    try {
      setRefunding(paymentId);
      const { data } = await API.post(`/payment/refund/${paymentId}`);
      toast.success(data.message);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Refund failed.");
    } finally {
      setRefunding("");
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const response = await API.get(`/payment/invoice/${orderId}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      toast.error("Failed to download invoice.");
    }
  };

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-orange-500" size={46} /></div>;

  return (
    <section className="space-y-7">
      <header>
        <h1 className="flex items-center gap-3 text-3xl font-bold text-white"><CreditCard className="text-orange-500" /> Orders & payments</h1>
        <p className="mt-2 text-white/55">Review purchases and issue refunds when needed.</p>
      </header>
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[.045] backdrop-blur-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-white/40">
              <tr>
                <th className="p-5">Student</th>
                <th>Course</th>
                <th>Amount</th>
                <th>Order</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-white/5 text-sm">
                  <td className="p-5">
                    <p className="font-medium text-white">{order.student?.name || "Deleted user"}</p>
                    <p className="text-xs text-white/45">{order.student?.email}</p>
                  </td>
                  <td className="text-white">{order.course?.title || "Deleted course"}</td>
                  <td className="font-semibold text-orange-300">₹{order.finalPrice}</td>
                  <td><span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">{order.orderStatus}</span></td>
                  <td>
                    <span className={`rounded-full px-3 py-1 text-xs ${order.paymentStatus === "paid" ? "bg-green-500/15 text-green-300" : order.paymentStatus === "refunded" ? "bg-red-500/15 text-red-300" : "bg-yellow-500/15 text-yellow-300"}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-5 flex items-center gap-2">
                    {order.paymentStatus === "paid" && (
                      <>
                        <button
                          onClick={() => handleDownloadInvoice(order._id)}
                          className="inline-flex items-center gap-2 rounded-xl bg-orange-500/10 px-3 py-2 text-xs font-semibold text-orange-400 hover:bg-orange-500/20"
                        >
                          <Download size={15} /> Invoice
                        </button>
                        <button
                          disabled={refunding === order.payment?._id}
                          onClick={() => refund(order.payment?._id)}
                          className="inline-flex items-center gap-2 rounded-xl border border-red-500/60 px-3 py-2 text-xs font-medium text-red-300 hover:bg-red-500 hover:text-white disabled:opacity-60"
                        >
                          <RotateCcw size={15} />{refunding === order.payment?._id ? "Refunding" : "Refund"}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {!orders.length && <tr><td colSpan="6" className="p-12 text-center text-white/45">No orders found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
