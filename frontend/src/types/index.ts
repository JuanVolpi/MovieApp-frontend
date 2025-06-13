import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Filme {
  id: number;
  title: string;
  original_title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  overview: string;
  vote_average: number;
  genre_ids: number[];
  popularity: number;
  vote_count: number;
  adult: boolean;
  original_language: string;
  video: boolean;
}