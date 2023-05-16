// API http://www.omdbapi.com/?apikey=6e4d25bd&s=fast

const movieSearch = document.querySelector("#searchInput");
const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");

// load movies from API
async function searchMovies() {
  const searchQuery = document.getElementById("searchInput").value;

  const resultsWrapper = document.querySelector(".results__wrapper");
  const spinner = document.querySelector(".fa-spinner");

  document.querySelector("#results").style.display = "none";
  resultsWrapper.classList += " results__loading";
  spinner.style.display = "block";

  try {
    const response = await fetch(
      `http://www.omdbapi.com/?apikey=6e4d25bd&s=${searchQuery}`
    );
    const data = await response.json();

    if (data.Response === "True") {
      const movies = data.Search;
      if (movies && movies.length > 0) {
        const movieElements = movies
          .slice(0, 6)
          .map((movie) => generateMovieElement(movie));
        // setTimeout(() => {
          displayMovies(movieElements);
        // }, 2000);
        document.querySelector("#results").style.display = "flex";
      } else {
        displayError("No movies found.");
      }
    } else {
      displayError(data.Error);
    }
  } catch (error) {
    displayError("An error occurred: " + error);
  }

  resultsWrapper.classList.remove("results__loading");
  spinner.style.display = "none";
}

function generateMovieElement(movie) {
  const movieTitle = movie.Title;
  const movieYear = movie.Year;
  const moviePoster = movie.Poster;

  return `
    <div class="movie">
      <figure class="movie--wrapper">
        <img class="movie-poster" src="${moviePoster}" alt="${movieTitle} Poster">
      </figure>
      <div class="movie__description">
        <div class="movie__description--title">${movieTitle}</div>
        <div class="movie__description--year">(${movieYear})</div>
      </div>
    </div>
  `;
}

function displayMovies(movieElements) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = movieElements.join("");
}

function displayError(errorMessage) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = `<p>${errorMessage}</p>`;
}

// Event listener for search button click
searchButton.addEventListener("click", searchMovies);

// Event listener for Enter key press in the input field
searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    searchMovies();
  }
});
