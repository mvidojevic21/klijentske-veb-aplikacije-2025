import { Component } from '@angular/core';
import { MovieModel } from '../../models/movie.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { UtilsService } from '../../services/utils.service';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { DatePipe, NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-order',
  imports: [MatCardModule, NgIf, MatInputModule, DatePipe, MatSelectModule, FormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {
  public movie: MovieModel | null = null
  public selectedTicketCount: number = 1
  public selectedPrice: number =1000

  public constructor(private route: ActivatedRoute, public utils: UtilsService, 
  private router: Router){
    route.params.subscribe(params=>{
      MovieService.getMovieById(params['id'])
      .then(rsp =>{
        this.movie = rsp.data
      })
    })
  }

  public doOrder(){
    Swal.fire({
      title: "You are about to create an order?",
      text: "Orders can be canceled any time from your user profile!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, place an order!"
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        const result = UserService.createOrder({
          id: new Date().getTime(),
          movieId: this.movie!.movieId,
          title: this.movie!.title,
          countCards: this.selectedTicketCount,
          pricePerItem: this.selectedPrice,
          total: this.selectedPrice*this.selectedTicketCount,
          status: "ordered",
          rating: null
    
    
        })
        result ? this.router.navigate(['/user']) :
        Swal.fire({
          title: "Failed creating an order!",
          text: "Something is wrong with your order!",
          icon: "error"
        });
      }
    });

  }
  getGenres(movie: MovieModel): string {
    return movie.movieGenres.map(g => g.genre.name).join(', ');
}


}