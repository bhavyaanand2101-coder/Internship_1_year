/*
 * OMDB API config
 * Replace API_KEY with your own from: https://www.omdbapi.com/apikey.aspx
 */
const API_KEY = "b5382e81";
const BASE_URL = "https://www.omdbapi.com/";

/* App state dictionary storing query string, query results, and favorites Set */
let state = {
    search: "",
    results: [],
    allResults: [],
    lastQuery: "",
    favs: new Set()
};

/* DOM elements references selection */
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const movieGrid = document.getElementById("movieGrid");
const statsBar = document.getElementById("statsBar");
const sectionLabel = document.getElementById("sectionLabel");
const statCount = document.getElementById("statCount");
const statQuery = document.getElementById("statQuery");
const sortSel = document.getElementById("sortSel");
const backdrop = document.getElementById("modalBackdrop");
const closeBtn = document.getElementById("closeBtn");
const closeBtn2 = document.getElementById("closeBtn2");

/* ── Quick search tags ── */
// Attaches event listeners on predefined tag buttons to trigger fast searches
document.querySelectorAll(".quick-tag").forEach(tag => {
    tag.addEventListener("click", () => {
        searchInput.value = tag.dataset.q;
        state.search = tag.dataset.q;
        doSearch();
    });
});

/* ── Sort Results ── */
// Sorts stored movies array based on dropdown value (Newest/Oldest release, Alphabetical Title)
sortSel.addEventListener("change", () => {
    const v = sortSel.value;
    let arr = [...state.allResults];
    if (v === "year_desc") arr.sort((a, b) => (b.Year || "").localeCompare(a.Year || ""));
    if (v === "year_asc") arr.sort((a, b) => (a.Year || "").localeCompare(b.Year || ""));
    if (v === "title") arr.sort((a, b) => a.Title.localeCompare(b.Title));
    state.results = arr;
    renderGrid();
});

/* ════════════════════════════════════════
   SEARCH API CALL
   Queries the OMDB API using search parameters
   URL layout: s=query for search list
════════════════════════════════════════ */
async function doSearch() {
    const q = (state.search || "").trim();
    if (!q) return;

    // Display loading spinner state
    movieGrid.innerHTML = `
<div class="status">
<div class="spinner"></div>
<h3>Searching…</h3>
<p>Looking for "${q}"</p>
</div>`;
    statsBar.classList.remove("visible");
    sectionLabel.style.display = "none";

    try {
        // Fetch matching movies from the OMDB API
        const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&type=movie&s=${encodeURIComponent(q)}`);
        const data = await res.json();

        state.allResults = data.Search || [];
        state.results = [...state.allResults];
        state.lastQuery = q;
        sortSel.value = "default"; // Reset sorting choice
        renderGrid();

    } catch (err) {
        // Render network failures warning
        movieGrid.innerHTML = `
<div class="status">
  <div class="status-icon">&#x26A0;</div>
  <h3>Network error</h3>
  <p>Check your API key or internet connection.</p>
</div>`;
    }
}

/* ════════════════════════════════════════
   RENDER GRID
   Builds card items markup matching results
════════════════════════════════════════ */
function renderGrid() {
    // If search returns no results
    if (!state.results || state.results.length === 0) {
        statsBar.classList.remove("visible");
        sectionLabel.style.display = "none";
        movieGrid.innerHTML = `
<div class="status">
  <div class="status-icon">&#128270;</div>
  <h3>No results found</h3>
  <p>Try a different search term</p>
</div>`;
        return;
    }

    statsBar.classList.add("visible");
    sectionLabel.style.display = "block";
    statCount.textContent = state.results.length;
    statQuery.textContent = state.lastQuery;

    // Build movie cards
    movieGrid.innerHTML = state.results.map(m => {
        const hasPoster = m.Poster && m.Poster !== "N/A";
        const isFav = state.favs.has(m.imdbID);
        return `
<div class="movie-card" data-id="${m.imdbID}" tabindex="0" role="button" aria-label="${m.Title}">
  <div class="poster-wrap">
    ${hasPoster
                ? `<img src="${m.Poster}" alt="${m.Title} poster" loading="lazy">`
                : `<div class="no-poster">
           <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
             <rect x="3" y="3" width="18" height="18" rx="2"/><path d="m3 9 5-5 4 4 3-3 4 4"/>
           </svg>
           No poster
         </div>`
            }
    <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${m.imdbID}" aria-label="Favourite">&#9829;</button>
  </div>
  <div class="card-body">
    <div class="card-title">${m.Title}</div>
    <div class="card-meta">
      <span>${m.Year || "—"}</span>
      <span class="card-type">${(m.Type || "movie").toUpperCase()}</span>
    </div>
  </div>
</div>`;
    }).join("");

    /* Attach click event to cards to open detail modal dialog view */
    movieGrid.querySelectorAll(".movie-card").forEach(card => {
        card.addEventListener("click", e => {
            if (e.target.closest(".fav-btn")) return;
            openDetail(card.dataset.id);
        });
        card.addEventListener("keydown", e => {
            if (e.key === "Enter") openDetail(card.dataset.id);
        });
    });

    /* Toggle favorite set tracking when heart button clicked */
    movieGrid.querySelectorAll(".fav-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            e.stopPropagation(); // Avoid opening movie detail modal on click
            const id = btn.dataset.id;
            if (state.favs.has(id)) state.favs.delete(id);
            else state.favs.add(id);
            btn.classList.toggle("active", state.favs.has(id));
        });
    });
}

/* ── Open movie detail modal ── */
async function openDetail(imdbID) {
    backdrop.classList.add("open");
    // Show spinner inside modal during detail retrieval
    document.getElementById("modal").innerHTML = `
<button class="modal-close" id="closeBtn" aria-label="Close">&#x2715;</button>
<div style="padding:5rem; text-align:center;">
<div class="spinner" style="margin:0 auto 1rem;"></div>
<p style="color:var(--text3);font-size:14px;">Loading details…</p>
</div>`;
    document.getElementById("closeBtn").addEventListener("click", closeModal);

    try {
        // Fetch detailed movie by specific imdb ID
        const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`);
        const m = await res.json();

        const hasPoster = m.Poster && m.Poster !== "N/A";

        /* Generate custom percentage rating bars from different sources */
        let ratingsBarsHtml = "";
        if (m.Ratings && m.Ratings.length > 0) {
            ratingsBarsHtml = `
  <div class="ratings-section">
    <div class="ratings-title">Ratings</div>
    ${m.Ratings.map(r => {
                let pct = 0;
                if (r.Value.includes("/10")) pct = (parseFloat(r.Value) / 10) * 100;
                else if (r.Value.includes("/100")) pct = parseFloat(r.Value);
                else if (r.Value.includes("%")) pct = parseFloat(r.Value);
                return `
        <div class="rating-bar-row">
          <div class="rating-bar-label">${r.Source.replace("Internet Movie Database", "IMDb").replace("Rotten Tomatoes", "Rotten T.")}</div>
          <div class="rating-bar-track">
            <div class="rating-bar-fill" style="width:${Math.min(pct, 100).toFixed(0)}%"></div>
          </div>
          <div class="rating-bar-val">${r.Value}</div>
        </div>`;
            }).join("")}
  </div>`;
        }

        /* Build Badge chips (IMDb Rating, Year, Runtime, Rated) */
        const badges = [
            m.imdbRating && m.imdbRating !== "N/A"
                ? `<span class="badge badge-rating">&#9733; ${m.imdbRating}/10</span>` : "",
            m.Year && m.Year !== "N/A"
                ? `<span class="badge badge-year">&#128197; ${m.Year}</span>` : "",
            m.Runtime && m.Runtime !== "N/A"
                ? `<span class="badge badge-runtime">&#9201; ${m.Runtime}</span>` : "",
            m.Rated && m.Rated !== "N/A"
                ? `<span class="badge badge-rated">${m.Rated}</span>` : "",
        ].filter(Boolean).join("");

        /* Build Genre pill tags */
        const genres = (m.Genre || "").split(",").map(g => g.trim()).filter(Boolean)
            .map(g => `<span class="genre-pill">${g}</span>`).join("");

        /* Build detailed information table rows */
        const infoRows = [
            ["Director", m.Director],
            ["Cast", m.Actors],
            ["Country", m.Country],
            ["Language", m.Language],
            ["Awards", m.Awards],
            ["Box Office", m.BoxOffice],
        ].filter(([, v]) => v && v !== "N/A")
            .map(([l, v]) => `
  <div class="info-cell">
    <div class="info-label">${l}</div>
    <div class="info-value">${v}</div>
  </div>`).join("");

        // Populate detail modal content HTML
        document.getElementById("modal").innerHTML = `
<button class="modal-close" id="closeBtn" aria-label="Close">&#x2715;</button>

<div class="modal-banner">
  ${hasPoster ? `<img class="banner-img" src="${m.Poster}" alt="" />` : ""}
  <div class="modal-banner-overlay"></div>
</div>

<div class="modal-body">
  <div class="modal-poster">
    ${hasPoster
                ? `<img src="${m.Poster}" alt="${m.Title} poster">`
                : `<div class="no-poster" style="width:140px;height:200px;border-radius:12px;">No poster</div>`}
  </div>
  <div class="modal-info">
    <div class="modal-title" id="modalTitle">${m.Title}</div>
    ${m.tagline ? `<div class="modal-tagline">${m.tagline}</div>` : ""}

    <div class="modal-badges">${badges}</div>
    <div class="genre-list">${genres}</div>
    ${m.Plot && m.Plot !== "N/A" ? `<div class="modal-plot">${m.Plot}</div>` : ""}
    <div class="info-grid">${infoRows}</div>
    ${ratingsBarsHtml}

    <div class="modal-actions">
      ${m.imdbID ? `<button class="btn-primary" onclick="window.open('https://www.imdb.com/title/${m.imdbID}','_blank')">View on IMDb</button>` : ""}
      <button class="btn-outline" onclick="closeModal()">&#x2190; Back to results</button>
    </div>
  </div>
</div>`;

        document.getElementById("closeBtn").addEventListener("click", closeModal);

    } catch (err) {
        document.getElementById("modal").innerHTML = `
<button class="modal-close" id="closeBtn">&#x2715;</button>
<div style="padding:3rem;text-align:center;color:var(--text3);">
  <p>Could not load movie details.</p>
</div>`;
        document.getElementById("closeBtn").addEventListener("click", closeModal);
    }
}

/* ── Close modal ── */
function closeModal() {
    backdrop.classList.remove("open");
}

/* Click outside modal area backdrop to close */
backdrop.addEventListener("click", e => {
    if (e.target === backdrop) closeModal();
});

/* Bind Escape keyboard button to close details modal */
document.addEventListener("keydown", e => {
    if (e.key === "Escape" && backdrop.classList.contains("open")) closeModal();
});

/* ── Bind Search events ── */
searchBtn.addEventListener("click", doSearch);
searchInput.addEventListener("input", e => { state.search = e.target.value; });
searchInput.addEventListener("keydown", e => { if (e.key === "Enter") doSearch(); });

/* ── Initial load (Fetch default list showing 'Spider-Man' movies on startup) ── */
(async () => {
    try {
        const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&type=movie&s=spider`);
        const data = await res.json();
        state.allResults = data.Search || [];
        state.results = [...state.allResults];
        state.lastQuery = "Spider-Man";
        renderGrid();
    } catch (err) {
        movieGrid.innerHTML = `
<div class="status">
  <div class="status-icon">&#x26A0;</div>
  <h3>Could not load movies</h3>
  <p>Check your connection and API key.</p>
</div>`;
    }
})();