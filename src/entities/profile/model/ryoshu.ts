import { ISHMAEL } from "./ishmael";

const VOICE = "https://static.wikia.nocookie.net/limbuscompany/images";

/** Limbus Company – Ryōshū. Idle only: no touch / headpat lines. */
export const RYOSHU = {
  name: "Ryōshū",
  image: "/assets/characters/ryoshu.webp",
  icon: "/assets/characters/ryoshu-icon.webp",
  background: ISHMAEL.background,
  lines: {
    /** Identity Acquisition – shown first */
    intro: {
      text: "It’s Ryōshū. Shūre’s nice to meet ya. …Pft.",
      audio: `${VOICE}/d/dc/LCB_Sinner_Ry%C5%8Dsh%C5%AB_Get.wav/revision/latest?cb=20230604040356`,
    },
    /** Morning Greeting + Chatter + Idle – rotates on its own */
    idle: [
      {
        text: "What are you meandering about for so early? Looking for batteries?",
        audio: `${VOICE}/5/58/LCB_Sinner_Ry%C5%8Dsh%C5%AB_Morning.wav/revision/latest?cb=20230604040430`,
      },
      {
        text: "It’s been a while since I saw art worth appraising. All I see these days are cheap imitations. Hmph.",
        audio: `${VOICE}/3/36/LCB_Sinner_Ry%C5%8Dsh%C5%AB_Chat_1.wav/revision/latest?cb=20230604040520`,
      },
      {
        text: "If you wanna hang out with me, the least you can do is carry a lighter around, clock.",
        audio: `${VOICE}/0/03/LCB_Sinner_Ry%C5%8Dsh%C5%AB_Chat_2.wav/revision/latest?cb=20230604040541`,
      },
      {
        text: "Don’t bother me if you aren’t trying to tell me what time it is.",
        audio: `${VOICE}/4/4c/LCB_Sinner_Ry%C5%8Dsh%C5%AB_Chat_3.wav/revision/latest?cb=20230604040554`,
      },
      {
        text: "You talk to me first and then walk away… Where’d you learn that custom?",
        audio: `${VOICE}/4/45/LCB_Sinner_Ry%C5%8Dsh%C5%AB_Idle.wav/revision/latest?cb=20230604040626`,
      },
    ],
  },
} as const;
