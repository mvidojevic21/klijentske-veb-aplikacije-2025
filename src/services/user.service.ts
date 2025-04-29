import { UserModel } from "../models/user.model";
import { OrderModel } from "../models/order.model";

export class UserService {

    static retrieveUsers(): UserModel[] {
        if (!localStorage.getItem('users')) {
            const arr: UserModel[] = [{
                email: 'user@example.com',
                firstName: "Jhon",
                lastName: "Doe",
                phone: "+381668057403",
                address: "Senjanina ive 13",
                favoriteGenre: "Akcija",
                password: 'user123',
                orders: []
            }];
            localStorage.setItem('users', JSON.stringify(arr));
        }
        return JSON.parse(localStorage.getItem('users')!);
    }

    static createUser(model: UserModel) {
        const users = this.retrieveUsers();
        for (let u of users) {
            if (u.email === model.email) {
                return false;
            }
        }

        users.push(model);
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    }

    static login(email: string, password: string): boolean {
        for (let user of this.retrieveUsers()) {
            if (user.email === email && user.password === password) {
                localStorage.setItem('active', user.email);
                return true;
            }
        }

        return false;
    }

    static getActiveUser(): UserModel | null {
        if (!localStorage.getItem('active')) return null;

        for (let user of this.retrieveUsers()) {
            if (user.email == localStorage.getItem('active')) {
                return user;
            }
        }
        return null;
    }

    static createOrder(order: OrderModel) {
        const arr = this.retrieveUsers();
        for (let user of arr) {
            if (user.email == localStorage.getItem('active')) {
                user.orders.push(order);
                localStorage.setItem('users', JSON.stringify(arr));
                return true;
            }
        }

        return false;
    }

    static changeOrderStatus(state: 'ordered' | 'paid' | 'canceled', id: number) {
        const active = this.getActiveUser();
        if (active) {
            const arr = this.retrieveUsers();
            for (let user of arr) {
                if (user.email == active.email) {
                    for (let order of user.orders) {
                        if (order.id == id) {
                            order.status = state;
                        }
                    }
                    localStorage.setItem('users', JSON.stringify(arr));
                    return true;
                }
            }
        }
        return false;
    }


    static submitStarRating(rating: number, orderId: number): boolean {
        const users = this.retrieveUsers();
        const active = this.getActiveUser();
        if (!active) return false;

        let updated = false;

        for (let user of users) {
            if (user.email === active.email) {
                for (let order of user.orders) {
                    if (order.id === orderId && order.status === 'paid') {
                        order.rating = rating;
                        order.stars = rating
                        updated = true;
                    }
                }
            }
        }

        if (!updated) return false;


        const activeUser = users.find(u => u.email === active.email);
        const order = activeUser?.orders.find(o => o.id === orderId);
        if (!order) return false;

        const movieId = order.movieId;


        const allOrders: OrderModel[] = [];
        for (let user of users) {
            for (let o of user.orders) {
                if (o.movieId === movieId && o.stars != null) {
                    allOrders.push(o);
                }
            }
        }

        const ratings = allOrders.map(o => o.stars!);
        const avg = ratings.reduce((sum, val) => sum + val, 0) / ratings.length;


        for (let user of users) {
            for (let o of user.orders) {
                if (o.movieId === movieId) {
                    o.avgRating = avg;
                }
            }
        }

        localStorage.setItem('users', JSON.stringify(users));
        return true;
    }

    static changePassword(newPassword: string): boolean {
        const arr = this.retrieveUsers();
        for (let user of arr) {
            if (user.email == localStorage.getItem('active')) {
                user.password = newPassword;
                localStorage.setItem('users', JSON.stringify(arr));
                return true;
            }
        }

        return false;
    }

    public static updateProfile(user: UserModel): boolean {
        const users = this.retrieveUsers();
        const activeEmail = localStorage.getItem('active');

        if (!activeEmail) return false;

        const index = users.findIndex(u => u.email === activeEmail);
        if (index === -1) return false;

        user.orders = users[index].orders;
        user.password = users[index].password;

        users[index] = user;

        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('active', user.email);

        return true;
    }

    static deleteOrder(orderId: number): boolean {
        const activeUser = this.getActiveUser();
        if (!activeUser) return false;

        const index = activeUser.orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
            activeUser.orders.splice(index, 1);
            localStorage.setItem('activeUser', JSON.stringify(activeUser));
            return true;
        }
        return false;
    }
}