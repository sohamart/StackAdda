import { useEffect, useState } from "react";
import { Loader2, MailCheck, Send, X } from "lucide-react";
import { toast } from "react-toastify";
import API from "../../api/axios";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyOpen, setReplyOpen] = useState(null);
  const [replyText, setReplyText] = useState("");

  const load = () =>
    API.get("/contact")
      .then(({ data }) => setContacts(data.contacts || []))
      .catch((e) => toast.error(e.response?.data?.message || "Could not load messages."))
      .finally(() => setLoading(false));

  useEffect(() => { load() }, []);

  const update = async (id, status, replyMessage = "") => {
    const toastId = toast.loading("Updating status...");
    try {
      await API.put(`/contact/${id}`, { status, replyMessage });
      toast.update(toastId, { render: "Message updated and email sent!", type: "success", isLoading: false, autoClose: 3000 });
      setReplyOpen(null);
      setReplyText("");
      load();
    } catch {
      toast.update(toastId, { render: "Could not update message.", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const handleStatusChange = (contact, newStatus) => {
    if (newStatus === "closed" && contact.status !== "closed") {
      setReplyOpen(contact._id);
      setReplyText("");
    } else {
      update(contact._id, newStatus);
    }
  };

  const cancelReply = () => {
    setReplyOpen(null);
    setReplyText("");
  };

  if (loading)
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );

  return (
    <section className="space-y-7 text-white">
      <div>
        <p className="text-orange-400 font-semibold tracking-widest text-xs uppercase">INBOX</p>
        <h1 className="mt-1 text-3xl font-bold">Contact queries</h1>
      </div>
      <div className="space-y-4">
        {contacts.map((contact) => (
          <article key={contact._id} className="rounded-3xl border border-white/10 bg-white/[.045] p-6 backdrop-blur-md">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <div>
                <h2 className="font-bold text-lg">{contact.subject || "General enquiry"}</h2>
                <p className="mt-1 text-sm text-orange-300">
                  {contact.name} &middot; {contact.email}
                </p>
              </div>
              <select
                value={contact.status}
                onChange={(e) => handleStatusChange(contact, e.target.value)}
                className={`h-fit rounded-xl px-3 py-2 text-sm font-semibold outline-none ${
                   contact.status === 'new' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                   contact.status === 'read' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                   'bg-green-500/20 text-green-400 border border-green-500/30'
                }`}
              >
                <option value="new" className="bg-zinc-900 text-white">New</option>
                <option value="read" className="bg-zinc-900 text-white">Read (Reviewing)</option>
                <option value="closed" className="bg-zinc-900 text-white">Closed (Resolved)</option>
              </select>
            </div>
            <p className="mt-5 whitespace-pre-wrap leading-7 text-white/70 bg-black/20 p-4 rounded-2xl border border-white/5">{contact.message}</p>
            
            {replyOpen === contact._id && (
              <div className="mt-6 border-t border-white/10 pt-6 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex justify-between items-center mb-3">
                   <h3 className="text-sm font-bold text-orange-400">Resolve Query & Send Email</h3>
                   <button onClick={cancelReply} className="text-white/40 hover:text-white transition"><X size={18}/></button>
                </div>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply message to the user here. It will be emailed to them."
                  className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none focus:border-orange-500/50 min-h-[120px]"
                ></textarea>
                <div className="mt-3 flex justify-end gap-3">
                  <button onClick={cancelReply} className="rounded-xl px-4 py-2 text-sm font-semibold text-white/60 hover:bg-white/5">Cancel</button>
                  <button
                    onClick={() => update(contact._id, "closed", replyText)}
                    className="flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2 text-sm font-bold text-white hover:bg-orange-500 transition shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                  >
                    <Send size={16} /> Resolve & Send
                  </button>
                </div>
              </div>
            )}

            <p className="mt-4 text-xs font-semibold text-white/30">
              {new Date(contact.createdAt).toLocaleString()}
            </p>
          </article>
        ))}
        {!contacts.length && !loading && (
          <div className="rounded-3xl border border-dashed border-white/15 p-16 text-center text-white/45">
            <MailCheck className="mx-auto" size={48} />
            <p className="mt-4 font-semibold">No contact queries yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
