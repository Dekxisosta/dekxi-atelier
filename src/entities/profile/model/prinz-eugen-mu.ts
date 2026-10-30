import { JAVELIN } from "./javelin";

const VOICE = "https://azurlane.netojuu.com/images";

export const PRINZ_EUGEN_MU = {
  name: "Prinz Eugen μ",
  image: "/assets/characters/prinz-eugen-mu.webp",
  icon: "/assets/characters/prinz-eugen-mu-icon.webp",
  background: JAVELIN.background,
  lines: {
    /** Secretary (Idle) – rotates on its own */
    idle: [
      { text: "Try and give me a stage I can shine even better on. I'll reward you handsomely♪",         audio: `${VOICE}/0/00/Prinz_Eugen_%C2%B5_SecIdle1JP.ogg` },
      { text: "Luck and ability are both important to idols. Of course, I've got both!",                   audio: `${VOICE}/3/3a/Prinz_Eugen_%C2%B5_SecIdle2JP.ogg` },
      { text: "When you hear my voice, don't you feel me... engulfing your heart and soul?",              audio: `${VOICE}/1/19/Prinz_Eugen_%C2%B5_SecIdle3JP.ogg` },
      { text: "Oh? There's peeping, and then there's this. If you wanna see me that bad... then look all you want. Heehee.", audio: `${VOICE}/4/40/Prinz_Eugen_%C2%B5_SecIdle4JP.ogg` },
    ],
    /** Secretary (Touch) – clicking her */
    touch: [
      { text: "Commander? Have you fallen head-over-heels for my idol form?", audio: `${VOICE}/9/96/Prinz_Eugen_%C2%B5_Sec1JP.ogg` },
    ],
    /** Secretary (Special Touch) – clicking the special hotspot */
    specialTouch: [
      { text: "Touching an idol? I'd better scream for help... Just kidding! As you wish, I'll let you get a little taste... Heheh♥", audio: `${VOICE}/e/ec/Prinz_Eugen_%C2%B5_Sec2JP.ogg` },
    ],
    /** Secretary (Headpat) – clicking her head */
    headpat: [
      { text: "Hmph, someone went and messed up my hair and makeup... You're gonna pay the price for that later.", audio: `${VOICE}/3/35/Prinz_Eugen_%C2%B5_HeadpatJP.ogg` },
    ],
  },
} as const;
