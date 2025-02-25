import { Cast } from "./cast";

export type Movie = {
    id: number;
    title: string;
    poster_path: string;
    poster_path_complete: string;
    release_date: string;
    overview: string;
    vote_average: number;
    genre_ids: number[];
    genres: [{
        id: number,
        name: string,
    }];
    cast: Cast[];
    crew: Cast[];
}