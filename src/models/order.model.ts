export interface OrderModel{
    id: number
    movieId: number
        title: string
        countCards: number
        pricePerItem: number
        total: number
        status: 'ordered' | 'paid' | 'canceled'
        rating: number | null 
        stars?: number
        avgRating?: number 
        tempRating?: number
}