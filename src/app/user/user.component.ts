import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatOptionModule } from '@angular/material/core';
import { UserModel } from '../../models/user.model';
import { OrderModel } from '../../models/order.model';
import { MovieModel } from '../../models/movie.model';
import { UtilsService } from '../../services/utils.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    NgIf,NgFor,RouterLink,FormsModule,MatButtonModule,MatCardModule,MatTableModule,MatFormFieldModule,MatInputModule,MatIconModule,MatExpansionModule,MatOptionModule,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  public displayedColumns: string[] = ['movieId', 'title', 'countCards', 'pricePerItem', 'total', 'status', 'rating', 'actions'];
  public user: UserModel | null = null;
  public showEditProfile: boolean = false;
  public editableUser: UserModel = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    favoriteGenre: '',
    password: '',
    orders: []
  };

  constructor(private router: Router, public utils: UtilsService) {
    const activeUser = UserService.getActiveUser();
    if (!activeUser) {
      this.router.navigate(['/home']);
      return;
    }
    this.user = activeUser;

  }

  public changePassword() {
    const newPassword = prompt('Enter your new password');
    if (!newPassword) {
      alert('Password can’t be empty');
      return;
    }
    alert(UserService.changePassword(newPassword) ? 'Password has been changed' : 'Failed to change password');
  }

  public toggleProfileEdit(): void {
    this.showEditProfile = !this.showEditProfile;
    if (this.user) {
      this.editableUser = { ...this.user };
    }
  }

  public cancelEdit(): void {
    this.showEditProfile = false;
  }

  public updateProfile(): void {
    if (UserService.updateProfile(this.editableUser)) {
      this.user = UserService.getActiveUser();
      this.showEditProfile = false;
      alert('Profile updated successfully.');
    } else {
      alert('Failed to update profile.');
    }
  }

  public getGenres(movie: MovieModel): string {
    return movie?.movieGenres?.length ? movie.movieGenres.map(g => g.genre.name).join(', ') : 'N/A';
  }

  public getActors(movie: MovieModel): string {
    return movie.movieActors.map(a => a.actor.name).join(', ');
  }

  public doPay(order: OrderModel) {
    order.status = 'paid';
    order.rating = null;
    order.tempRating = 0;

    if (UserService.changeOrderStatus('paid', order.id)) {
      this.user = UserService.getActiveUser();
    }

  }

  public doCancel(order: OrderModel) {
    if (UserService.changeOrderStatus('canceled', order.id)) {
      this.user = UserService.getActiveUser();
    }
  }

  public doRating(order: OrderModel, rating: number): void {
    if (confirm(`Are you sure you want to rate this movie with ${rating} stars?`)) {
      console.log('Rating:', rating, 'for order:', order.id);

      if (UserService.submitStarRating(rating, order.id)) {
        order.rating = rating;
        order.tempRating = 0;
        this.user!.orders = [...this.user!.orders];
      } else {
        alert('Failed to submit rating');
      }
    } else {
      order.tempRating = 0;
    }
  }

  public doDelete(order: OrderModel) {
    if (confirm('Are you sure you want to delete this reservation?')) {
      if (UserService.deleteOrder(order.id)) {
        alert('Reservation deleted successfully.');


        if (this.user) {
          this.user.orders = this.user.orders.filter(o => o.id !== order.id);
        }

      } else {
        alert('Failed to delete reservation.');
      }
    }
  }

}
