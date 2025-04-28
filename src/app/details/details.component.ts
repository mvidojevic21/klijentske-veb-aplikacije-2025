import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MovieModel } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';
import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { UtilsService } from '../../services/utils.service';
import { MatCard, MatCardModule } from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-details',
  imports: [JsonPipe,NgIf, MatCardModule, MatListModule, MatButtonModule, RouterLink],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
public movie: MovieModel | null = null

  public constructor(private route: ActivatedRoute, public utils: UtilsService){
    route.params.subscribe(params=>{
      MovieService.getMovieById(params['id'])
      .then(rsp =>{
        this.movie = rsp.data
      })
    })
  }

  getGenres(movie: MovieModel): string {
    return movie.movieGenres.map(g => g.genre.name).join(', ');
  }

  getFirstActorName(movie: MovieModel): string {
    return movie.movieActors.length > 0 ? movie.movieActors[0].actor.name : 'N/A';
  }

}