"use client";

import { useState, useRef, useEffect } from "react";
import "./profile.css";
import {
  Camera,
  MapPin,
  Mail,
  Link2,
  Calendar,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { useGetMeQuery, useUpdateProfileMutation } from "@/app/features/AuthApi";
import { toast } from "sonner";
import ButtonLoader from "../button/button";

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);

  // Preview URLs (what's shown on screen)
  const [avatar, setAvatar] = useState(null);
  const [cover, setCover] = useState(null);

  // Actual File objects to upload (this was missing before)
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const { data } = useGetMeQuery();
  const [updateProfile , {isLoading}] = useUpdateProfileMutation();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    bio: "",
    location: "",
    website: "",
    avatar: "",
    cover: "",
    joined: "",
  });

  const [draft, setDraft] = useState(profile);

  useEffect(() => {
    if (data?.data) {
      const user = data.data;

     const profileData = {
  name: user.name,
  email: user.email,

  role: user.profile?.role || "",
  bio: user.profile?.bio || "",
  location: user.profile?.location || "",
  website: user.profile?.website || "",

  avatar: user.images?.avatar?.url || "",
  cover: user.images?.cover?.url || "",

  joined: user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "",
};

      setProfile(profileData);
      setDraft(profileData);

      
      setAvatar(user.images?.avatar?.url || null);
      setCover(user.images?.cover?.url || null);
    }
  }, [data]);

  const saveEditing = async () => {
    const formData = new FormData();

    formData.append("name", draft.name);
    formData.append("bio", draft.bio);
    formData.append("role", draft.role);
    formData.append("website", draft.website);
    formData.append("location", draft.location);

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    if (coverFile) {
      formData.append("cover", coverFile);
    }

    try {
      await updateProfile(formData).unwrap();
      setProfile(draft);
      setEditing(false);
      toast.success("Profile Succesfull Updated")
    } catch (error) {
      console.log(error)
     toast.error("Failed to update profile");
    }
  };

  function handleImageChange(e, setPreview, setFile) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFile(file);
  }

  function startEditing() {
    setDraft(profile);
    setEditing(true);
  }

  function cancelEditing() {
    setDraft(profile);
    
    setAvatar(profile.avatar || null);
    setCover(profile.cover || null);
    setAvatarFile(null);
    setCoverFile(null);
    setEditing(false);
  }

  const stats = [
    { label: "Projects", value: "24" },
    { label: "Threads", value: "312" },
    { label: "Teammates", value: "48" },
  ];

  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* Cover */}
        <div
          className="profile-cover"
          style={
            cover
              ? {
                  backgroundImage: `url(${cover})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        >
          <button
            className="profile-cover__edit"
            onClick={() => coverInputRef.current?.click()}
            aria-label="Change cover image"
          >
            <Camera size={15} strokeWidth={1.8} />
            Change cover
          </button>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleImageChange(e, setCover, setCoverFile)}
          />
        </div>

        {/* Header row: avatar + name + edit button */}
        <div className="profile-header">
          <div className="profile-avatar-wrap">
            <div
              className="profile-avatar-lg"
              style={
                avatar
                  ? {
                      backgroundImage: `url(${avatar})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            >
              {!avatar && getInitials(profile.name)}
            </div>
            <button
              className="profile-avatar-edit"
              onClick={() => avatarInputRef.current?.click()}
              aria-label="Change profile photo"
            >
              <Camera size={13} strokeWidth={2} />
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleImageChange(e, setAvatar, setAvatarFile)}
            />
          </div>

          <div className="profile-header-actions">
            {!editing ? (
              <button
                className="profile-btn profile-btn--outline"
                onClick={startEditing}
              >
                <Pencil size={14} strokeWidth={1.8} />
                Edit profile
              </button>
            ) : (
              <div className="profile-edit-actions">
                <button
                  className="profile-btn profile-btn--ghost"
                  onClick={cancelEditing}
                >
                  <X size={14} strokeWidth={1.8} />
                  Cancel
                </button>

                <button
                  className="profile-btn profile-btn--solid"
                  disabled={isLoading}
                  onClick={saveEditing}
                >{isLoading ? (
                  <>
                  <ButtonLoader />
                 
                  </>
                ) : (
                  "save"
                )}

                </button>
              </div>
            )}
          </div>
        </div>

        <div className="profile-body">
          {!editing ? (
            <>
              <h1 className="profile-name">{profile.name}</h1>
              <p className="profile-role">{profile.role}</p>
              <p className="profile-bio">{profile.bio}</p>
            </>
          ) : (
            <div className="profile-edit-fields">
              <label className="profile-field">
                <span>Name</span>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder=" your name"
                />
              </label>
              <label className="profile-field">
                <span>Role</span>
                <input
                  value={draft.role}
                  onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                  placeholde="enter role"
                />
              </label>
              <label className="profile-field">
                <span>Bio</span>
                <textarea
                  rows={3}
                  maxLength={220}
                  value={draft.bio}
                  onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                  placeholder="your bio"
                />
                <span className="profile-field__hint">
                  {draft.bio?.length || 0}/220
                </span>
              </label>
            </div>
          )}

          {!editing ? (
            <div className="profile-meta">
              <span className="profile-meta__item">
                <MapPin size={14} strokeWidth={1.8} />
                {profile.location}
              </span>
              <span className="profile-meta__item">
                <Mail size={14} strokeWidth={1.8} />
                {profile.email}
              </span>
              <span className="profile-meta__item">
                <Link2 size={14} strokeWidth={1.8} />
                {profile.website}
              </span>
              <span className="profile-meta__item">
                <Calendar size={14} strokeWidth={1.8} />
                {profile.joined}
              </span>
            </div>
          ) : (
            <div className="profile-edit-fields profile-edit-fields--grid">
              <label className="profile-field">
                <span>Location</span>
                <input
                  value={draft.location}
                  onChange={(e) =>
                    setDraft({ ...draft, location: e.target.value })
                  }
                  placeholder="your location"
                />
              </label>
              <label className="profile-field">
                <span>Email</span>
                <input
                  value={draft.email}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                />
              </label>
              <label className="profile-field">
                <span>Website</span>
                <input
                  value={draft.website}
                  onChange={(e) =>
                    setDraft({ ...draft, website: e.target.value })
                  }
                />
              </label>
            </div>
          )}

          {/* Stats */}
          <div className="profile-stats">
            {stats.map((s) => (
              <div key={s.label} className="profile-stat">
                <div className="profile-stat__value">{s.value}</div>
                <div className="profile-stat__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getInitials(name) {
  if (!name) return "";
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}