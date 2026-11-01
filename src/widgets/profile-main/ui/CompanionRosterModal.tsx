"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Users, X } from "lucide-react";
import type { Friend } from "@entities/friend";
import CompanionRoster from "./CompanionRoster";

/** Navbar tile that opens the companion roster in a modal. */
export default function CompanionRosterModal({ friends }: { friends: Friend[] }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  if (friends.length === 0) return null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={"nav-widget-btn" + (open ? " is-active" : "")}
        aria-label="Companions"
        aria-haspopup="dialog"
        aria-expanded={open}
        title="Companions"
        onClick={() => setOpen(true)}
      >
        <Users />
        <span className="nav-widget-btn-label">Roster</span>
      </button>

      {open &&
        createPortal(
          <div
            className="roster-modal-overlay"
            onPointerDown={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <div className="roster-modal" role="dialog" aria-modal="true" aria-label="Companions">
              <div className="roster-modal-header">
                <span className="roster-modal-title">Companions</span>
                <button
                  ref={closeRef}
                  type="button"
                  className="roster-modal-close"
                  aria-label="Close"
                  onClick={close}
                >
                  <X size={16} />
                </button>
              </div>
              <CompanionRoster friends={friends} />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
