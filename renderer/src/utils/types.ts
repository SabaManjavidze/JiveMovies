export type Episode = {
  id?: string;
  epName: string;
  epNumber: string;
  url?: string;
};

export interface AdjaraMovie {
  id: number;
  type: string;
  adjaraId: number;
  originalName: string;
  primaryName: string;
  secondaryName: string;
  tertiaryName: string;
  primaryDescription: string;
  secondaryDescription: string;
  tertiaryDescription: string;
  poster: string;
  isTvShow: boolean;
  isAdult: boolean;
  isFree: boolean;
  year: number;
  weight: number;
  rating: Rating;
  highlights?: HighlightsEntity[] | null;
  posters: Posters;
  covers: Covers;
  actors: Actors;
  countries: Countries;
  languages: Languages;
  trailer?: null;
  plots: Plots;
  genres: Genres;
  lastSeries: LastSeries;
}
export interface Rating {
  imdb: ImdbOrImovies;
  imovies: ImdbOrImovies;
}
export interface ImdbOrImovies {
  score: number;
  voters: number;
}
export interface HighlightsEntity {
  field: string;
  value: string;
}
export interface Posters {
  data: PostersData;
}
export interface PostersData {
  240: string;
  400: string;
}
export interface Covers {
  data: CoversData;
}
export interface CoversData {
  145: string;
  367: string;
  510: string;
  1050: string;
  1920: string;
}
export interface Actors {
  data?: ActorEntity[] | null;
}
export interface ActorEntity {
  id: number;
  originalName: string;
  primaryName: string;
  secondaryName: string;
  tertiaryName: string;
  poster: string;
  birthDate: string;
  birthPlace: string;
  deathDate: string;
  deathPlace: string;
  height: number;
  slogan: string;
  zodiacSign: string;
}
export interface Countries {
  data?: CountryEntity[] | null;
}
export interface CountryEntity {
  id: number;
  primaryName: string;
  secondaryName: string;
  tertiaryName: string;
}
export interface Languages {
  data?: LanguageEntity[] | null;
}
export interface LanguageEntity {
  code: string;
  primaryName: string;
  primaryNameTurned: string;
  tertiaryName: string;
  secondaryName: string;
}
export interface Plots {
  data?: PlotData[] | null;
}
export interface PlotData {
  description: string;
  language: string;
}
export interface Genres {
  data?: null[] | null;
}
export interface LastSeries {
  data: LastSeriesData;
}
export interface LastSeriesData {
  season: number;
  episode: number;
}

export type Movie = {
  slug: string;
  title: string;
  thumbnail_url: string;
  url?: string;
  movieType: MovieType;
};
export type VideoObj = {
  video: string;
  quality: string | "1080p" | "720p" | "480p";
};

export type MovieType = "series" | "movies" | "episode";
