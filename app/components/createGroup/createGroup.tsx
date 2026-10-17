"use client";

import { useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { X, Search, Camera, Pencil, Check } from "lucide-react";
import {
  useConverQuery,
  useGroupConverMutation,
} from "@/app/features/conversationApi";
import { useGetMeQuery } from "@/app/features/AuthApi";
import './createGroup.css'

type Candidate = {
  receiverId: string;
  name: string;
  sub: string;
  avatar: string | null;
};

export function CreateGroupModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [createGroup, { isLoading }] = useGroupConverMutation();
  const { data } = useConverQuery(undefined);
  const { data: mdata } = useGetMeQuery(undefined);
  const myId = mdata?.data?._id || mdata?.data?.id;

  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const candidates = useMemo(() => {
    const map = new Map<string, Candidate>();
    (data?.data || [])
      .filter((c: any) => !c.isGroup)
      .forEach((c: any) => {
        const other = c.participants?.find(
          (p: any) => String(p._id) !== String(myId)
        );
        if (other?._id) {
          map.set(String(other._id), {
            receiverId: String(other._id),
            name: other.name || "Unknown",
            sub: other.email || other.chatId || "",
            avatar: other.images?.avatar?.url || null,
          });
        }
      });
    return Array.from(map.values());
  }, [data, myId]);

  if (!open) return null;

  const filtered = candidates.filter((c) =>
    `${c.name} ${c.sub}`.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: string) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );

  const reset = () => {
    setName("");
    setSearch("");
    setSelected([]);
    setAvatarFile(null);
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const canSubmit = !!name.trim() && selected.length > 0 && !isLoading;

  const submit = async () => {
    if (!canSubmit) return;
    try {
      // avatarFile abhi backend ko nahi bhej rahe (backend support add hone par bhejna)
      await createGroup({
        groupName: name.trim(),
        memberIds: selected,
      }).unwrap();
      handleClose();
    } catch (err) {
      console.log("Create group error:", err);
    }
  };

  return createPortal(
    <div className="cg-overlay" onClick={handleClose}>
      <div className="cg-modal" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="cg-header">
          <div>
            <h3 className="cg-title">Create New Group</h3>
            <p className="cg-subtitle">
              Bring your teammates together for focused collaboration.
            </p>
          </div>
          <button className="cg-close" onClick={handleClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* AVATAR UPLOAD */}
        <div className="cg-upload-wrap">
          <button
            type="button"
            className="cg-upload"
            onClick={() => fileRef.current?.click()}
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Group" className="cg-upload-img" />
            ) : (
              <>
                <Camera size={22} />
                <span>UPLOAD</span>
              </>
            )}
            <span className="cg-upload-edit">
              <Pencil size={11} />
            </span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg"
            hidden
            onChange={onPickFile}
          />
          <p className="cg-hint">Recommended: 512×512px (JPG, PNG)</p>
        </div>

        {/* GROUP NAME */}
        <label className="cg-label">Group Name</label>
        <input
          className="cg-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Marketing Squad"
        />

        {/* MEMBERS */}
        <label className="cg-label">Add Members</label>
        <div className="cg-search">
          <Search size={16} className="cg-search-icon" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
          />
        </div>

        <div className="cg-list">
          {filtered.map((c) => {
            const checked = selected.includes(c.receiverId);
            return (
              <button
                type="button"
                key={c.receiverId}
                className="cg-member"
                onClick={() => toggle(c.receiverId)}
              >
                {c.avatar ? (
                  <img src={c.avatar} alt={c.name} className="cg-member-avatar" />
                ) : (
                  <div className="cg-member-avatar cg-member-fallback">
                    {c.name[0]?.toUpperCase()}
                  </div>
                )}

                <div className="cg-member-info">
                  <p className="cg-member-name">{c.name}</p>
                  {c.sub && <p className="cg-member-sub">{c.sub}</p>}
                </div>

                <span className={`cg-check ${checked ? "checked" : ""}`}>
                  {checked && <Check size={12} strokeWidth={3} />}
                </span>
              </button>
            );
          })}

          {filtered.length === 0 && (
            <p className="cg-empty">
              {candidates.length === 0
                ? "Start a chat with someone first."
                : "No members found."}
            </p>
          )}
        </div>

        {/* FOOTER */}
        <div className="cg-footer">
          <button type="button" className="cg-cancel" onClick={handleClose}>
            Cancel
          </button>
          <button
            type="button"
            className="cg-create"
            onClick={submit}
            disabled={!canSubmit}
          >
            {isLoading ? "Creating..." : "Create Group"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}