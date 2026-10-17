"use client";

import Link from "next/link";
import "./navbar.css";
import {
  User,
  Settings,
  CreditCard,
  LogOut,
  Moon,
  HelpCircle,
  ChevronDown,
  Bell
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useGetMeQuery, useLogoutMutation } from "@/app/features/AuthApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";



const navLinks = [
  { label: "Status", href: "#" },
  { label: "Threads", href: "#" },
  { label: "Activity", href: "#" },
];

const menuItems = [
  { icon: User, href : "/profile",label: "View profile" },
  { icon: Settings, label: "Account settings" },
  { icon: CreditCard, label: "Billing" },
  { icon: HelpCircle, label: "Help & support" },
];

export default function TopNav() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [Logout] = useLogoutMutation()
  const router = useRouter()
  const rootRef = useRef(null);
    const {data} = useGetMeQuery()
    const [user , setUser] = useState({
      name : "",
      chatId : "",
      initials : "",
      images : {
        avatar : {
          url : "",
        }
      }
    })

    const handleLogout = async() => {
      const res = await Logout().unwrap()
      if(res?.status){
        toast.success("Logout")
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        router.push("/login")
      }else{
        toast.error(err?.data?.message || err.message || "Something went wrong")
      }

    }


  useEffect(() => {
    function onClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);


  useEffect(() => {
    if(dark){
    document.documentElement.classList.add("dark")

    }else{
      document.documentElement.classList.remove("dark")
    }
  },[dark])


useEffect(() => {
  if (data?.data) {
    setUser({
      name: data.data.name,
      chatId: data.data.chatId,
      images: data.data.images, 
    });
  }
}, [data]);

 
  return (
    <header className="top-nav">
      <Link href="/messages" className="top-nav__brand">
        <span className="top-nav__logo">CW</span>
        <span className="top-nav__title">Chat Wave</span>
      </Link>

      <nav className="top-nav__links">
        {navLinks.map((link) => (
          <Link key={link.label} href={link.href} className="top-nav__link">
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="top-nav__actions">
        <button className="top-nav__icon-btn" aria-label="Notifications">
          <Bell size={18} strokeWidth={1.6} />
        </button>


        <button className="top-nav__upgrade">Upgrade</button>

        <span className="top-nav__divider" aria-hidden="true" />

        <div ref={rootRef} className="profile-dropdown-root">
          <button
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={open}
            className={`profile-trigger${open ? " is-open" : ""}`}
          >
          <div className="profile-avatar">
  {user?.images?.avatar?.url ? (
    <img
      src={user.images.avatar.url}
      alt={user.name}
      className="profile-avatar-img"
    />
  ) : (
    user?.name
      ?.split(" ")
      .map((w: string) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  )}
</div>
            <div className="profile-trigger-text">
              <span className="profile-trigger-name">{user.name}</span>
              <span className="profile-trigger-role">{user.chatId}</span>
            </div>
            <ChevronDown
              size={15}
              className={`profile-chevron${open ? " is-open" : ""}`}
            />
          </button>

          {open && (
            <div role="menu" className="profile-menu">
              <div className="profile-menu-header">
               <div className="profile-avatar">
  {user?.images?.avatar?.url ? (
    <img
      src={user.images.avatar.url}
      alt={user.name}
      className="profile-avatar-img"
    />
  ) : (
    user?.name
      ?.split(" ")
      .map((w: string) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  )}
</div>
                <div className="profile-menu-header-text">
                  <div className="profile-menu-name">{user.name}</div>
                  <div className="profile-menu-email">{user.chatId}</div>
                </div>
              </div>

              <div className="profile-menu-section">
                {menuItems.map(({ icon: Icon, label , href}) => (
                  <button
                    key={label}
                    role="menuitem"
                      onClick={() => {
      setOpen(false);

      if (href) {
        router.push(href);
      }
    }}
                    className="profile-menu-item"
                  >
                    <Icon size={16} strokeWidth={1.8} />
                    {label}
                  </button>
                ))}

                <button
                  onClick={() => setDark((d) => !d)}
                  className="profile-menu-toggle-row"
                >
                  <span className="profile-menu-toggle-label">
                    <Moon size={16} strokeWidth={1.8} />
                    Dark mode
                  </span>
                  <span className={`profile-switch${dark ? " is-on" : ""}`}>
                    <span className="profile-switch-thumb" />
                  </span>
                </button>
              </div>

              <div className="profile-menu-divider" />

              <div className="profile-menu-section">
                <button
                  role="menuitem"
                  onClick={handleLogout}
                  className="profile-menu-item profile-menu-item--danger"
                >
                  <LogOut size={16} strokeWidth={1.8} />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}