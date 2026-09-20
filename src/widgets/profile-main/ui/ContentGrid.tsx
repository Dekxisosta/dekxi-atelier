"use client";

import { motion, type Variants } from "framer-motion";
import { CONTENT_LINKS } from "@entities/profile";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function ContentGrid() {
  return (
    <motion.div
      className="content content-grid"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {CONTENT_LINKS.map((link) => (
        <motion.a
          key={link.alt}
          className="link-card visible"
          href={link.href}
          target={link.href.startsWith("http") ? "_blank" : undefined}
          rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
          variants={cardVariants}
          whileHover={{ scale: 1.06, y: -4 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 100, damping: 18 }}
        >
          <div className="link-icon-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="link-icon"
              src={link.icon}
              alt={link.alt}
              style={link.invert ? { filter: "invert(1) opacity(0.85)" } : undefined}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="link-frame" src={link.frame} alt="" />
          </div>
        </motion.a>
      ))}
    </motion.div>
  );
}
