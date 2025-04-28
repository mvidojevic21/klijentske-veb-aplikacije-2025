import { Component } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { JsonPipe, NgFor, NgIf, } from '@angular/common';
import { AxiosError } from 'axios';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MovieModel } from '../../models/movie.model';
import { UtilsService } from '../../services/utils.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [JsonPipe, NgIf, NgFor, MatButtonModule, MatCardModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  public movies: any[] | null = null
  public error: string | null = null
  

  constructor(public utils: UtilsService) {
    MovieService.getMovies()
      .then(rsp => this.movies = rsp.data)
      .catch((e: AxiosError) => this.error = `${e.code}: ${e.message}`)

  }

  
  


}
