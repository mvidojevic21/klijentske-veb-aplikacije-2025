import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { MovieModel } from '../../models/movie.model';
import { NgIf } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { MatButtonModule } from '@angular/material/button';
import { UtilsService } from '../../services/utils.service';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-search',
  imports: [MatTableModule, NgIf, MatButtonModule, RouterLink],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  displayedColumns: string[] = ['movieId', 'title', 'shortDescription', 'startDate','runTime','createdAt', 'actions'];
  dataSource: any | null = null;


  public constructor(public utils: UtilsService) {
    MovieService.getMovies().then(rsp=> this.dataSource = rsp.data)
  }

}
