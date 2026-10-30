"use client";

import { motion, type Variants } from "framer-motion";
import { PROFILE_LINKS } from "@entities/profile";
import { useTheme } from "@shared/ui/ThemeContext";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const linkVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

type SocialLinksProps = {
  /**
   * "bar"     – regular row above the character panel (default).
   * "overlay" – compact rail meant to sit on top of the Javelin stage.
   */
  variant?: "bar" | "overlay";
};

export default function SocialLinks({ variant = "bar" }: SocialLinksProps) {
  const { theme } = useTheme();
  const isOverlay = variant === "overlay";

  // In the Azur Lane / Ishmael themes the links live inside the character stage (overlay),
  // so the standalone bar is not rendered there.
  if (!isOverlay && (theme === "azurlane" || theme === "ishmael")) return null;

  return (
    <motion.div
      className={`profile-links social-links${isOverlay ? " social-links--overlay" : ""}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {PROFILE_LINKS.map((link) => (
        <motion.a
          key={link.label}
          className="profile-link"
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          data-label={link.label}
          variants={linkVariants}
          whileHover={{ y: -3, scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="profile-link-icon-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="profile-link-icon" src={link.icon} alt="" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="profile-link-frame" src={link.frame} alt="" />
          </div>
          <span className="profile-link-label">{link.label}</span>
        </motion.a>
      ))}
    </motion.div>
  );
}
