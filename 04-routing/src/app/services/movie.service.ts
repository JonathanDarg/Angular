import { Injectable } from '@angular/core';

export interface Movie {
  id: number;
  title: string;
  year: number;
  director: string;
  summary: string;
}

// Holds the movie data used by the routed pages.
// (In a real app this would come from HttpClient, as in folder 03.)
@Injectable({ providedIn: 'root' })
export class MovieService {
  private readonly movies: readonly Movie[] = [
    { id: 1, title: 'The Shawshank Redemption', year: 1994, director: 'Frank Darabont', summary: 'A banker sentenced to life in prison forms an unlikely friendship and quietly holds on to hope over two decades.' },
    { id: 2, title: 'The Godfather', year: 1972, director: 'Francis Ford Coppola', summary: 'The aging head of a crime family hands control to his reluctant youngest son, who is slowly pulled into the business.' },
    { id: 3, title: 'Spirited Away', year: 2001, director: 'Hayao Miyazaki', summary: 'A girl stumbles into a world of spirits and must work in a magical bathhouse to free her parents.' },
    { id: 4, title: 'The Dark Knight', year: 2008, director: 'Christopher Nolan', summary: 'Batman faces the Joker, a criminal mastermind who wants to push Gotham City into chaos.' },
    { id: 5, title: 'Toy Story', year: 1995, director: 'John Lasseter', summary: "A pull-string cowboy doll feels replaced when a flashy space ranger toy arrives in his owner's room." },
    { id: 6, title: 'Jurassic Park', year: 1993, director: 'Steven Spielberg', summary: "Visitors to a theme park of cloned dinosaurs are stranded when the park's security systems fail." },
    { id: 7, title: 'The Matrix', year: 1999, director: 'The Wachowskis', summary: 'A hacker discovers that the world he knows is a simulation and joins a rebellion against the machines running it.' },
    { id: 8, title: 'Back to the Future', year: 1985, director: 'Robert Zemeckis', summary: 'A teenager is sent thirty years into the past in a time-traveling car and must make sure his parents still fall in love.' },
    { id: 9, title: 'Inception', year: 2010, director: 'Christopher Nolan', summary: "A thief who steals secrets from dreams is hired to do the reverse: plant an idea in someone's mind." },
    { id: 10, title: 'Finding Nemo', year: 2003, director: 'Andrew Stanton', summary: "A nervous clownfish crosses the ocean to find his son, who was taken to a dentist's fish tank." },
  ];

  getAll(): readonly Movie[] {
    return this.movies;
  }

  getById(id: number): Movie | undefined {
    return this.movies.find((m) => m.id === id);
  }
}
