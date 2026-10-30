import type { ReactNode } from "react";
import NavWidgetButton from "./NavWidgetButton";

interface FavoriteImg { name: string; src: string }

function FavoritesRow({ items }: { items: FavoriteImg[] }) {
  return (
    <div className="favorites-row">
      {items.map((item) => (
        <div key={item.name} className="favorite-thumb" title={item.name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.src} alt={item.name} />
        </div>
      ))}
    </div>
  );
}

const animeFavorites: FavoriteImg[] = [
  { name: "K-On",        src: "https://78.media.tumblr.com/be7c5a165e1daa732a93e8c6f159e1a5/tumblr_nbkbw6FL0D1rbnx7io1_500.gif" },
  { name: "Steins;Gate", src: "https://media.tenor.com/5I0RFT2IH9UAAAAM/steins-gate-anime.gif"                                   },
  { name: "Re:Zero",     src: "https://media.tenor.com/wBzXX1bly3sAAAAM/subaru-natsuki-subaru.gif"                               },
  { name: "Madoka Magica", src: "https://media.tenor.com/YhQTcWwFu5sAAAAM/kaname-madoka.gif"},
  { name: "Neon Genesis Evangelion", src: "https://i.pinimg.com/236x/99/c0/db/99c0db18884dbe307e17952db3c9ee90.jpg"},
];
const vtuberFavorites: FavoriteImg[] = [
  { name: "Ninomae Inanis",   src: "https://s4.anilist.co/file/anilistcdn/character/large/b206019-DJ9tFFCDaEVt.png" },
  { name: "Hoshimachi Suisei",src: "https://i.redd.it/7l6eets5lvv71.png"                                           },
  { name: "Tokoyami Towa", src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbWiundQY5oAjKmqzeJn7U9xXeym6i52La-U51ETNe4PV6ASftjJEj4BF9&s=10"},
  { name: "Enna Alouette", src: "https://yt3.googleusercontent.com/so6GdSOoQiJkq4PpfCivWlGQYw0Dl83ONFRIez9BuA5O6QZBKyxMwbJUvh-wvyyyQw0WpYZxPg=s900-c-k-c0x00ffffff-no-rj"},
  { name: "Houshou Marine", src: "https://i.pinimg.com/236x/69/38/94/6938949f19f7854b09f4a8f5a21f63da.jpg"}
];
const gameFavorites: FavoriteImg[] = [
  { name: "Limbus Company",          src: "https://i.pinimg.com/736x/3e/9e/62/3e9e62fea50e0c2d9e5d4abc7c8f91a0.jpg"                                         },
  { name: "Needy Streamer Overload", src: "https://i.pinimg.com/474x/97/74/bf/9774bfe83826b87089e1f0fafa0c4c0f.jpg"                                         },
  { name: "DDLC",                    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVgKl7qcgMMGMwvyag29UuIqhhcdxOLjp_TGAfFShMlA&s=10"        },
  { name: "Azur Lane", src: "https://media.tenor.com/xnz9eVFjyhoAAAAe/azur-lane-javelin.png"},
  { name: "Skullgirls", src: "https://i.pinimg.com/564x/eb/d2/17/ebd217810d3e82381fdc00ca3f3b5dc0.jpg"},
];
const musicFavorites: FavoriteImg[] = [
  { name: "Mili",             src: "https://upload.wikimedia.org/wikipedia/commons/2/20/Mili_Logo.png"                                                                                                                  },
  { name: "r-906",            src: "https://static.wikia.nocookie.net/vocaloid/images/9/96/R-906_profile_2025.jpg/revision/latest/scale-to-width-down/250?cb=20251228145003"                                            },
  { name: "MORE MORE JUMP!",  src: "https://media.tenor.com/QIVRwVlvuhcAAAAM/airi-momoi.gif"                                                                                                                            },
  { name: "Ado", src: "https://i.scdn.co/image/ab67616d0000b273320b5fefab404e4f8a0f12bf"}
];
const vocaloidFavorites: FavoriteImg[] = [
  { name: "Kasane Teto",  src: "https://i1.sndcdn.com/artworks-1Exts2YYAEhYU8Wf-Ouj9Pw-t500x500.jpg"                                                                              },
  { name: "Hatsune Miku", src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqsXR0syaYOLY7jQUQYBj4CaOkxzLXYgBv5LJEq9oLqTup1ZpdGkAdqBM&s=10" },
  { name: "Kaai Yuki",    src: "https://i.pinimg.com/736x/6e/5e/f0/6e5ef03c1505a93ffaf1c0d5c2d79099.jpg"                                                                          },
  { name: "Akita Neru", src: "https://i.pinimg.com/564x/a4/10/ca/a410cacc1c4f957e637998c437b876f1.jpg"},
];
const othersFavorites: FavoriteImg[] = [
  { name: "Milgram",        src: "https://i.pinimg.com/736x/6d/29/4d/6d294db7c1082bb7cbfa1b8fa9fe5e8e.jpg"                                                                    },
  { name: "TADC",           src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVI8YpKPFsjKpYY1R79eTAtAzIGU1Dqy453rAZ-5x57A&s=10"                                  },
  { name: "Murder Drones",  src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5Px_Tu3v88dv7wDGNEEi0vMVHm8JSq7PyPFImAqwynzVngLod6mHw2fip&s=10"                   },
  { name: "Cooking", src: "https://mykoreankitchen.com/wp-content/uploads/2007/04/3.-Omurice-Rice-Recipe.jpg"},
];

const CATEGORIES: { key: string; label: string; items: FavoriteImg[]; text: ReactNode }[] = [
  {
    key: "anime",
    label: "Anime",
    items: animeFavorites,
    text: <>Little Witch Academia, Mushoku Tensei, Marriage Toxin, <b>K-On</b>, Another, NGE, You and I are Polar Opposites, My Dress-up Darling, Steins;Gate, BTR, Re:Zero, Madoka Magica, Samurai Flamenco</>,
  },
  {
    key: "vtubers",
    label: "VTubers",
    items: vtuberFavorites,
    text: <><b>Ninomae Inanis</b>, Kuri Kitte, Pipkin Pippa, Enna Alouette, Nekomata Okayu, Rina Lucsper, <b>Hoshimachi Suisei</b>, Usada Pekora, Shirogane Noel, Tokoyami Towa</>,
  },
  {
    key: "games",
    label: "Games",
    items: gameFavorites,
    text: <>Arcaea, Broken Harmony, Needy Streamer Overload, DDLC, <b>Limbus Company</b>, R1999, PGR, Guardian Tales, Azur Lane, Skullgirls, MLBB, Inotia, Seed, Soul Knight, Pokemon, Legend of Zelda, Resident Evil, Reign Fall, Entrenched, Hooked, Hypershot, Lumber Tycoon 2</>,
  },
  {
    key: "music",
    label: "Music",
    items: musicFavorites,
    text: <>Ado, ABM, Araki, Roselia, Poppin' Party, N-25, AiScream <b>Mili</b>, Flavor Foley, PSYQUI, t+pazolite, Tanchiky, <b> r-906</b>, Sakuzyo, Hoshimachi Suisei, MORE MORE JUMP!, inabakumori, Atena, Zutomayo, JamieP, DECO*27, Eye, rusino</>,
  },
  {
    key: "vocaloid",
    label: "Vocaloid",
    items: vocaloidFavorites,
    text: <><b>Hatsune Miku</b>, Kasane Teto, GUMI, Yi Xi, Kaai Yuki, Megurine Luka, Kagamine Rin, Kagamine Len, Neru, MEIKO, KAITO, IA, Kizuna AI, Otomachi Una, Yuzuki Yukari, flower, SeeU, v flower, Akita Neru</>,
  },
  {
    key: "others",
    label: "Others",
    items: othersFavorites,
    text: <><b>Vocaloid</b>, Spiderverse, Milgram, KOG, TADC, Gameoverse, Murder Drones</>,
  },
];

/** Favorites as small buttons; each opens a popover with its thumbnails + list. */
export default function FavoritesModals() {
  return (
    <div className="nav-favorites" role="group" aria-label="Favorites">
      {CATEGORIES.map((c) => (
        <NavWidgetButton key={c.key} variant="text" label={c.label} width={340}>
          <FavoritesRow items={c.items} />
          <p className="about-text">{c.text}</p>
        </NavWidgetButton>
      ))}
    </div>
  );
}
