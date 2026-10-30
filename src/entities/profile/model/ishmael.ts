const VOICE = "https://static.wikia.nocookie.net/limbuscompany/images";

export type CharacterLine = { readonly text: string; readonly audio?: string };

/** Limbus Company – Ishmael. Idle only: no touch / headpat lines. */
export const ISHMAEL = {
  name: "Ishmael",
  image: "/assets/characters/ishmael.webp",
  icon: "/assets/characters/ishmael-icon.webp",
  background: "https://limbuscompany.wiki.gg/images/Steam_Transport_Machine_BG.png?ffa7c1",
  lines: {
    /** Identity Acquisition – shown first */
    intro: {
      text: "Call me Ishmael, if you please.",
      audio: `${VOICE}/5/58/LCB_Sinner_Ishmael_Get.wav/revision/latest?cb=20230606080549`,
    },
    /** Chatter – rotates on its own */
    idle: [
      {
        text: "I do think it's fortunate that we have you on our side. Better to have two people who can think straight than just one.",
        audio: `${VOICE}/2/23/LCB_Sinner_Ishmael_Chat_1.wav/revision/latest?cb=20230606080923`,
      },
      {
        text: "I can take care of most orders without much difficulty, provided that they're based on rational and efficient judgement.",
        audio: `${VOICE}/b/b9/LCB_Sinner_Ishmael_Chat_2.wav/revision/latest?cb=20230606080934`,
      },
      {
        text: "I suppose it's your job to use this motley ensemble of Sinners appropriately.",
        audio: `${VOICE}/7/72/LCB_Sinner_Ishmael_Chat_3.wav/revision/latest?cb=20230606080941`,
      },
      {
        text: "Just to be clear, the remarks I say to you are meant to assist you to ensure the success of our mission. I'm not just saying them with hard feelings towards you.",
        audio: `${VOICE}/6/6c/LCB_Sinner_Ishmael_Chat_4.wav/revision/latest?cb=20230606080948`,
      },
      {
        text: "In my previous occupation, a tiny mistake could compromise all of our safety. My sensitive tendencies come from that experience. Oh... no, I'm not trying to ask for your understanding.",
        audio: `${VOICE}/d/d7/LCB_Sinner_Ishmael_Chat_5.wav/revision/latest?cb=20230606080956`,
      },
      {
        text: "Manager? Sigh... I'll be off then.",
        audio: `${VOICE}/9/9d/LCB_Sinner_Ishmael_Idle.wav/revision/latest?cb=20230606081603`,
      },
    ],
  },
} as const;
