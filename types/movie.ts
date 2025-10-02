export interface MovieSummary {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type?: string;
}

export interface MovieDetails extends MovieSummary {
  Genre?: string;
  Plot?: string;
  Director?: string;
  Actors?: string;
  Runtime?: string;
  Language?: string;
  Rated?: string;
  Released?: string;
}

export interface OmdbSearchResponse {
  Search?: MovieSummary[];
  totalResults?: string;
  Response: "True" | "False";
  Error?: string;
}

