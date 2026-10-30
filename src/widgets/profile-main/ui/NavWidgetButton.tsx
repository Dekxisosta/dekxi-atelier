"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type NavWidgetButtonProps = {
  label: string;
  children: ReactNode;
  /** Icon-only small button (default), a labelled block button with a sub line, or a small text button. */
  variant?: "icon" | "block" | "text";
  icon?: ReactNode;
  sub?: string;
  /** Popover title; defaults to `label`. */
  heading?: string;
  /** Popover width in px (clamped to the viewport). */
  width?: number;
  className?: string;
};

type Placement = {
  left: number;
  top: number;
  width: number;
  maxHeight: number;
  above: boolean;
};

const POPOVER_WIDTH = 288;
const GAP = 8;
const MARGIN = 8;
const MIN_COMFORTABLE_HEIGHT = 240;

/**
 * Small navbar button that opens a compact popover. The popover is portaled to
 * <body> and absolutely positioned in document coordinates next to the button,
 * so it escapes any overflow / stacking context of the nav column.
 */
export default function NavWidgetButton({
  label,
  children,
  variant = "icon",
  icon,
  sub,
  heading,
  width: popoverWidth = POPOVER_WIDTH,
  className,
}: NavWidgetButtonProps) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<Placement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const place = useCallback(() => {
    const btn = buttonRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;

    const width = Math.min(popoverWidth, vw - MARGIN * 2);
    const left = Math.min(Math.max(r.left, MARGIN), vw - width - MARGIN) + window.scrollX;

    const spaceBelow = vh - r.bottom - GAP - MARGIN;
    const spaceAbove = r.top - GAP - MARGIN;
    const above = spaceBelow < MIN_COMFORTABLE_HEIGHT && spaceAbove > spaceBelow;

    setPlacement({
      left,
      width,
      above,
      top: (above ? r.top - GAP : r.bottom + GAP) + window.scrollY,
      maxHeight: Math.max(160, above ? spaceAbove : spaceBelow),
    });
  }, [popoverWidth]);

  const toggle = () => {
    if (!open) place();
    setOpen((o) => !o);
  };

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (popoverRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", place);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", place);
    };
  }, [open, close, place]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={
          (variant === "block"
            ? "javelin-btn javelin-btn--minor arsenal-btn"
            : variant === "text"
              ? "nav-util-btn nav-fav-btn"
              : "nav-widget-btn") +
          (open ? " is-active" : "") +
          (className ? ` ${className}` : "")
        }
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        title={label}
        onClick={toggle}
      >
        {variant === "block" ? (
          <>
            <span className="javelin-btn-label">{label}</span>
            {sub && <span className="javelin-btn-sub">{sub}</span>}
          </>
        ) : variant === "text" ? (
          label
        ) : (
          icon
        )}
      </button>

      {open &&
        placement &&
        createPortal(
          <div
            ref={popoverRef}
            role="dialog"
            aria-label={label}
            className="nav-popover"
            style={{
              left: placement.left,
              top: placement.top,
              width: placement.width,
              maxHeight: placement.maxHeight,
              transform: placement.above ? "translateY(-100%)" : undefined,
            }}
          >
            <div className="nav-popover-head">
              <h3 className="widget-subheading">{heading ?? label}</h3>
              <button
                type="button"
                className="nav-popover-close"
                aria-label={`Close ${heading ?? label}`}
                onClick={() => close(true)}
              >
                <X size={14} />
              </button>
            </div>
            {children}
          </div>,
          document.body,
        )}
    </>
  );
}
