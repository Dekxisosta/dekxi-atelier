
const CONFETTI_BORDER_SRC =
  "https://static.wikia.nocookie.net/projectsekai/images/4/41/Confetti_Title_Border.png/revision/latest/scale-to-width-down/180?cb=20231110092810";

interface FavoriteImg { name: string; src: string }

function FanTitle({ src, alt = "" }: { src: string; alt?: string }) {
  return (
    <div className="fan-title-frame">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={CONFETTI_BORDER_SRC} alt="" className="fan-title-confetti" />
    </div>
  );
}

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
];
const vtuberFavorites: FavoriteImg[] = [
  { name: "Ninomae Inanis",   src: "https://s4.anilist.co/file/anilistcdn/character/large/b206019-DJ9tFFCDaEVt.png" },
  { name: "Hoshimachi Suisei",src: "https://i.redd.it/7l6eets5lvv71.png"                                           },
];
const gameFavorites: FavoriteImg[] = [
  { name: "Limbus Company",          src: "https://i.pinimg.com/736x/3e/9e/62/3e9e62fea50e0c2d9e5d4abc7c8f91a0.jpg"                                         },
  { name: "Needy Streamer Overload", src: "https://i.pinimg.com/474x/97/74/bf/9774bfe83826b87089e1f0fafa0c4c0f.jpg"                                         },
  { name: "DDLC",                    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVgKl7qcgMMGMwvyag29UuIqhhcdxOLjp_TGAfFShMlA&s=10"        },
];
const musicFavorites: FavoriteImg[] = [
  { name: "Mili",             src: "https://upload.wikimedia.org/wikipedia/commons/2/20/Mili_Logo.png"                                                                                                                  },
  { name: "r-906",            src: "https://static.wikia.nocookie.net/vocaloid/images/9/96/R-906_profile_2025.jpg/revision/latest/scale-to-width-down/250?cb=20251228145003"                                            },
  { name: "MORE MORE JUMP!",  src: "https://media.tenor.com/QIVRwVlvuhcAAAAM/airi-momoi.gif"                                                                                                                            },
];
const vocaloidFavorites: FavoriteImg[] = [
  { name: "Kasane Teto",  src: "https://i1.sndcdn.com/artworks-1Exts2YYAEhYU8Wf-Ouj9Pw-t500x500.jpg"                                                                              },
  { name: "Hatsune Miku", src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqsXR0syaYOLY7jQUQYBj4CaOkxzLXYgBv5LJEq9oLqTup1ZpdGkAdqBM&s=10" },
  { name: "Kaai Yuki",    src: "https://i.pinimg.com/736x/6e/5e/f0/6e5ef03c1505a93ffaf1c0d5c2d79099.jpg"                                                                          },
];
const othersFavorites: FavoriteImg[] = [
  { name: "Milgram",        src: "https://i.pinimg.com/736x/6d/29/4d/6d294db7c1082bb7cbfa1b8fa9fe5e8e.jpg"                                                                    },
  { name: "TADC",           src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVI8YpKPFsjKpYY1R79eTAtAzIGU1Dqy453rAZ-5x57A&s=10"                                  },
  { name: "Murder Drones",  src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5Px_Tu3v88dv7wDGNEEi0vMVHm8JSq7PyPFImAqwynzVngLod6mHw2fip&s=10"                   },
];

export default function AboutMe() {
  return (
    <div className="main-center">

      <div className="about-section-wrap">
        <div className="about-section about-two-col">
          <div>
            <p className="byf-dni-text">
              English only. Replies may be delayed due to university and freelance work. Open to
              collaboration and commissions. Best contacted through email or Discord.
            </p>
          </div>
          <div>
            <p className="byf-dni-text">
              basic dni criteria · <b>if you hate any of my favs</b>
            </p>
          </div>
        </div>
      </div>

      <div className="about-section-wrap">
        <div className="about-section about-two-col">
          <div>
            <h3 className="about-subheading">anime</h3>
            <FavoritesRow items={animeFavorites} />
            <p className="about-text">
              Little Witch Academia, Mushoku Tensei, Marriage Toxin, <b>K-On</b>, Another, NGE,
              You and I are Polar Opposites, My Dress-up Darling, Steins;Gate, BTR, Re:Zero
            </p>
          </div>
          <div>
            <h3 className="about-subheading">vtubers</h3>
            <FavoritesRow items={vtuberFavorites} />
            <p className="about-text">
              <b>Ninomae Inanis</b>, Kuri Kitte, Pipkin Pippa, Enna Alouette, Nekomata Okayu,
              Rina Lucsper, <b>Hoshimachi Suisei</b>
            </p>
          </div>
        </div>
      </div>

      <div className="about-section-wrap">
        <div className="about-section about-two-col">
          <div>
            <h3 className="about-subheading">games</h3>
            <FavoritesRow items={gameFavorites} />
            <p className="about-text">
              Arcaea, Broken Harmony, Needy Streamer Overload, DDLC, <b>Limbus Company</b>,
              R1999, PGR, Guardian Tales
            </p>
          </div>
          <div>
            <h3 className="about-subheading">music</h3>
            <FavoritesRow items={musicFavorites} />
            <p className="about-text">
              Ado, AnythingBecomeMoe, <b>Mili</b>, Flavor Foley, PSYQUI, t+pazolite, Tanchiky,
              <b>r-906</b>, Sakuzyo, Hoshimachi Suisei, MORE MORE JUMP!
            </p>
          </div>
        </div>
      </div>

      <div className="about-section-wrap">
        <div className="about-section about-two-col">
          <div>
            <h3 className="about-subheading">Vocaloid</h3>
            <FavoritesRow items={vocaloidFavorites} />
            <p className="about-text">
              <b>Hatsune Miku</b>, Kasane Teto, GUMI, Yi Xi. Kaai Yuki, Megurine Luka,
              Kagamine Rin, Kagamine Len, Neru
            </p>
          </div>
          <div>
            <h3 className="about-subheading">others</h3>
            <FavoritesRow items={othersFavorites} />
            <p className="about-text">
              <b>Vocaloid</b>, Spiderverse, Milgram, KOG, TADC, Gameoverse, Murder Drones
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
