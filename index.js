const API = `http://www.omdbapi.com/?apikey=6e4d25bd&s=`;

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const sort = document.getElementById("filter");

// Event listener for search button click
searchButton.addEventListener("click", searchMovies);

// Event listener for Enter key press in the input
searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    searchMovies();
  }
});

// Event listener for select box change
sort.addEventListener("change", searchMovies);

// Load movies from API
async function searchMovies() {
  const searchQuery = document.getElementById("searchInput").value;
  const resultsWrapper = document.querySelector(".results__wrapper");
  const spinner = document.querySelector(".fa-spinner");
  const sortBy = sort.value;

  document.querySelector("#results").style.display = "none";
  resultsWrapper.classList += " results__loading";
  spinner.style.display = "block";

  try {
    const response = await fetch(`${API}${searchQuery}`);
    const data = await response.json();

    if (data.Response === "True") {
      const movies = data.Search.slice(0, 6);
      if (movies.length > 0) {

        if (sortBy === "A-Z") {
          // Sort movies by title
          movies.sort((a, b) => a.Title.localeCompare(b.Title));
        } else if (sortBy === "YEAR") {
          // Sort movies by release date (newest first)
          movies.sort((a, b) => b.Year.localeCompare(a.Year));
        }

        const movieElements = movies.map(generateMovieElement);
        displayMovies(movieElements);
        document.querySelector("#results").style.display = "flex";
      } else {
        displayError("No movies found.");
      }
    } else {
      displayError("No movies found.");
    }
  } catch (error) {
    displayError("An error occurred: " + error);
  }

  resultsWrapper.classList.remove("results__loading");
  spinner.style.display = "none";
}

//Movie HTML
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

searchMovies();
