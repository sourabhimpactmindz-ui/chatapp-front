'use client'

import { useState, useRef, useEffect } from "react";
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
import { useAllMessageQuery } from "@/app/features/messageApi";

// const CONVERSATIONS = [
//   {
//     id: 1,
//     name: "Elena Vance",
//     avatar: "https://i.pravatar.cc/100?img=47",
//     time: "10:42 AM",
//     unread: 2,
//     online: true,
//     preview: "The final design assets are ready f...",
//     messages: [
//       { from: "them", text: "Hey! Just wrapped up the last round of tweaks.", time: "10:38 AM" },
//       { from: "them", text: "The final design assets are ready for handoff whenever you are.", time: "10:42 AM" },
//     ],
//   },
//   {
//     id: 2,
//     name: "Marcus Chen",
//     avatar: "https://i.pravatar.cc/100?img=12",
//     time: "Yesterday",
//     unread: 0,
//     online: true,
//     preview: "I've pushed the latest changes to the ma...",
//     messages: [
//       { from: "them", text: "I've pushed the latest changes to the main branch.", time: "Yesterday" },
//       { from: "me", text: "Nice, pulling it now.", time: "Yesterday" },
//     ],
//   },
//   {
//     id: 3,
//     name: "Sarah Jenkins",
//     avatar: "https://i.pravatar.cc/100?img=32",
//     time: "Tue",
//     unread: 0,
//     online: true,
//     preview: "Don't forget the sync meeting at 2 PM to...",
//     messages: [
//       { from: "them", text: "Don't forget the sync meeting at 2 PM today.", time: "Tue" },
//     ],
//   },
//   {
//     id: 4,
//     name: "David Miller",
//     avatar: "https://i.pravatar.cc/100?img=51",
//     time: "Oct 12",
//     unread: 0,
//     online: false,
//     preview: "The contract has been signed by the clie...",
//     messages: [
//       { from: "them", text: "The contract has been signed by the client.", time: "Oct 12" },
//     ],
//   },
//   {
//     id: 5,
//     name: "Alex Johnson",
//     avatar: null,
//     initials: "AJ",
//     time: "Oct 11",
//     unread: 0,
//     online: false,
//     preview: "Can you help me with the API document...",
//     messages: [
//       { from: "them", text: "Can you help me with the API documentation?", time: "Oct 11" },
//     ],
//   },
// ];


function Avatar({ conv, size = 44 }) {
  const style = { width: size, height: size, fontSize: size * 0.36 };
  if (conv.avatar) {
    return (
      <img src={conv.avatar} alt={conv.name} style={style} className="dm-avatar-img" />
    );
  }
  return (
    <div style={style} className="dm-avatar-fallback">
      {conv.initials}
    </div>
  );
}

function EmptyState({ conversations, onSelect }) {
  const infoCards = [
    { icon: Zap, title: "Recent activity", sub: "Check who's online now" },
    { icon: Star, title: "Favorites", sub: "Quick access to best friends" },
    { icon: AtSign, title: "Mentions", sub: "Messages specifically for you" },
  ];

  return (
    <div className="dm-empty">
      <div className="dm-empty-icon">
        <MessageSquare size={32} color="#ffffff" fill="#ffffff" strokeWidth={1} />
      </div>
      <h2 className="dm-empty-title">Select a conversation</h2>
      <p className="dm-empty-sub">
        Choose one of your existing direct messages or start a new conversation to begin
        chatting.
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
          <button key={c.id} onClick={() => onSelect(c.id)} className="dm-recent-item">
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

function ChatView({ conv, onSend }) {
  const [draft, setDraft] = useState("");
  const bottomRef = useRef(null);
  const { data : AllMessage } = useAllMessageQuery(conv?.id, { 
    skip : !conv?.id
  })


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [AllMessage]);

  const submit = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    onSend(conv.id, draft.trim());
    setDraft("");
  };

  return (
    <div className="dm-chat">
      <div className="dm-chat-header">
        <div className="dm-chat-header-info">
          <Avatar conv={conv} size={40} />
          <div>
            <p className="dm-chat-name">{conv.name}</p>
            <p className="dm-chat-status">{conv.online ? "Active now" : "Offline"}</p>
          </div>
        </div>
        <div className="dm-chat-actions">
          <button className="dm-icon-btn"><Phone size={16} /></button>
          <button className="dm-icon-btn"><Video size={16} /></button>
          <button className="dm-icon-btn"><Info size={16} /></button>
        </div>
      </div>

      <div className="dm-messages">
        {(AllMessage?.messages || []).map((m, i) => (
          <div key={i} className={`dm-msg-row ${m.from}`}>
            <div className={`dm-bubble ${m.from}`}>
              <p>{m.text}</p>
              <p className="dm-bubble-time">{m.time}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

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

export default function DirectMessages() {
  const {data} = useConverQuery();
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");
  console.log("raw data:", data);

    const conversationList= (data?.data || []).map((c) => {
    const other = c.participants?.[0];
    return {
      id: c._id,
      name: other?.name || "Unknown",
      avatar: other?.images?.avatar?.url || null,
      initials: other?.name?.[0] || "?",
      time: c.updatedAt,
      unread: c.unreadCount || 0,
      online: false, 
      preview: c.lastMessage?.text || "",
      messages: [],
    };
 
  })

  const selected = conversationList.find((c) => c.id === selectedId) || null;

  const filtered = conversationList.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  const handleSend = (id, text) => {
    // setConversations((prev) =>
    //   prev.map((c) =>
    //     c.id === id
    //       ? {
    //           ...c,
    //           preview: text,
    //           messages: [...c.messages, { from: "me", text, time: "Now" }],
    //         }
    //       : c
    //   )
    // );
  };

  return (
    <div className="dm-app">
      <div className="dm-sidebar">
        <div className="dm-sidebar-header">
          <h1 className="dm-title">Direct messages</h1>
          <span className="dm-count-badge">{conversationList.length} total</span>
        </div>

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

        <div className="dm-list">
          {filtered.map((c) => (
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
                  <p className={`dm-item-name ${c.unread ? "unread" : ""}`}>{c.name}</p>
                  <span className="dm-item-time">{c.time}</span>
                </div>
                <p className={`dm-item-preview ${c.unread ? "unread" : ""}`}>{c.preview}</p>
              </div>
              {c.unread > 0 && <span className="dm-unread-badge">{c.unread}</span>}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="dm-list-empty">No conversations found.</p>
          )}
        </div>
      </div>

      {selected ? (
        <ChatView conv={selected} onSend={handleSend} />
      ) : (
        <EmptyState conversations={conversationList} onSelect={handleSelect} />
      )}
    </div>
  );
}