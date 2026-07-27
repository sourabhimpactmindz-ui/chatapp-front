"use client";

import { useState } from "react";
import "./newmessagemodel.css";
import { useCreateConverMutation } from "@/app/features/messageApi";
import { toast } from "sonner";

const suggestions = [
  { key: "sarah", name: "Sarah Chen", emoji: "🦉", bg: "#e0f2fe" },
  { key: "marcus", name: "Marcus Vogt", emoji: "🐧", bg: "#ede9fe" },
  { key: "alara", name: "Alara Ines", emoji: "🐨", bg: "#1e293b" },
];


export default function NewMessageModal({ open = true, onClose = () => {} }) {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [createConver] = useCreateConverMutation()

  const handleSubmit = async () => {
  try {
    const res = await createConver({ chatId: recipient, text: message }).unwrap();

    if (res?.status) {
      toast.success("Message sent successfully");
      setRecipient("");
      setMessage("");
      onClose();
    } else {
      toast.error(res?.message || "Something went wrong");
    }
  } catch (err) {
    toast.error(err?.data?.message || err?.message || "Something went wrong");
  }
};
  if (!open) return null;

  const canSend = recipient.trim().length > 0 && message.trim().length > 0;

  return (
    <div className="nm-overlay" onClick={onClose}>
      <div
        className="nm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="nm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="nm-title" className="nm-title">
          New Message
        </h2>
        <p className="nm-subtitle">
          Securely initiate a direct conversation within your workspace.
        </p>

        <label className="nm-label" htmlFor="nm-recipient">
          Recipient ID
        </label>
        <div className="nm-input-wrap">
          <span className="nm-input-icon">@</span>
          <input
            id="nm-recipient"
            type="text"
            className="nm-input"
            placeholder="Enter Chat ID (e.g. @username or 0x4f2...)"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>

        <div className="nm-suggestions">
          {suggestions.map((s) => (
            <button
              type="button"
              key={s.key}
              className="nm-chip"
              onClick={() => setRecipient(s.name)}
            >
              <span className="nm-chip-avatar" style={{ background: s.bg }}>
                {s.emoji}
              </span>
              {s.name}
            </button>
          ))}
        </div>

        <div className="nm-message-head">
          <label className="nm-label" htmlFor="nm-message">
            Message
          </label>
          <span className="nm-hint">Shift + Enter for new line</span>
        </div>

        <textarea
          id="nm-message"
          className="nm-textarea"
          placeholder="Type your message here... markdown is supported."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* <div className="nm-toolbar">
          <div className="nm-toolbar-tools">
            <button type="button" className="nm-tool-btn" aria-label="Bold">
              <ToolbarIcon name="bold" />
            </button>
            <button type="button" className="nm-tool-btn" aria-label="Italic">
              <ToolbarIcon name="italic" />
            </button>
            <button type="button" className="nm-tool-btn" aria-label="Insert link">
              <ToolbarIcon name="link" />
            </button>
            <span className="nm-tool-divider" />
            <button type="button" className="nm-tool-btn" aria-label="Attach file">
              <ToolbarIcon name="attach" />
            </button>
            <button type="button" className="nm-tool-btn" aria-label="Insert emoji">
              <ToolbarIcon name="emoji" />
            </button>
          </div>
          <button type="button" className="nm-drafts">
            Drafts
          </button>
        </div> */}

        <div className="nm-actions">
          <button
            type="button"
            className="nm-send-btn"
            disabled={!canSend}
            onClick={handleSubmit}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12 20 4l-5.5 16-3.2-6.3L4 12Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
            </svg>
            Send Message
          </button>
          <button type="button" className="nm-cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}