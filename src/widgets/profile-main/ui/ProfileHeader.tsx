"use client";

import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function ProfileHeader() {
  return (
    <motion.div
      className="profile-header-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="profile-meta-row" variants={fadeUp}>
        <motion.div
          className="avatar-wrap"
          whileHover={{ scale: 1.04 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="avatar"
            src="https://avatars.githubusercontent.com/u/201718391?v=4"
            alt="Dekxi"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="avatar-gif"
            src="https://64.media.tumblr.com/7ea97be03c01198118541c21c6d9a930/9ae2b653243aa457-1a/s400x600/7d1a61c36da80ac0f1e6a40c52d4e121d16d33ed.gif"
            alt=""
          />
        </motion.div>
        <div className="profile-text-identity">
          <div className="profile-name-row">
            <h1 className="hero-name">dekxi</h1>
            <p className="hero-handle">@dekxisosta</p>
          </div>
          <div className="profile-bio-row">
            <p className="hero-bio">
              Nyahallo, dear reader~ A <strong>coder</strong> by contract, an{" "}
              <strong>artist</strong> by ego. Currently indebted to Roblox Studio and running
              on distorted sleep schedules.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
