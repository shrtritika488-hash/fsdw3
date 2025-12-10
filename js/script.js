const API_URL = "http://localhost:3000/movies";

const movieListDiv = document.getElementById("movie-list");
const searchInput = document.getElementById("search-input");
const form = document.getElementById("add-movie-form");

let allMovies = [];

// DISPLAY MOVIES
function renderMovies(movies) {
    movieListDiv.innerHTML = "";

    if (movies.length === 0) {
        movieListDiv.innerHTML = "<p>No movies found.</p>";
        return;
    }

    movies.forEach(m => {
        const div = document.createElement("div");
        div.className = "movie-item";
        div.innerHTML = `
            <p><strong>${m.title}</strong> (${m.year}) - ${m.genre}</p>
            <button onclick="editMovie(${m.id}, '${m.title}', ${m.year}, '${m.genre}')">Edit</button>
            <button onclick="deleteMovie(${m.id})">Delete</button>
        `;
        movieListDiv.appendChild(div);
    });
}

// GET MOVIES
function fetchMovies() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            allMovies = data;
            renderMovies(allMovies);
        })
        .catch(err => console.error("Server not running SISOOO:", err));
}

fetchMovies();

// SEARCH
searchInput.addEventListener("input", () => {
    let term = searchInput.value.toLowerCase();
    let filtered = allMovies.filter(m =>
        m.title.toLowerCase().includes(term) ||
        m.genre.toLowerCase().includes(term)
    );
    renderMovies(filtered);
});

// ADD MOVIE
form.addEventListener("submit", e => {
    e.preventDefault();

    const newMovie = {
        title: document.getElementById("title").value,
        genre: document.getElementById("genre").value,
        year: parseInt(document.getElementById("year").value)
    };

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMovie)
    })
        .then(res => res.json())
        .then(() => {
            form.reset();
            fetchMovies();
        });
});

// EDIT MOVIE
function editMovie(id, title, year, genre) {
    let newTitle = prompt("New Title:", title);
    let newYear = prompt("New Year:", year);
    let newGenre = prompt("New Genre:", genre);

    if (!newTitle || !newYear || !newGenre) return;

    fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id,
            title: newTitle,
            year: parseInt(newYear),
            genre: newGenre
        })
    }).then(() => fetchMovies());
}

// DELETE MOVIE
function deleteMovie(id) {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
        .then(() => fetchMovies());
}
