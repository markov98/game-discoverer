import type { Game } from "./types";

export const fallbackGames: Game[] = [
  {
    id: 1,
    slug: "hades",
    name: "Hades",
    released: "2020-09-17",
    rating: 4.4,
    ratings_count: 4200,
    genres: ["action", "indie", "role-playing-games-rpg"],
    metacritic: 93,
    background_image:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co2lbd.jpg",
  },
  {
    id: 2,
    slug: "outer-wilds",
    name: "Outer Wilds",
    released: "2019-05-28",
    rating: 4.5,
    ratings_count: 1800,
    genres: ["adventure", "indie", "simulation"],
    metacritic: 85,
    background_image:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co1x7c.jpg",
  },
  {
    id: 3,
    slug: "celeste",
    name: "Celeste",
    released: "2018-01-25",
    rating: 4.4,
    ratings_count: 2200,
    genres: ["indie", "platformer", "action"],
    metacritic: 92,
    background_image:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co1tgy.jpg",
  },
  {
    id: 4,
    slug: "disco-elysium",
    name: "Disco Elysium",
    released: "2019-10-15",
    rating: 4.6,
    ratings_count: 3100,
    genres: ["role-playing-games-rpg", "adventure", "strategy"],
    metacritic: 91,
    background_image:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg",
  },
];