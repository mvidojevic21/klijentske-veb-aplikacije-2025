import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MovieModel } from '../../models/movie.model';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-search',
  imports: [MatTableModule, NgIf, NgFor, MatButtonModule, 
    DatePipe, RouterLink, MatInputModule, 
    MatFormFieldModule, FormsModule, MatCardModule,
    MatSelectModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  displayedColumns: string[] = ['movieId', 'title', 'shortDescription', 'genre', 'runtime', 'director', 'actors', 'createdAt', 'startDate', 'actions'];
  allData: MovieModel[] | null = null;
  dataSource: MovieModel[] | null = null;
  selectedGenre: string | null = null;
  selectedDesc: string | null = null;
  dateFrom: string | null = null;
  dateTo: string | null = null;
  userInput = '';
  directorInput = '';
  filteredGenres: string[] = []; 

  public constructor() {
    MovieService.getMovies().then(rsp => {
      this.allData = rsp.data.slice(0, 15);
      this.dataSource = rsp.data.slice(0, 15);
      this.updateGenreList(); 
    });
  }

  getGenres(movie: MovieModel): string {
    return movie.movieGenres.map(g => g.genre.name).join(', ');
  }

  getActors(movie: MovieModel): string {
    return movie.movieActors.map(a => a.actor.name).join(', ');
  }

  private updateGenreList() { 
    if (!this.dataSource) return;
    const genresSet = new Set<string>();
    this.dataSource.forEach(movie => {
      movie.movieGenres.forEach(g => genresSet.add(g.genre.name));
    });
    this.filteredGenres = Array.from(genresSet);
  }

  public applyFilters() {
    if (!this.allData) return;
    let filteredData = this.allData;

    if (this.userInput) {
      const searchTerm = this.userInput.toLowerCase();
      filteredData = filteredData.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm) ||
        movie.movieGenres.some(g => g.genre.name.toLowerCase().includes(searchTerm))
      );
    }

    if (this.selectedGenre) {
      filteredData = filteredData.filter(movie =>
        movie.movieGenres.some(g => g.genre.name === this.selectedGenre)
      );
    }

    if (this.selectedDesc) {
      const descTerm = this.selectedDesc.toLowerCase();
      filteredData = filteredData.filter(movie =>
        movie.shortDescription.toLowerCase().includes(descTerm)
      );
    }

    if (this.directorInput) {
      const directorTerm = this.directorInput.toLowerCase();
      filteredData = filteredData.filter(movie =>
        movie.director.name.toLowerCase().includes(directorTerm)
      );
    }

    if (this.dateFrom) {
      const fromDate = new Date(this.dateFrom);
      filteredData = filteredData.filter(movie => {
        const movieDate = new Date(movie.startDate);
        return movieDate >= fromDate;
      });
    }

    if (this.dateTo) {
      const toDate = new Date(this.dateTo);
      filteredData = filteredData.filter(movie => {
        const movieDate = new Date(movie.startDate);
        return movieDate <= toDate;
      });
    }

    this.dataSource = filteredData;
    this.updateGenreList(); 
  }

  public doSearch(e: any) {
    this.applyFilters();
  }

  public doSelectGenre(event: any) {
    this.applyFilters();
  }

  public doSelectDesc(event: any) {
    this.selectedDesc = event.target.value;
    this.applyFilters();
  }

  public doSelectDate() {
    this.applyFilters();
  }

  public doSelectDirector(event: any) {
    this.applyFilters();
  }

  public doReset() {
    this.userInput = '';
    this.selectedGenre = null;
    this.selectedDesc = null;
    this.dateFrom = null;
    this.dateTo = null;
    this.dataSource = this.allData;
    this.updateGenreList(); 
  }
}