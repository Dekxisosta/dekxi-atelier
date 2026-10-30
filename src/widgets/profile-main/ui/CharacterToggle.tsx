"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, User, X } from "lucide-react";
import { useLockBodyScroll } from "@shared/hooks";
import type { CharacterEntry } from "./characters";

type CharacterToggleProps = {
  franchise: string;
  characters: readonly CharacterEntry[];
  activeId: string;
  onSelect: (id: string) => void;
};

/**
 * Person-icon button (bottom-right of the stage, over the dialogue box) that opens a
 * modal of the current theme's characters, headed by the franchise they are from.
 */
export default function CharacterToggle({ franchise, characters, activeId, onSelect }: CharacterToggleProps) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => {
    setOpen(false);
    openerRef.current?.focus();
  };

  const choose = (id: string) => {
    if (id !== activeId) onSelect(id);
    close();
  };

  return (
    <>
      <button
        ref={openerRef}
        type="button"
        className="character-toggle"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Choose character"
        title="Choose character"
      >
        <User size={16} />
      </button>

      {open &&
        createPortal(
          <div className="character-modal-backdrop" onClick={close}>
            <div
              className="character-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="character-modal-title"
              onClick={(e) => e.stopPropagation()}
            >
              <header className="character-modal-header">
                <div className="character-modal-heading">
                  <h2 id="character-modal-title" className="character-modal-title">{franchise}</h2>
                  <span className="character-modal-sub">Characters</span>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  className="character-modal-close"
                  onClick={close}
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </header>

              <ul className="character-modal-list">
                {characters.map((c) => {
                  const active = c.id === activeId;
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        className={"character-card" + (active ? " is-active" : "")}
                        onClick={() => choose(c.id)}
                        aria-pressed={active}
                      >
                        <span className="character-card-name">{c.name}</span>
                        {active && <Check size={14} className="character-card-check" aria-hidden="true" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
