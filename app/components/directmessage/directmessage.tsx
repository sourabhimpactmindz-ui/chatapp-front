"use client";

import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  MessageSquare,
  Zap,
  Star,
  AtSign,
  MoreHorizontal,
  Send,
  Search,
  Phone,
  Video,
  Info,
} from "lucide-react";

import "./directmessage.css";

import { useConverQuery } from "@/app/features/conversationApi";
import {
  MessageApi,
  useAllMessageQuery,
  useSendmessageMutation,
} from "@/app/features/messageApi";

import { socket } from "@/app/services/socket";
import { useGetMeQuery } from "@/app/features/AuthApi";
import { time } from "console";


 
const getId = (value: any) => {
  if (!value) return null;
 
  if (typeof value === "object") {
    return String(value._id || value.id || value.userId || "");
  }
 
  return String(value);
};
 
function formatTime(dateString: string) {
  if (!dateString) return "";
 
  const date = new Date(dateString);
 
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
 
// ===============================
// AVATAR
// ===============================
 
function Avatar({ conv, size = 44 }: { conv: any; size?: number }) {
  const style = {
    width: size,
    height: size,
    fontSize: size * 0.36,
  };
 
  if (conv.avatar) {
    return (
      <img
        src={conv.avatar}
        alt={conv.name}
        style={style}
        className="dm-avatar-img"
      />
    );
  }
 
  return (
    <div style={style} className="dm-avatar-fallback">
      {conv.initials}
    </div>
  );
}
 
// ===============================
// EMPTY STATE
// ===============================
 
function EmptyState({
  conversations,
  onSelect,
}: {
  conversations: any[];
  onSelect: (id: string) => void;
}) {
  const infoCards = [
    {
      icon: Zap,
      title: "Recent activity",
      sub: "Check who's online now",
    },
    {
      icon: Star,
      title: "Favorites",
      sub: "Quick access to best friends",
    },
    {
      icon: AtSign,
      title: "Mentions",
      sub: "Messages specifically for you",
    },
  ];
 
  return (
    <div className="dm-empty">
      <div className="dm-empty-icon">
        <MessageSquare
          size={32}
          color="#ffffff"
          fill="#ffffff"
          strokeWidth={1}
        />
      </div>
 
      <h2 className="dm-empty-title">Select a conversation</h2>
 
      <p className="dm-empty-sub">
        Choose one of your existing direct messages or start a new
        conversation to begin chatting.
      </p>
 
      <div className="dm-cards">
        {infoCards.map(({ icon: Icon, title, sub }) => (
          <div key={title} className="dm-card">
            <Icon className="dm-card-icon" />
            <p className="dm-card-title">{title}</p>
            <p className="dm-card-sub">{sub}</p>
          </div>
        ))}
      </div>
 
      <p className="dm-recent-label">RECENT DMS</p>
 
      <div className="dm-recent-row">
        {conversations.slice(0, 3).map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className="dm-recent-item"
          >
            <Avatar conv={c} size={52} />
            <span>{c.name.split(" ")[0]}</span>
          </button>
        ))}
 
        <button className="dm-recent-item">
          <div className="dm-more-circle">
            <MoreHorizontal size={20} />
          </div>
          <span>More</span>
        </button>
      </div>
    </div>
  );
}
 
// ===============================
// CHAT VIEW
// ===============================
 
function ChatView({
  conv,
  onSend,
  currentUserId,
}: {
  conv: any;
  onSend: (id: string, text: string) => Promise<any>;
  currentUserId: any;
}) {
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
 
  const { data: AllMessage } = useAllMessageQuery(conv?.id, {
    skip: !conv?.id,
  });
 
  const messages = AllMessage?.messages || [];
 
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);
 
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
 
    if (!draft.trim()) return;
 
    const sentMessage = await onSend(conv.id, draft.trim());
 
    if (sentMessage) setDraft("");
  };
 
  const userId = getId(currentUserId);
 
  return (
    <div className="dm-chat">
      {/* HEADER */}
      <div className="dm-chat-header">
        <div className="dm-chat-header-info">
          <Avatar conv={conv} size={40} />
 
          <div>
            <p className="dm-chat-name">{conv.name}</p>
          <p className="dm-chat-status">
  {conv.isGroup ? `${conv.memberCount} members` : conv.online ? "Active now" : "Offline"}
</p>


          </div>
        </div>
 
        <div className="dm-chat-actions">
          <button className="dm-icon-btn">
            <Phone size={16} />
          </button>
          <button className="dm-icon-btn">
            <Video size={16} />
          </button>
          <button className="dm-icon-btn">
            <Info size={16} />
          </button>
        </div>
      </div>
 
      {/* MESSAGES */}
      <div className="dm-messages">
        {messages.map((m: any, i: number) => {
          const senderId = getId(m.sender || m.senderId || m.from);
          const isSent = !!senderId && !!userId && senderId === userId;
 
          return (
            <div
              key={m._id || i}
              className={`dm-msg-row ${isSent ? "sent" : "received"}`}
            >
              <div className={`dm-bubble ${isSent ? "sent" : "received"}`}>
  {conv.isGroup && !isSent && (
    <p className="dm-bubble-sender">{m.sender?.name}</p>
  )}
  <p>{m.text}</p>
  <p className="dm-bubble-time">
    {m.time || formatTime(m.createdAt)}
  </p>
</div>
            </div>
          );
        })}
 
        <div ref={bottomRef} />
      </div>
 
      {/* COMPOSER */}
      <form onSubmit={submit} className="dm-composer">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message..."
          className="dm-composer-input"
        />
 
        <button type="submit" className="dm-send-btn" disabled={!draft.trim()}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
 
// ===============================
// MAIN DIRECT MESSAGES
// ===============================
 
export default function DirectMessages() {
  const dispatch = useDispatch();
 
  const { data } = useConverQuery(undefined);
 
  const [selectedId, setSelectedId] = useState<string | null>(null);
 
  const [query, setQuery] = useState("");
 
  const [sendMessage] = useSendmessageMutation();
 
  const { data: mdata } = useGetMeQuery(undefined);
  const user = mdata?.data;
 
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
 
 
 const myId = user?._id || user?.id;

useEffect(() => {
 
  if (!myId) return;

  const handleOnlineUsers = (users: string[]) => {
    setOnlineUsers(users.map(String));
  };

  const onConnect = () => {
    socket.emit("setup", String(myId));
  };

  const onError = (err: any) => console.log("connect_error:", err.message);

  socket.on("online-users", handleOnlineUsers);
  socket.on("connect_error", onError);

  if (socket.connected) onConnect();
  else {
    socket.once("connect", onConnect);
    socket.connect();
  }

  return () => {
    socket.off("online-users", handleOnlineUsers);
    socket.off("connect", onConnect);
    socket.off("connect_error", onError);
  };
}, [myId]);

useEffect(() => {
  if (!myId) return;
  const event = `conversations-updated:${myId}`;
  const handler = () => dispatch(MessageApi.util.invalidateTags(["Conversations"]));
  socket.on(event, handler);
  return () => { socket.off(event, handler); };
}, [myId, dispatch]);
 
 
useEffect(() => {
  const handleReceive = (message: any) => {
    console.log("Received socket message:", message);

    const convId = String(
      message.conversation?._id ||
        message.conversation ||
        message.conversationId
    );

    // 1. cache mein turant add karo (agar ye chat pehle khuli thi)
    dispatch(
      MessageApi.util.updateQueryData("AllMessage", convId, (draft: any) => {
        if (!draft?.messages) return;
        if (!draft.messages.some((m: any) => m._id === message._id)) {
          draft.messages.push(message);
        }
      })
    );

    // 2. fallback: messages aur sidebar dono refetch
    dispatch(MessageApi.util.invalidateTags(["Messages", "Conversations"]));
  };

  socket.on("receive-message", handleReceive);
  return () => {
    socket.off("receive-message", handleReceive);
  };
}, [dispatch]);
 
  // ===============================
  // CONVERSATION LIST
  // ===============================

  // ===============================
  // CONVERSATION LIST
  // ===============================

  const conversationList = (data?.data || []).map((c: any) => {
    if (c.isGroup) {
      return {
        id: c._id,
        isGroup: true,
        name: c.groupName || "Group",
        receiverId: null,
        avatar: null,
        initials: c.groupName?.[0]?.toUpperCase() || "G",
        time: formatTime(c.updatedAt),
        unread: c.unreadCount || 0,
        online: false,
        memberCount: c.participants?.length || 0,
        preview: c.lastMessage?.text || "",
        messages: [],
      };
    }

    const other = c.participants?.find(
      (p: any) => String(p._id) !== String(myId)
    );

    return {
      id: c._id,
      isGroup: false,
      name: other?.name || "Unknown",
      receiverId: other?._id,
      avatar: other?.images?.avatar?.url || null,
      initials: other?.name?.[0] || "?",
      time: formatTime(c.updatedAt),
      unread: c.unreadCount || 0,
      online: onlineUsers.includes(String(other?._id)),
      memberCount: 0,
      preview: c.lastMessage?.text || "",
      messages: [],
    };
  });
 
  const selected =
    conversationList.find((c: any) => c.id === selectedId) || null;
 
  const filtered = conversationList.filter((c: any) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );
 
  const handleSelect = (id: string) => {
    setSelectedId(id);
  };
 
  // ===============================
  // SEND MESSAGE
  // ===============================
 
  const handleSend = async (id: string, text: string) => {
    try {
      const conversation = conversationList.find((c: any) => c.id === id);

if (!conversation) {
  console.log("Conversation not found");
  return null;
}

const payload = conversation.isGroup
  ? { conversationId: conversation.id, text: text.trim() }
  : { receiverId: conversation.receiverId, text: text.trim() };

if (!conversation.isGroup && !conversation.receiverId) {
  console.log("Receiver ID not found");
  return null;
}

const response = await sendMessage(payload).unwrap();
      console.log("Message sent:", response);
 
      const msg = response.message;
 
      dispatch(
      MessageApi.util.updateQueryData("AllMessage", String(id), (draft: any) => {
          if (!draft?.messages) return;
 
          if (!draft.messages.some((m: any) => m._id === msg._id)) {
            draft.messages.push(msg);
          }
        })
      );
 
      return msg;
    } catch (error) {
      console.log("Send message error:", error);
      return null;
    }
  };
 
  // ===============================
  // UI
  // ===============================
 
  return (
    <div className="dm-app">
      {/* SIDEBAR */}
      <div className="dm-sidebar">
        <div className="dm-sidebar-header">
          <h1 className="dm-title">Direct messages</h1>
 
          <span className="dm-count-badge">
            {conversationList.length} total
          </span>
        </div>
 
        {/* SEARCH */}
        <div className="dm-search-wrap">
          <div className="dm-search-box">
            <Search className="dm-search-icon" />
 
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conversations..."
              className="dm-search-input"
            />
          </div>
        </div>
 
        {/* CONVERSATION LIST */}
        <div className="dm-list">
          {filtered.map((c: any) => (
            <button
              key={c.id}
              onClick={() => handleSelect(c.id)}
              className={`dm-item ${selectedId === c.id ? "active" : ""}`}
            >
              <div className="dm-item-avatar-wrap">
                <Avatar conv={c} size={44} />
 
                {c.online && <span className="dm-online-dot" />}
              </div>
 
              <div className="dm-item-body">
                <div className="dm-item-row">
                  <p className={`dm-item-name ${c.unread ? "unread" : ""}`}>
                    {c.name}
                  </p>
 
                  <span className="dm-item-time">{c.time}</span>
                </div>
 
                <p className={`dm-item-preview ${c.unread ? "unread" : ""}`}>
                  {c.preview}
                </p>
              </div>
 
              {c.unread > 0 && (
                <span className="dm-unread-badge">{c.unread}</span>
              )}
            </button>
          ))}
 
          {filtered.length === 0 && (
            <p className="dm-list-empty">No conversations found.</p>
          )}
        </div>
      </div>
 
      {/* CHAT */}
      {selected ? (
        <ChatView
          conv={selected}
          onSend={handleSend}
          currentUserId={user?._id || user?.id}
        />
      ) : (
        <EmptyState conversations={conversationList} onSelect={handleSelect} />
      )}
    </div>
  );
}
 