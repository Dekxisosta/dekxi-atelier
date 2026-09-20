"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { CHIBI_IMAGES } from "@entities/profile";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function ChibiDock() {
  const [hovered, setHovered] = useState<{ label: string; x: number; y: number } | null>(null);

  return (
    <motion.div
      className="chibi-dock"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {CHIBI_IMAGES.map((chibi) => (
        <motion.div
          key={chibi.id}
          className="chibi-item"
          variants={itemVariants}
          whileHover={{ scale: 1.12, y: -4 }}
          transition={{ type: "spring", stiffness: 320, damping: 18 }}
          onMouseEnter={(e) => setHovered({ label: chibi.label, x: e.clientX, y: e.clientY })}
          onMouseMove={(e) => setHovered((h) => (h ? { ...h, x: e.clientX, y: e.clientY } : h))}
          onMouseLeave={() => setHovered(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={chibi.src} alt={chibi.label} />
        </motion.div>
      ))}

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {hovered && (
              <motion.div
                className="chibi-tooltip"
                style={{ left: hovered.x + 16, top: hovered.y + 16 }}
                initial={{ opacity: 0, scale: 0.9, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 4 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                {hovered.label}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </motion.div>
  );
}
