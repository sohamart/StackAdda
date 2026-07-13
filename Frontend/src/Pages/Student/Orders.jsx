import { useEffect, useState } from "react";
import { Loader2, ReceiptText, Download } from "lucide-react";
import { toast } from "react-toastify";
import API from "../../api/axios";

export default function StudentOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/order/my-orders")
      .then(({ data }) => setOrders(data.orders || []))
      .catch((e) => toast.error(e.response?.data?.message || "Could not load orders."))
      .finally(() => setLoading(false));
  }, []);

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

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-orange-500" size={44} /></div>;

  return (
    <section className="space-y-7 text-white px-4 md:px-0">
      <div>
        <p className="text-orange-400">PURCHASE HISTORY</p>
        <h1 className="mt-1 text-3xl font-bold">My Orders</h1>
      </div>
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[.045]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">
            <thead className="border-b border-white/10 text-xs uppercase text-white/40">
              <tr>
                <th className="p-5">Course</th>
                <th>Amount</th>
                <th>Order status</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-white/5 text-sm">
                  <td className="p-5 font-medium">{order.course?.title || "Course unavailable"}</td>
                  <td className="text-orange-300">₹{order.finalPrice}</td>
                  <td className="text-white/65">{order.orderStatus}</td>
                  <td className="text-white/65">{order.paymentStatus}</td>
                  <td className="text-white/45">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    {order.paymentStatus === "paid" && (
                      <button
                        onClick={() => handleDownloadInvoice(order._id)}
                        className="inline-flex items-center gap-2 rounded-xl bg-orange-500/10 px-3 py-1.5 text-xs font-semibold text-orange-400 transition hover:bg-orange-500/20"
                      >
                        <Download size={14} /> Invoice
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!orders.length && (
                <tr>
                  <td colSpan="6" className="p-14 text-center text-white/45">
                    <ReceiptText className="mx-auto" />
                    <p className="mt-3">No orders yet.</p>
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
