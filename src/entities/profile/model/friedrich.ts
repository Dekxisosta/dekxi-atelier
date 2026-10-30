import { JAVELIN } from "./javelin";

const VOICE = "https://azurlane.netojuu.com/images";

export const FRIEDRICH = {
  name: "Friedrich der Große",
  image: "/assets/characters/friedrich.webp",
  icon: "/assets/characters/friedrich.webp",
  background: JAVELIN.background,
  lines: {
    /** Secretary (Idle) – rotates on its own */
    idle: [
      { text: "All those emotions that you’ve bottled up through all those conflicts... Listen to my concert, and let it all out.", audio: `${VOICE}/5/5e/Friedrich_der_Gro%C3%9Fe_SecIdle1JP.ogg` },
      { text: "My appearance upon the battlefield gives off an air of cruelty? Hehe... I’ll take that as a compliment.",             audio: `${VOICE}/4/4e/Friedrich_der_Gro%C3%9Fe_SecIdle2JP.ogg` },
      { text: "Even should you anger me, I’ll forgive you as long as you properly apologize.",                                      audio: `${VOICE}/b/bd/Friedrich_der_Gro%C3%9Fe_SecIdle3JP.ogg` },
    ],
    /** Secretary (Touch) – clicking her */
    touch: [
      { text: "If you are ever afraid, come hide behind my back.", audio: `${VOICE}/c/c5/Friedrich_der_Gro%C3%9Fe_Sec1JP.ogg` },
    ],
    /** Secretary (Special Touch) – clicking the special hotspot */
    specialTouch: [
      { text: "Just like a baby... how sweet.", audio: `${VOICE}/8/8e/Friedrich_der_Gro%C3%9Fe_Sec2JP.ogg` },
    ],
    /** Secretary (Headpat) – clicking her head */
    headpat: [
      { text: "Trying to get my attention, my child? Heehee.", audio: `${VOICE}/1/1b/Friedrich_der_Gro%C3%9Fe_HeadpatJP.ogg` },
    ],
  },
} as const;
