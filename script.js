'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");
const CONTENT = document.querySelector(".content")
const ACTORSLINK = document.querySelector(".Actors-link");
const HOMELINK = document.querySelector(".Home-link");
const MOVIESLINK = document.querySelector(".movies-link");
const dropdown = document.querySelector(".dropdown-content")

const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};

// Fetching all movies

const autorun = async (name) => {
  const movies = await fetchMovies(name);
  renderMovies(movies.results);
};

const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  renderMovie(movieRes);
};

const fetchMovies = async (name) => {
  const url = constructUrl(`movie/${name}`);
  const res = await fetch(url);
  return res.json();
};

const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

const renderMovies = (movies) => {
  const moviesContainer = document.createElement("div");
  moviesContainer.className = "movies-container";

  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.className = "movie-card";

    movieDiv.innerHTML = `
    <div>
        <img class="movie-poster" src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${movie.title} poster">
        <h3 class="movie-title">${movie.title}</h3></div>
        <h3 class="movie-RD">${movie.release_date}</h3></div>
    <div class="overlay">
    <p class="img-description">${movie.title} <br> ${movie.vote_average}</p>
    </div>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    }); 
    moviesContainer.appendChild(movieDiv);
  });
  CONTAINER.appendChild(moviesContainer);
};

const renderMovie = (movie) => {
  CONTAINER.classList.add("container2")

  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
               BACKDROP_BASE_URL + movie.backdrop_path
             }>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${movie.release_date}</p>
            <p id="movie-genre"><b>Genre:</b> ${movie.genres[0].name}</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <p id="movie-language"><b>Language:</b> ${movie.original_language}</p>
            <p id="movie-rating"><b>Rating:</b> ${movie.vote_average}</p>
            <p id="movie-votes"><b>Votes:</b> ${movie.vote_count}</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
            <h3>Produced By:</h3>
            <div>
            <p id ="company-name">${movie.production_companies[0].name}</p>
            <img id="company-logo" src=${BACKDROP_BASE_URL + movie.production_companies[0].logo_path}>
            </div>
            
        </div>
        </div>

            
    </div>`;

    runTrailer(movie);
    runfetchActorsForMovie(movie);
    runRelatedMovies(movie);
    
};

document.addEventListener("DOMContentLoaded", autorun("now_playing"));

// fetching related movies

const fetchRelatedMovies = async (movie) => {
  const url = constructUrl(`movie/${movie.id}/similar`);
  const res = await fetch(url);
  return res.json();
}

const runRelatedMovies = async (movie) => {
  const relMovies = await fetchRelatedMovies(movie);
  renderMovies(relMovies.results);
};

// fetch movie trailer

const fetchTrailer = async (movie) => {
  const url = constructUrl(`movie/${movie.id}/videos`);
  const res = await fetch(url);
  return res.json();
}

const runTrailer = async (movie) => {
  const relMovies = await fetchTrailer(movie);
  renderTrailer(relMovies.results[0].key);
};

const renderTrailer = (key) =>{
  const trailerDiv = document.createElement("div");
  trailerDiv.classList.add("trailer-container")

  trailerDiv.innerHTML = 
  `<h3 class="movie-trailer">Watch the Trailer<h3><br><br>
  <iframe width="420" height="345" src="https://www.youtube.com/embed/${key}"></iframe>`

  CONTAINER.appendChild(trailerDiv);

}

// Fetching Actors

const runActors = async () => {
  const actors = await fetchActors();
  renderActors(actors.results);
};

const actorDetails = async (actor) => {
    const actorRes = await fetchActor(actor.id);
    renderActor(actorRes);
  };

const fetchActors = async () => {
  const url = constructUrl(`person/popular`);
  const res = await fetch(url);
  return res.json();
};

const fetchActor = async (actorId) => {
    const url = constructUrl(`person/${actorId}`);
    const res = await fetch(url);
    return res.json();
  };

const renderActors = (actors) => {
  const actorsDiv = document.createElement("div");
  actorsDiv.classList.add("actors-container")
  actors.map((actor) => {
      const actorDiv = document.createElement("div");
      actorDiv.className = "actor-card"
      actorDiv.innerHTML = `
          <img class="actor-poster" src="${PROFILE_BASE_URL + actor.profile_path}" alt="${actor.name} poster">
          <h3 class = "actor-name">${actor.name}</h3>
          <div class="overlay">
          <h3 class = "view-actor">View Actor Details</h3>
          </div>`;
      actorDiv.addEventListener("click", () => {
        actorDetails(actor);
      });
      actorsDiv.appendChild(actorDiv);
    });
    CONTAINER.appendChild(actorsDiv);
    actorsPageDes();
  };


const actorsPageDes = () => {
  const header = document.querySelector(".description");
  header.innerHTML = "See Popular Actors";
  
}

function checkGender(num){
  if(num == 1){
      return "Female"
  } else if(num == 2){
    return "Male"
  }
}

const renderActor = (actor) => {
    CONTAINER.innerHTML = `
    <div class="row">
    <div class="col-md-4">
         <img id="actor-backdrop" src=${
           PROFILE_BASE_URL + actor.profile_path}>
    </div>
    <div class="col-md-8">
    <h2 id="actor-name">${actor.name} (${checkGender(actor.gender)})</h2>
            <p id="actor-birth-date"><b>BirthDate:</b> ${actor.birthday}</p>
            <p id="actor-popularity"><b>Popularity:</b> ${actor.popularity}</p>
            <h3>Biography:</h3>
            <p id="actor-overview">${actor.biography}</p>
     </div>
     </div>
     </div><br><br><br><br><br>`

     if(actor.deathday != null){
      CONTAINER.innerHTML += `<p id="actor-death-date"><b>DeathDay:</b> ${actor.deathday} </p>`
    }

    runActormovieDetails(actor);
   };

     //FETCH ALL MOVIES OF A CERTAIN ACTOR

const fetchMoviesForActor = async (actorId) => {
    const url = constructUrl(`person/${actorId}/movie_credits`);
    const res = await fetch(url);
    return res.json();
  }

const runActormovieDetails = async (actor) => {
    const ActormovieRes = await fetchMoviesForActor(actor.id);
    renderMoviesofActor(ActormovieRes);
  };

const renderMoviesofActor = (actor) => {
  const moviesContainer = document.createElement("div");
  moviesContainer.className = "movies-container";

     actor.cast.map((cast) => {
      const movieDiv = document.createElement("div");
      movieDiv.className = "movie-card";

     if(cast.backdrop_path != null){
      movieDiv.innerHTML = `
      <div>
          <img class="movie-poster" src="${BACKDROP_BASE_URL + cast.backdrop_path}" alt="${cast.title} poster">
          <h3 class="movie-title">${cast.title}</h3></div>
          <h3 class="movie-RD">${cast.release_date}</h3></div>
      <div class="overlay">
      <p class="img-description">${cast.title} <br> ${cast.vote_average}</p>
      </div>`;
      movieDiv.addEventListener("click", () => {
        movieDetails(cast);
      }); 
      moviesContainer.appendChild(movieDiv);
    }
    });
    CONTAINER.appendChild(moviesContainer);
  };


        //FETCH ACTORS OF A CERTAIN MOVIE

const runfetchActorsForMovie = async (movie) => {
    const ActorsOfmovieRes = await fetchActorsForMovie(movie.id);
    renderActorsofMovie(ActorsOfmovieRes);
  };

const fetchActorsForMovie= async (movieId) => {
    const url = constructUrl(`movie/${movieId}/credits`);
    const res = await fetch(url);
    return res.json();
  }

const renderActorsofMovie = (movie) => {
  const actorsContainer = document.createElement("div");
  actorsContainer.className = "actors-container";
    for(let i=0; i<5; i++){
      const actormovieDiv = document.createElement("div");
      actormovieDiv.className = "actor-card";
      if(movie.cast[i].profile_path != null){
         actormovieDiv.innerHTML = `
              <img class="actor-poster" src="${PROFILE_BASE_URL + movie.cast[i].profile_path}" alt="Actor poster">
              <h3 class = "actor-name">${movie.cast[i].name}</h3>
              <div class="overlay">
              <h3 class = "view-actor">View Actor Details</h3>
              </div>`;

         }
         actormovieDiv.addEventListener("click", () => {
          actorDetails(movie.cast[i]);
        }); 
         actorsContainer.appendChild(actormovieDiv);
    }
    CONTAINER.appendChild(actorsContainer);
   };


  // NISREEN FINISHED HERE
  
if(ACTORSLINK){
  ACTORSLINK.addEventListener("click", function (e) {
    e.preventDefault();
      CONTAINER.replaceChildren();
        runActors();
    });
}

//loading genres

const runGenres = async () => {
  const genres = await fetchGenres();
  renderGenres(genres.genres);
};

const fetchGenres = async () => {
  const url = constructUrl(`genre/movie/list`);
  const res = await fetch(url);
  return res.json();
};

const renderGenres = (genres) => {

  genres.map((genre) => {
    const genresDiv = document.createElement("a");
    genresDiv.classList.add(genre.id);
    genresDiv.classList.add("genre-link");
    genresDiv.innerHTML = `${genre.name}`;
    dropdown.appendChild(genresDiv);
    genresDiv.addEventListener("click", function(genreID){
      genreID = genre.id;
      CONTAINER.replaceChildren();
      addPageDes(genre.name)
      runMoviesByGenre(genreID);
    });
  });
  
};

document.addEventListener("DOMContentLoaded", runGenres);

// fetching movies with genres

const runMoviesByGenre = async (genreID) => {
  const movies = await fetchMoviesByGenre(genreID);
  renderMovies(movies.results);
};

const fetchMoviesByGenre = async (genreID) => {
  const url = `${TMDB_BASE_URL}/discover/movie?api_key=542003918769df50083a13c415bbc602&with_genres=${genreID}`
  const res = await fetch(url);
  return res.json();
};


// fetching movies by filter

const filters = [
  {id: 1, name: "popular", name2:"Popular"},
  {id: 2, name: "top_rated", name2: "Top Rated"},
  {id: 3, name: "now_playing", name2: "Now Playing"},
  {id:4, name: "upcoming", name2: "Upcoming"}
]

const filtering = () => {
  filters.map((filter) => {
    const f= document.querySelector(`#filter${filter.id}`);
    f.addEventListener("click", function(e){
      e.preventDefault();
      CONTAINER.replaceChildren();
      autorun(filter.name);
      addPageDes(filter.name2);
      console.log(f)
    });
  });
}

const addPageDes = (name) => {
  const des = document.querySelector(".description");
  des.innerHTML = `See ${name} Movies`
}

document.addEventListener("DOMContentLoaded", filtering);
document.addEventListener("DOMContentLoaded", addPageDes("Now Playing"));


// searching for movies 

const input = document.querySelector(".searchTerm");
const btn = document.querySelector(".searchButton");

input.addEventListener('input', function(e){
  e.preventDefault();
  CONTAINER.replaceChildren();
  runSearchMovies(input.value);
})

const runSearchMovies = async (keyword) => {
  const movies = await fetchMoviesBySearch(keyword);
  renderMovies(movies.results);
};

const fetchMoviesBySearch = async (keyword) => {
  const url = `${TMDB_BASE_URL}/search/movie?api_key=542003918769df50083a13c415bbc602&query=${keyword}`
  const res = await fetch(url);
  return res.json();
};

// searching for Actors

input.addEventListener('input', function(e){
  e.preventDefault();
  CONTAINER.replaceChildren();
  runSearchActors(input.value);
})

const runSearchActors = async (keyword) => {
  const actors = await fetchActorsBySearch(keyword);
  renderActors(actors.results);
};

const fetchActorsBySearch = async (keyword) => {
  const url = `${TMDB_BASE_URL}/search/person?api_key=542003918769df50083a13c415bbc602&query=${keyword}`
  const res = await fetch(url);
  return res.json();
};


// The end
