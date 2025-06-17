import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Filme {
  id?: number;
  title?: string;
  original_title?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  overview?: string;
  vote_average?: number;
  genre_ids?: number[];
  popularity?: number;
  vote_count?: number;
  adult?: boolean;
  original_language?: string;
  video?: boolean;
  list?: boolean;
  watched?: boolean;
  rating?: number;
  tmdb_id?: number
  year?: string
  state?: boolean
  poster_url?: string
}

export interface User {
  id: number;
  username: string;
  avatar: string;
  email: string;
  followers_count: number;
  following_count: number;
  jaSegue?: boolean;
  followersCount?: number;
  followingCount?: number;
}

