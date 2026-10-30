import { ISHMAEL } from "./ishmael";

const VOICE = "https://static.wikia.nocookie.net/limbuscompany/images";

/** Limbus Company – Don Quixote. Idle only: no touch / headpat lines. */
export const DON_QUIXOTE = {
  name: "Don Quixote",
  image: "/assets/characters/don-quixote.webp",
  icon: "/assets/characters/don-quixote-icon.webp",
  background: ISHMAEL.background,
  lines: {
    /** Identity Acquisition – shown first */
    intro: {
      text: "Hath my time come? I am Don Quixote!",
      audio: `${VOICE}/b/bf/LCB_Sinner_Don_Quixote_Get.wav/revision/latest?cb=20230603105059`,
    },
    /** Morning Greeting + Chatter + Idle – rotates on its own */
    idle: [
      {
        text: "Yaaawn… You must be one diligent laborer, Manager Esquire. How on earth do you manage to rouse yourself at this hour…?",
        audio: `${VOICE}/e/e1/LCB_Sinner_Don_Quixote_Morning.wav/revision/latest?cb=20230603105244`,
      },
      {
        text: "Manager Esquire, would you lend an eye to these? ‘Tis my trove of treasures, hehe… Some are limited editions which I fought valiantly to lay claim upon!",
        audio: `${VOICE}/0/02/LCB_Sinner_Don_Quixote_Chat_1.wav/revision/latest?cb=20230603105328`,
      },
      {
        text: "My, cast your gaze upon those Fixers, sprinting forth to bring about justice! Dazzling, are they not?",
        audio: `${VOICE}/7/74/LCB_Sinner_Don_Quixote_Chat_2.wav/revision/latest?cb=20230603105332`,
      },
      {
        text: "Pray tell, what Fixer is your favorite, Manager Esquire? Would you fancy a pin in their celebration to decorate your attire?",
        audio: `${VOICE}/6/6e/LCB_Sinner_Don_Quixote_Chat_3.wav/revision/latest?cb=20230603105338`,
      },
      {
        text: "Manager Esquire!!!!! To where in the world hast thou disappeared!!!!!!!!!!!",
        audio: `${VOICE}/3/3e/LCB_Sinner_Don_Quixote_Idle.wav/revision/latest?cb=20230603105358`,
      },
    ],
  },
} as const;
