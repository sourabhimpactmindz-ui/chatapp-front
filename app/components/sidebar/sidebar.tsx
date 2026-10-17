"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./sidebar.css";
import NewMessageModal from "../newmessagemodel/newmessagemodel";
import ButtonLoader from "../button/button";
import { CreateGroupModal } from "../createGroup/createGroup";

const navItems = [
  { key: "home", label: "Home", href: "/messages", icon: "home" },
  { key: "dm", label: "Direct Messages", href: "/directmessage", icon: "chat" },
  { key: "groups", label: "Groups", href: "#", icon: "groups" },
  { key: "files", label: "Files", href: "/messages", icon: "files" },
  { key: "settings", label: "Settings", href: "/messages", icon: "settings" },
];

function Icon({ name }: { name: string }) {
  switch (name) {
    case "home":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M3 11.5L12 4l9 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "chat":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M4 5.5h16a1 1 0 0 1 1 1V16a1 1 0 0 1-1 1H9l-4.5 3.5V17H4a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    case "groups":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="8.5" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="16.5" cy="9.5" r="2.1" stroke="currentColor" strokeWidth="1.8" />
          <path d="M3.5 18.5c.6-2.7 2.6-4.3 5-4.3s4.4 1.6 5 4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M14.2 14.6c2 .1 3.6 1.5 4.1 3.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "files":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M4 7.5a1.5 1.5 0 0 1 1.5-1.5h4l1.6 2h7.4a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-10Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    case "settings":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 3.5v2M12 18.5v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M3.5 12h2M18.5 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading] = useState(false);
  const [showModel, setShow] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("sidebar-open", isOpen);
    return () => document.body.classList.remove("sidebar-open");
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        className="app-sidebar__toggle"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      <div
        className={`app-sidebar-backdrop${isOpen ? " is-visible" : ""}`}
        onClick={() => setIsOpen(false)}
      />

      <aside className={`app-sidebar${isOpen ? " is-open" : ""}`}>
        <button
          className="app-sidebar__new-message"
          onClick={() => setShow(true)}
          disabled={isLoading}
        >
          {isLoading ? <ButtonLoader /> : "New Message"}
          <span className="app-sidebar__plus">+</span>
        </button>

        <nav className="app-sidebar__nav">
          {navItems.map((item) => {
            const active = item.key === "dm" && pathname.startsWith("/directmessage");

            if (item.key === "groups") {
              return (
                <button
                  key={item.key}
                  type="button"
                  className="app-sidebar__nav-item app-sidebar__nav-btn"
                  onClick={() => setShowGroupModal(true)}
                >
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.key}
                href={item.href}
                className={`app-sidebar__nav-item${active ? " is-active" : ""}`}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="app-sidebar__footer">
          <Link href="/messages" className="app-sidebar__nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
              <path d="M12 16v-.5M12 8a2.2 2.2 0 1 1 1.4 3.9c-.6.4-1.4 1-1.4 2.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span>Help</span>
          </Link>
        </div>
      </aside>

      {showModel && (
        <NewMessageModal open={showModel} onClose={() => setShow(false)} />
      )}

      <CreateGroupModal
        open={showGroupModal}
        onClose={() => setShowGroupModal(false)}
      />
    </>
  );
}