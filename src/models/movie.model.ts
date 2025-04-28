export interface MovieModel {
    movieId: number
    internalId: string
    corporateId: string

    title: string
    originalTitle: string
    description: string
    shortDescription: string
    poster: string

    startDate: string
    shortUrl: string
    runTime: string
    createdAt: string
    updatedAt: null | string

    director: {
        directorId: number
        name: string
    }
    movieActors: {
        movieActorId: number
        actor: {
            actroId: number
            name: string
        }
    }

    movieGenre: {
        movieGenreId: number
        genre: {
            genreId: number
            name: string
        }
    }


}