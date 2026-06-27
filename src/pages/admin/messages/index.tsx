import { useEffect, useRef, useState } from "react";
import { MessageSquare, Search } from "lucide-react";
import { Typography } from "@/components";
import {
  useGetConversationQuery,
  useLazyFindOrCreateConversationQuery,
} from "@/redux/api/conversations";
import { useGetCustomersQuery } from "@/redux/api/users";
import { useSocket } from "@/hooks/useSocket";
import { apiUrl } from "@/config";
import Cookies from "js-cookie";
import { cookieValues } from "@/constants/data";
import { RichChat } from "@/components/chat/RichChat";

const Avatar = ({ name, src, size = 40 }: { name: string; src?: string; size?: number }) => {
  if (src) {
    return (
      <img src={src} alt={name} className="rounded-full object-cover shrink-0" style={{ width: size, height: size }} />
    );
  }
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["bg-B400", "bg-BR400", "bg-G400", "bg-O400", "bg-R400", "bg-P400"];
  const idx = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
  return (
    <div
      className={`${colors[idx]} rounded-full shrink-0 grid place-items-center text-white font-bold`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  );
};

const ChatPanel = ({ conversationId }: { conversationId: string }) => {
  const { data, isLoading, refetch } = useGetConversationQuery(conversationId);
  const {
    socket,
    joinConversation,
    leaveConversation,
    sendMessage: socketSend,
    markRead,
    emitTyping,
  } = useSocket();
  const [typing, setTyping] = useState(false);
  const typingTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const conversation = data?.data;

  useEffect(() => {
    joinConversation(conversationId);
    markRead(conversationId);
    return () => leaveConversation(conversationId);
  }, [conversationId, joinConversation, leaveConversation, markRead]);

  useEffect(() => {
    if (!socket) return;
    const onNew = (d: { conversationId: string }) => {
      if (d.conversationId === conversationId) { refetch(); markRead(conversationId); setTyping(false); }
    };
    const onTyping = (d: { conversationId: string; role: string }) => {
      if (d.conversationId === conversationId && d.role === "customer") {
        setTyping(true);
        clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => setTyping(false), 3000);
      }
    };
    const onStop = (d: { conversationId: string }) => {
      if (d.conversationId === conversationId) setTyping(false);
    };
    socket.on("new_message", onNew);
    socket.on("user_typing", onTyping);
    socket.on("user_stop_typing", onStop);
    return () => {
      socket.off("new_message", onNew);
      socket.off("user_typing", onTyping);
      socket.off("user_stop_typing", onStop);
      clearTimeout(typingTimer.current);
    };
  }, [socket, conversationId, refetch, markRead]);

  if (isLoading || !conversation) return <div className="text-N400 py-12 text-center">Loading…</div>;

  const customer = conversation.customer;
  const customerName = `${customer.firstName} ${customer.lastName}`;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-N30 bg-white shrink-0">
        <Avatar name={customerName} size={38} />
        <div>
          <h3 className="text-sm font-semibold text-N900">{customerName}</h3>
          <p className="text-xs text-N400">{customer.email}</p>
        </div>
      </div>
      <div className="flex-1 min-h-0 relative">
        <RichChat
          messages={conversation.messages}
          myRole="admin"
          isOpen={true}
          typing={typing}
          senderName={customerName}
          onSend={(body, attachments) => socketSend(conversationId, body, attachments)}
          onTyping={() => emitTyping(conversationId)}
          onUploadFile={async (file) => {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch(`${apiUrl}/conversations/upload?type=chat`, {
              method: "POST",
              headers: { Authorization: `Bearer ${Cookies.get(cookieValues.token)}` },
              body: fd,
            });
            const json = await res.json();
            return json.data.url;
          }}
        />
      </div>
    </div>
  );
};

const AdminMessagesPage = () => {
  const [search, setSearch] = useState("");
  const { data: customersData, isLoading } = useGetCustomersQuery({ pageNumber: 1, pageSize: 200 });
  const { socket } = useSocket();
  const [onlineIds, setOnlineIds] = useState<Set<string>>(new Set());
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [findOrCreate] = useLazyFindOrCreateConversationQuery();

  const allCustomers = (customersData?.data?.data ?? []).filter((u) => !u.staffId);

  useEffect(() => {
    if (!socket) return;
    socket.emit("get_online_users");
    const onOnline = (ids: string[]) => setOnlineIds(new Set(ids));
    socket.on("online_users_update", onOnline);
    return () => { socket.off("online_users_update", onOnline); };
  }, [socket]);

  const handleSelectCustomer = async (customerId: string) => {
    setSelectedCustomerId(customerId);
    setActiveConversationId(null);
    try {
      const res = await findOrCreate(customerId).unwrap();
      setActiveConversationId(res.data._id);
    } catch {
      setActiveConversationId(null);
    }
  };

  const filtered = search.trim()
    ? allCustomers.filter((c) => {
        const q = search.toLowerCase();
        return `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
      })
    : allCustomers;

  const sorted = [...filtered].sort((a, b) => {
    const aOn = onlineIds.has(a._id) ? 1 : 0;
    const bOn = onlineIds.has(b._id) ? 1 : 0;
    if (aOn !== bOn) return bOn - aOn;
    return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
  });

  if (isLoading)
    return <div className="flex items-center justify-center py-20"><Typography color="N400">Loading…</Typography></div>;

  return (
    <div className="p-6 h-[calc(100vh-80px)]">
      <div className="flex border border-N30 rounded-xl overflow-hidden bg-white h-full shadow-sm">
        {/* Customer list */}
        <div className={`w-full sm:w-[320px] sm:border-r border-N30 shrink-0 flex flex-col ${selectedCustomerId ? "hidden sm:flex" : "flex"}`}>
          <div className="px-5 py-4 border-b border-N30">
            <h2 className="text-lg font-bold text-N900 mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-N400" size={16} />
              <input
                type="text"
                placeholder="Search customers…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-N30 rounded-full bg-N10 focus:outline-none focus:border-N200 placeholder:text-N400"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {sorted.length === 0 ? (
              <div className="text-center py-12 text-sm text-N400">No customers found</div>
            ) : (
              sorted.map((c) => {
                const name = `${c.firstName} ${c.lastName}`;
                const isOnline = onlineIds.has(c._id);
                const active = selectedCustomerId === c._id;
                return (
                  <button
                    key={c._id}
                    onClick={() => handleSelectCustomer(c._id)}
                    className={`w-full text-left px-5 py-3 border-b border-N20 hover:bg-N10 transition-colors flex items-center gap-3 ${active ? "bg-B50" : ""}`}
                  >
                    <div className="relative shrink-0">
                      <Avatar name={name} src={c.profilePicture} size={42} />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${isOnline ? "bg-G400" : "bg-N200"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-N800 truncate">{name}</span>
                        <span className={`text-[10px] shrink-0 ${isOnline ? "text-G600" : "text-N400"}`}>
                          {isOnline ? "Online" : "Offline"}
                        </span>
                      </div>
                      <p className="text-xs text-N400 truncate">{c.email}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat panel */}
        <div className={`flex-1 flex flex-col ${!selectedCustomerId ? "hidden sm:flex" : "flex"}`}>
          {activeConversationId ? (
            <ChatPanel conversationId={activeConversationId} />
          ) : selectedCustomerId ? (
            <div className="flex-1 flex items-center justify-center">
              <Typography color="N400">Loading conversation…</Typography>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-N10/30">
              <div className="text-center flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-N20 grid place-items-center">
                  <MessageSquare size={28} className="text-N300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-N600">Select a customer</p>
                  <p className="text-xs text-N400 mt-0.5">Choose a customer to start or continue a conversation</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessagesPage;
