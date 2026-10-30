const VOICE = "https://azurlane.netojuu.com/images";

export const JAVELIN = {
  name: "Javelin",
  image: "/assets/characters/javelin.webp",
  icon: "/assets/characters/javelin-icon.webp",
  background: "https://images5.alphacoders.com/140/thumb-1920-1401070.png",
  lines: {
    /** Secretary (Idle) – rotates on its own */
    idle: [
      { text: "Let's work hard for the whole day!",                             audio: `${VOICE}/5/5f/Javelin_SecIdle1JP.ogg` },
      { text: "Fwa... I don't like to feel nonexistent. I'm gonna strike back~", audio: `${VOICE}/9/99/Javelin_SecIdle2JP.ogg` },
      { text: "I'm very lucky!",                                                 audio: `${VOICE}/3/36/Javelin_SecIdle3JP.ogg` },
      { text: "Commander, Commander, let's play with me~!",                      audio: `${VOICE}/e/e3/Javelin_SecIdle4JP.ogg` },
      { text: "Commander... it feels safe by your side~",                        audio: `${VOICE}/7/79/Javelin_SecIdle5JP.ogg` },
      { text: "Ehehe~ I'm pretty awesome, right?",                               audio: `${VOICE}/1/15/Javelin_SecIdle6JP.ogg` },
    ],
    /** Secretary (Touch) – clicking her */
    touch: [
      { text: "Commander, I'm pumped up!", audio: `${VOICE}/6/60/Javelin_Sec1JP.ogg` },
    ],
    /** Secretary (Special Touch) – clicking the special hotspot */
    specialTouch: [
      { text: "Kyaa~! Commander, perverted behaviour is bad!", audio: `${VOICE}/1/15/Javelin_Sec2JP.ogg` },
    ],
    /** Secretary (Headpat) – clicking her head */
    headpat: [
      { text: "Commander, I'm feeling energetic!", audio: `${VOICE}/5/5d/Javelin_HeadpatJP.ogg` },
    ],
  },
} as const;
