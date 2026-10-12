"use client";

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
import {
  useAllMessageQuery,
  useSendmessageMutation,
} from "@/app/features/messageApi";

import { socket } from "@/app/services/socket";
import { useGetMeQuery } from "@/app/features/AuthApi";


// ===============================
// AVATAR
// ===============================

function Avatar({ conv, size = 44 }) {
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

function EmptyState({ conversations, onSelect }) {
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

      <h2 className="dm-empty-title">
        Select a conversation
      </h2>

      <p className="dm-empty-sub">
        Choose one of your existing direct messages or start
        a new conversation to begin chatting.
      </p>

      <div className="dm-cards">
        {infoCards.map(({ icon: Icon, title, sub }) => (
          <div key={title} className="dm-card">
            <Icon className="dm-card-icon" />

            <p className="dm-card-title">
              {title}
            </p>

            <p className="dm-card-sub">
              {sub}
            </p>
          </div>
        ))}
      </div>

      <p className="dm-recent-label">
        RECENT DMS
      </p>

      <div className="dm-recent-row">
        {conversations.slice(0, 3).map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className="dm-recent-item"
          >
            <Avatar conv={c} size={52} />

            <span>
              {c.name.split(" ")[0]}
            </span>
          </button>
        ))}

        <button className="dm-recent-item">
          <div className="dm-more-circle">
            <MoreHorizontal size={20} />
          </div>

          <span>
            More
          </span>
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
}) {
  const [draft, setDraft] = useState("");

  const [messages, setMessages] = useState([]);

  const bottomRef = useRef(null);


  // ===============================
  // GET ALL MESSAGES
  // ===============================

  const {
    data: AllMessage,
  } = useAllMessageQuery(conv?.id, {
    skip: !conv?.id,
  });


  // ===============================
  // SET API MESSAGES
  // ===============================

  useEffect(() => {
    if (AllMessage?.messages) {
      setMessages(AllMessage.messages);
    }
  }, [AllMessage]);


  // ===============================
  // SOCKET RECEIVE MESSAGE
  // ===============================

  useEffect(() => {
    const handleReceiveMessage = (message) => {
      console.log(
        "Received socket message:",
        message
      );

      if (
        String(message.conversation) ===
        String(conv.id)
      ) {
        setMessages((prev) => [
          ...prev,
          message,
        ]);
      }
    };

    socket.on(
      "receive-message",
      handleReceiveMessage
    );

    return () => {
      socket.off(
        "receive-message",
        handleReceiveMessage
      );
    };
  }, [conv.id]);


  // ===============================
  // AUTO SCROLL
  // ===============================

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);


  // ===============================
  // SEND MESSAGE
  // ===============================

  const submit = async (e) => {
    e.preventDefault();

    if (!draft.trim()) {
      return;
    }

    const sentMessage = await onSend(
      conv.id,
      draft.trim()
    );

    if (sentMessage) {
      setMessages((prev) => [
        ...prev,
        sentMessage,
      ]);

      setDraft("");
    }
  };


  // ===============================
  // RENDER
  // ===============================

  return (
    <div className="dm-chat">

      {/* HEADER */}

      <div className="dm-chat-header">

        <div className="dm-chat-header-info">

          <Avatar
            conv={conv}
            size={40}
          />

          <div>
            <p className="dm-chat-name">
              {conv.name}
            </p>

            <p className="dm-chat-status">
              {conv.online
                ? "Active now"
                : "Offline"}
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

       {messages.map((m, i) => {

  const getId = (value: any) => {
    if (!value) return null;

    if (typeof value === "object") {
      return String(
        value._id ||
        value.id ||
        value.userId ||
        ""
      );
    }

    return String(value);
  };

  const senderId = getId(
    m.sender ||
    m.senderId ||
    m.from
  );

  const userId = getId(currentUserId);

  const isSent =
    !!senderId &&
    !!userId &&
    senderId === userId;

  return (
    <div
      key={m._id || i}
      className={`dm-msg-row ${
        isSent
          ? "sent"
          : "received"
      }`}
    >

      <div
        className={`dm-bubble ${
          isSent
            ? "sent"
            : "received"
        }`}
      >

        <p>
          {m.text}
        </p>

        <p className="dm-bubble-time">
          {m.time || ""}
        </p>

      </div>

    </div>
  );
})}

        <div ref={bottomRef} />

      </div>


      {/* COMPOSER */}

      <form
        onSubmit={submit}
        className="dm-composer"
      >

        <input
          value={draft}
          onChange={(e) =>
            setDraft(e.target.value)
          }
          placeholder="Type a message..."
          className="dm-composer-input"
        />

        <button
          type="submit"
          className="dm-send-btn"
          disabled={!draft.trim()}
        >
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

  // ===============================
  // CONVERSATIONS
  // ===============================

  const { data } = useConverQuery();


  // ===============================
  // SELECTED CONVERSATION
  // ===============================

  const [selectedId, setSelectedId] =
    useState(null);


  // ===============================
  // SEARCH
  // ===============================

  const [query, setQuery] =
    useState("");


  // ===============================
  // SEND MESSAGE API
  // ===============================

  const [
    sendMessage,
    { isLoading },
  ] = useSendmessageMutation();


  // ===============================
  // CURRENT USER
  // ===============================

  const { data: mdata } =
    useGetMeQuery();

  const user =
    mdata?.data;


  // ===============================
  // ONLINE USERS
  // ===============================

  const [onlineUsers, setOnlineUsers] =
    useState<string[]>([]);


  // ===============================
  // SOCKET ONLINE USERS
  // ===============================

 useEffect(() => {
  if (!user?._id) return;

  const handleOnlineUsers = (
    users: string[]
  ) => {
    console.log("ONLINE USERS:", users);

    setOnlineUsers(
      users.map(String)
    );
  };

  // Pehle listener
  socket.on(
    "online-users",
    handleOnlineUsers
  );

  // Uske baad setup
  if (socket.connected) {
    socket.emit(
      "setup",
      String(user._id)
    );
  } else {
    socket.once("connect", () => {
      socket.emit(
        "setup",
        String(user._id)
      );
    });
  }

  return () => {
    socket.off(
      "online-users",
      handleOnlineUsers
    );

    socket.off("connect");
  };
}, [user?._id]);

  // ===============================
  // CONVERSATION LIST
  // ===============================

  const conversationList =
    (data?.data || []).map((c) => {

      const other =
        c.participants?.find(
          (participant) =>
            String(participant._id) !==
            String(user?._id)
        );


      function formatTime(
        dateString: string
      ) {

        if (!dateString) return "";

        const date =
          new Date(dateString);

        return date.toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        );
      }


      return {

        id: c._id,

        name:
          other?.name ||
          "Unknown",

        receiverId:
          other?._id,

        avatar:
          other?.images?.avatar?.url ||
          null,

        initials:
          other?.name?.[0] ||
          "?",

        time:
          formatTime(
            c.updatedAt
          ),

        unread:
          c.unreadCount ||
          0,

        online:
          onlineUsers.includes(
            String(other?._id)
          ),

        preview:
          c.lastMessage?.text ||
          "",

        messages: [],

      };

    });


  // ===============================
  // SELECTED
  // ===============================

  const selected =
    conversationList.find(
      (c) =>
        c.id === selectedId
    ) || null;


  // ===============================
  // FILTER
  // ===============================

  const filtered =
    conversationList.filter(
      (c) =>
        c.name
          .toLowerCase()
          .includes(
            query.toLowerCase()
          )
    );


  // ===============================
  // SELECT CONVERSATION
  // ===============================

  const handleSelect = (
    id
  ) => {

    setSelectedId(id);

  };


  // ===============================
  // SEND MESSAGE
  // ===============================

  const handleSend =
    async (
      id,
      text
    ) => {

      try {

        const conversation =
          conversationList.find(
            (c) =>
              c.id === id
          );


        if (!conversation) {

          console.log(
            "Conversation not found"
          );

          return null;

        }


        if (
          !conversation.receiverId
        ) {

          console.log(
            "Receiver ID not found"
          );

          return null;

        }


        const response =
          await sendMessage({

            receiverId:
              conversation.receiverId,

            text:
              text.trim(),

          }).unwrap();


        console.log(
          "Message sent:",
          response
        );


        return response.message;

      } catch (error) {

        console.log(
          "Send message error:",
          error
        );

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

          <h1 className="dm-title">
            Direct messages
          </h1>

          <span className="dm-count-badge">
            {conversationList.length} total
          </span>

        </div>


        {/* SEARCH */}

        <div className="dm-search-wrap">

          <div className="dm-search-box">

            <Search
              className="dm-search-icon"
            />

            <input
              value={query}
              onChange={(e) =>
                setQuery(
                  e.target.value
                )
              }
              placeholder="Search conversations..."
              className="dm-search-input"
            />

          </div>

        </div>


        {/* CONVERSATION LIST */}

        <div className="dm-list">

          {filtered.map((c) => (

            <button
              key={c.id}
              onClick={() =>
                handleSelect(c.id)
              }
              className={`dm-item ${
                selectedId === c.id
                  ? "active"
                  : ""
              }`}
            >

              <div className="dm-item-avatar-wrap">

                <Avatar
                  conv={c}
                  size={44}
                />

                {c.online && (
                  <span className="dm-online-dot" />
                )}

              </div>


              <div className="dm-item-body">

                <div className="dm-item-row">

                  <p
                    className={`dm-item-name ${
                      c.unread
                        ? "unread"
                        : ""
                    }`}
                  >
                    {c.name}
                  </p>

                  <span className="dm-item-time">
                    {c.time}
                  </span>

                </div>


                <p
                  className={`dm-item-preview ${
                    c.unread
                      ? "unread"
                      : ""
                  }`}
                >
                  {c.preview}
                </p>

              </div>


              {c.unread > 0 && (
                <span className="dm-unread-badge">
                  {c.unread}
                </span>
              )}

            </button>

          ))}


          {filtered.length === 0 && (

            <p className="dm-list-empty">
              No conversations found.
            </p>

          )}

        </div>

      </div>


      {/* CHAT */}

      {selected ? (

        <ChatView
          conv={selected}
          onSend={handleSend}
          currentUserId={
            user?._id ||
            user?.id
          }
        />

      ) : (

        <EmptyState
          conversations={
            conversationList
          }
          onSelect={
            handleSelect
          }
        />

      )}

    </div>
  );
}