import { JAVELIN } from "./javelin";

const VOICE = "https://azurlane.netojuu.com/images";

export const LAFFEY = {
  name: "Laffey",
  image: "/assets/characters/laffey.webp",
  icon: "/assets/characters/laffey.webp",
  background: JAVELIN.background,
  lines: {
    /** Secretary (Idle) – rotates on its own */
    idle: [
      { text: "Commander, don't you think we should plant some flowers?",                 audio: `${VOICE}/7/7d/Laffey_SecIdle1JP.ogg` },
      { text: "Since you're ignoring me, I might as well... *yawns*... get some sleep.", audio: `${VOICE}/5/59/Laffey_SecIdle2JP.ogg` },
      { text: "Yes? This is what I look like when I'm happy.",                            audio: `${VOICE}/f/f4/Laffey_SecIdle3JP.ogg` },
      { text: "I'm not trying to make you pay attention to me. Nope, not at all...",      audio: `${VOICE}/6/6e/Laffey_SecIdle4JP.ogg` },
      { text: "I'm not trying to get you to play with me. Nope, probably not...",         audio: `${VOICE}/d/da/Laffey_SecIdle5JP.ogg` },
      { text: "Commander... am I... scary?",                                              audio: `${VOICE}/c/c7/Laffey_SecIdle6JP.ogg` },
    ],
    /** Secretary (Touch) – clicking her */
    touch: [
      { text: "Are you tired, Commander?", audio: `${VOICE}/2/2f/Laffey_Sec1JP.ogg` },
    ],
    /** Secretary (Special Touch) – clicking the special hotspot */
    specialTouch: [
      { text: "Are you... a pervert, Commander...?", audio: `${VOICE}/a/aa/Laffey_Sec2JP.ogg` },
    ],
    /** Secretary (Headpat) – clicking her head */
    headpat: [
      { text: "Mmh... Stop shaking me, Commander...", audio: `${VOICE}/2/2e/Laffey_HeadpatJP.ogg` },
    ],
  },
} as const;
