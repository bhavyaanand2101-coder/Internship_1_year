/* ==========================================================================
   GOURMET FINDER - APPLICATION JAVASCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // Select DOM Elements
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const randomBtn = document.getElementById("randomBtn");
    const categoriesContainer = document.getElementById("categoriesContainer");
    const recipeContainer = document.getElementById("recipeContainer");
    const message = document.getElementById("message");
    
    // Favorites Drawer Elements
    const favsToggleBtn = document.getElementById("favsToggleBtn");
    const favsBadge = document.getElementById("favsBadge");
    const favsDrawer = document.getElementById("favsDrawer");
    const favsDrawerBackdrop = document.getElementById("favsDrawerBackdrop");
    const closeDrawerBtn = document.getElementById("closeDrawerBtn");
    const favsListContainer = document.getElementById("favsListContainer");
    
    // Modal Elements
    const recipeModal = document.getElementById("recipeModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const recipeImage = document.getElementById("recipeImage");
    const recipeCategory = document.getElementById("recipeCategory");
    const recipeArea = document.getElementById("recipeArea");
    const recipeTitle = document.getElementById("recipeTitle");
    const modalFavBtn = document.getElementById("modalFavBtn");
    const ingredientsList = document.getElementById("ingredientsList");
    const recipeInstructions = document.getElementById("recipeInstructions");
    const videoContainer = document.getElementById("videoContainer");
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabPanels = document.querySelectorAll(".tab-panel");

    // Application State
    let favorites = JSON.parse(localStorage.getItem("gourmet_favorites")) || [];
    let currentActiveRecipe = null;

    /* ==========================================================================
       INITIALIZATION
       ========================================================================== */
    function init() {
        // Setup Search Actions
        searchBtn.addEventListener("click", () => searchRecipes(searchInput.value.trim()));
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                searchRecipes(searchInput.value.trim());
            }
        });

        // Surprise Me Action
        randomBtn.addEventListener("click", fetchRandomRecipe);

        // Category Pills Click Handlers
        if (categoriesContainer) {
            categoriesContainer.addEventListener("click", (e) => {
                const pill = e.target.closest(".category-pill");
                if (!pill) return;

                // Deactivate all pills, activate selected
                document.querySelectorAll(".category-pill").forEach(p => p.classList.remove("active"));
                pill.classList.add("active");

                const category = pill.getAttribute("data-category");
                if (category === "All") {
                    searchRecipes("Chicken"); // default search text
                } else {
                    fetchByCategory(category);
                }
            });
        }

        // Drawer Controls
        favsToggleBtn.addEventListener("click", openDrawer);
        closeDrawerBtn.addEventListener("click", closeDrawer);
        favsDrawerBackdrop.addEventListener("click", closeDrawer);

        // Modal Close Controls
        closeModalBtn.addEventListener("click", closeModal);
        recipeModal.querySelector(".modal-backdrop").addEventListener("click", closeModal);

        // Modal Fav Button
        modalFavBtn.addEventListener("click", () => {
            if (currentActiveRecipe) {
                toggleFavorite(currentActiveRecipe);
                updateModalFavButtonState();
            }
        });

        // Modal Tab Navigation
        tabButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const targetTab = btn.getAttribute("data-tab");
                
                // Toggle Tab Buttons active state
                tabButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                // Toggle Tab Panels active state
                tabPanels.forEach(panel => {
                    if (panel.id === `tab-${targetTab}`) {
                        panel.classList.add("active");
                    } else {
                        panel.classList.remove("active");
                    }
                });
            });
        });

        // Initial render of bookmarks list & badge
        updateFavoritesBadge();
        renderFavoritesList();

        // Load a default recipe list on page load
        searchInput.value = "Chicken";
        searchRecipes("Chicken");
        searchInput.focus();
    }

    /* ==========================================================================
       API FETCH ACTIONS
       ========================================================================== */
    
    // Search recipes by query
    async function searchRecipes(query) {
        if (!query) {
            alert("Please enter a search query.");
            return;
        }

        showSkeletonLoader();
        clearMessage();

        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
            const data = await response.json();
            
            if (data.meals) {
                displayRecipes(data.meals);
            } else {
                showMessage(`No recipes found for "${query}". Try searching for another meal!`);
                recipeContainer.innerHTML = "";
            }
        } catch (error) {
            console.error("Error searching recipes:", error);
            showMessage("Something went wrong while loading recipes. Please check your internet connection.");
            recipeContainer.innerHTML = "";
        }
    }

    // Filter recipes by category
    async function fetchByCategory(category) {
        showSkeletonLoader();
        clearMessage();

        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
            const data = await response.json();
            
            if (data.meals) {
                // The category filter doesn't return full meal properties (no strCategory, strArea, etc.)
                // We add category detail so the card layout can render it nicely.
                const updatedMeals = data.meals.map(meal => ({
                    ...meal,
                    strCategory: category,
                    strArea: "Discover details"
                }));
                displayRecipes(updatedMeals);
            } else {
                showMessage(`No recipes found in the category "${category}".`);
                recipeContainer.innerHTML = "";
            }
        } catch (error) {
            console.error("Error fetching category:", error);
            showMessage("Failed to load recipes. Please try again.");
            recipeContainer.innerHTML = "";
        }
    }

    // Fetch random recipe (Surprise Me)
    async function fetchRandomRecipe() {
        showMessage("Rolling the dice for a surprise recipe...", true);

        try {
            const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
            const data = await response.json();
            
            if (data.meals && data.meals[0]) {
                const recipe = data.meals[0];
                clearMessage();
                // Show directly in Modal
                openRecipeDetails(recipe);
            }
        } catch (error) {
            console.error("Error fetching random recipe:", error);
            showMessage("Failed to fetch a random recipe. Please try again.");
        }
    }

    // Fetch recipe detail by ID
    async function fetchMealById(idMeal) {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
            const data = await response.json();
            return data.meals ? data.meals[0] : null;
        } catch (error) {
            console.error("Error fetching meal details:", error);
            return null;
        }
    }

    /* ==========================================================================
       RENDERING LOGIC
       ========================================================================== */

    // Render Recipes Grid
    function displayRecipes(recipes) {
        recipeContainer.innerHTML = "";
        
        recipes.forEach(recipe => {
            const card = document.createElement("div");
            card.classList.add("recipe-card");
            card.setAttribute("data-id", recipe.idMeal);

            const isFav = isFavorited(recipe.idMeal);

            card.innerHTML = `
                <button class="card-bookmark-btn ${isFav ? 'active' : ''}" title="Bookmark recipe">
                    <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
                </button>
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" loading="lazy">
                <div class="recipe-info">
                    <h2>${recipe.strMeal}</h2>
                    <div class="recipe-meta-rows">
                        <p><i class="fa-solid fa-utensils"></i> Category: <span>${recipe.strCategory || 'General'}</span></p>
                        <p><i class="fa-solid fa-globe"></i> Cuisine: <span>${recipe.strArea || 'International'}</span></p>
                    </div>
                    <button class="view-btn">
                        <span>View Recipe</span> <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            `;

            // Card Event Listeners
            const bookmarkBtn = card.querySelector(".card-bookmark-btn");
            bookmarkBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                toggleFavorite(recipe);
                // Toggle card styling
                bookmarkBtn.classList.toggle("active");
                const icon = bookmarkBtn.querySelector("i");
                if (bookmarkBtn.classList.contains("active")) {
                    icon.className = "fa-solid fa-bookmark";
                } else {
                    icon.className = "fa-regular fa-bookmark";
                }
            });

            const viewBtn = card.querySelector(".view-btn");
            viewBtn.addEventListener("click", async () => {
                // If it's a minimal object (from category list), fetch full details
                if (!recipe.strInstructions) {
                    viewBtn.disabled = true;
                    viewBtn.innerHTML = `<span>Loading...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
                    
                    const fullRecipe = await fetchMealById(recipe.idMeal);
                    
                    viewBtn.disabled = false;
                    viewBtn.innerHTML = `<span>View Recipe</span> <i class="fa-solid fa-arrow-right"></i>`;
                    
                    if (fullRecipe) {
                        openRecipeDetails(fullRecipe);
                    } else {
                        alert("Could not load details for this recipe. Please try again.");
                    }
                } else {
                    openRecipeDetails(recipe);
                }
            });

            recipeContainer.appendChild(card);
        });
    }

    // Show skeleton loaders in recipe list
    function showSkeletonLoader() {
        recipeContainer.innerHTML = Array(8).fill(0).map(() => `
            <div class="skeleton-card">
                <div class="skeleton-img"></div>
                <div class="skeleton-info">
                    <div class="skeleton-text title"></div>
                    <div class="skeleton-text"></div>
                    <div class="skeleton-text short"></div>
                    <div class="skeleton-text btn"></div>
                </div>
            </div>
        `).join('');
    }

    /* ==========================================================================
       MODAL VIEW MANAGEMENT
       ========================================================================== */
    
    // Open modal with recipe details
    function openRecipeDetails(recipe) {
        currentActiveRecipe = recipe;

        // Reset Active Tab
        tabButtons.forEach(btn => {
            if (btn.getAttribute("data-tab") === "ingredients") btn.classList.add("active");
            else btn.classList.remove("active");
        });
        tabPanels.forEach(panel => {
            if (panel.id === "tab-ingredients") panel.classList.add("active");
            else panel.classList.remove("active");
        });

        // Set Main Elements
        recipeTitle.textContent = recipe.strMeal;
        recipeImage.src = recipe.strMealThumb;
        recipeImage.alt = recipe.strMeal;
        recipeCategory.textContent = recipe.strCategory || "General";
        recipeArea.textContent = recipe.strArea || "International";

        // Set Favorite Button State
        updateModalFavButtonState();

        // Populate Ingredients Checklist
        ingredientsList.innerHTML = "";
        for (let i = 1; i <= 20; i++) {
            const ingredient = recipe[`strIngredient${i}`];
            const measure = recipe[`strMeasure${i}`];

            if (ingredient && ingredient.trim() !== "") {
                const li = document.createElement("li");
                li.textContent = `${ingredient.trim()} ${measure ? `- ${measure.trim()}` : ''}`;
                
                // Toggle checked state on click
                li.addEventListener("click", () => {
                    li.classList.toggle("checked");
                });

                ingredientsList.appendChild(li);
            }
        }

        // Populate Instructions
        recipeInstructions.innerHTML = "";
        const instructions = recipe.strInstructions;
        if (instructions) {
            // Split by paragraph double newlines or single newlines to format nicely
            const paragraphs = instructions.split(/\r?\n\r?\n/);
            
            paragraphs.forEach((para, idx) => {
                if (para.trim()) {
                    const stepDiv = document.createElement("div");
                    stepDiv.classList.add("instruction-step");
                    stepDiv.innerHTML = `<strong>Step ${idx + 1}:</strong><br>${para.trim()}`;
                    recipeInstructions.appendChild(stepDiv);
                }
            });
        } else {
            recipeInstructions.innerHTML = "<p>No instructions available.</p>";
        }

        // Populate YouTube Video
        videoContainer.innerHTML = "";
        const embedUrl = getYoutubeEmbedUrl(recipe.strYoutube);
        
        if (embedUrl) {
            videoContainer.innerHTML = `
                <iframe src="${embedUrl}" 
                        title="YouTube video player" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                </iframe>
            `;
        } else {
            videoContainer.innerHTML = `
                <div class="no-video-placeholder">
                    <i class="fa-brands fa-youtube"></i>
                    <h3>No video tutorial available</h3>
                    <p>You can follow the step-by-step cooking instructions tab to prepare this meal.</p>
                </div>
            `;
        }

        // Open Modal
        openModal();
    }

    // Update Favorites toggle button inside the modal
    function updateModalFavButtonState() {
        if (!currentActiveRecipe) return;

        const isFav = isFavorited(currentActiveRecipe.idMeal);
        if (isFav) {
            modalFavBtn.classList.add("active");
            modalFavBtn.innerHTML = `<i class="fa-solid fa-bookmark"></i> Bookmarked`;
        } else {
            modalFavBtn.classList.remove("active");
            modalFavBtn.innerHTML = `<i class="fa-regular fa-bookmark"></i> Add to Bookmarks`;
        }
    }

    // Modal Helpers
    function openModal() {
        recipeModal.classList.add("active");
        document.body.style.overflow = "hidden"; // Prevent background scroll
    }

    function closeModal() {
        recipeModal.classList.remove("active");
        document.body.style.overflow = "";
        
        // Stop playing video when modal closes
        videoContainer.innerHTML = "";
        currentActiveRecipe = null;
    }

    /* ==========================================================================
       FAVORITES (BOOKMARKS) DRAWER MANAGEMENT
       ========================================================================== */
    function openDrawer() {
        favsDrawer.classList.add("active");
        favsDrawerBackdrop.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeDrawer() {
        favsDrawer.classList.remove("active");
        favsDrawerBackdrop.classList.remove("active");
        document.body.style.overflow = "";
    }

    function isFavorited(idMeal) {
        return favorites.some(fav => fav.idMeal === idMeal);
    }

    // Add or remove recipe to/from Favorites
    function toggleFavorite(recipe) {
        const index = favorites.findIndex(fav => fav.idMeal === recipe.idMeal);

        if (index > -1) {
            // Remove
            favorites.splice(index, 1);
        } else {
            // Save minimal info required for favorites drawer and re-rendering cards
            favorites.push({
                idMeal: recipe.idMeal,
                strMeal: recipe.strMeal,
                strMealThumb: recipe.strMealThumb,
                strCategory: recipe.strCategory,
                strArea: recipe.strArea
            });
        }

        // Save to LocalStorage
        localStorage.setItem("gourmet_favorites", JSON.stringify(favorites));

        // Update UI
        updateFavoritesBadge();
        renderFavoritesList();
        syncCardBookmarkStates(recipe.idMeal);
    }

    // Sync individual card state after bookmark toggle from drawer or modal
    function syncCardBookmarkStates(idMeal) {
        const cards = recipeContainer.querySelectorAll(`.recipe-card[data-id="${idMeal}"]`);
        const isFav = isFavorited(idMeal);
        
        cards.forEach(card => {
            const btn = card.querySelector(".card-bookmark-btn");
            if (btn) {
                if (isFav) {
                    btn.classList.add("active");
                    btn.querySelector("i").className = "fa-solid fa-bookmark";
                } else {
                    btn.classList.remove("active");
                    btn.querySelector("i").className = "fa-regular fa-bookmark";
                }
            }
        });
    }

    // Update Favorites Header Badge Count
    function updateFavoritesBadge() {
        favsBadge.textContent = favorites.length;
    }

    // Render Favorites Drawer list items
    function renderFavoritesList() {
        if (!favsListContainer) return;

        if (favorites.length === 0) {
            favsListContainer.innerHTML = `
                <div class="empty-favs">
                    <i class="fa-regular fa-bookmark"></i>
                    <p>No saved recipes yet. Click the bookmark icon on any recipe to save it!</p>
                </div>
            `;
            return;
        }

        favsListContainer.innerHTML = "";
        
        favorites.forEach(recipe => {
            const item = document.createElement("div");
            item.classList.add("fav-item");
            item.setAttribute("data-id", recipe.idMeal);

            item.innerHTML = `
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <div class="fav-item-details">
                    <h4>${recipe.strMeal}</h4>
                    <p>${recipe.strCategory || 'General'} • ${recipe.strArea || 'International'}</p>
                </div>
                <button class="fav-item-delete" title="Remove bookmark">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;

            // Open from Favorite drawer item click
            item.addEventListener("click", async (e) => {
                // If trash button clicked, do not open details
                if (e.target.closest(".fav-item-delete")) return;

                closeDrawer();
                showMessage("Loading recipe details...", true);

                const fullRecipe = await fetchMealById(recipe.idMeal);
                clearMessage();
                if (fullRecipe) {
                    openRecipeDetails(fullRecipe);
                } else {
                    alert("Could not load details for this recipe. Please try again.");
                }
            });

            // Trash action
            const deleteBtn = item.querySelector(".fav-item-delete");
            deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                toggleFavorite(recipe);
                // If modal is active and showing this deleted recipe, update modal button too
                if (currentActiveRecipe && currentActiveRecipe.idMeal === recipe.idMeal) {
                    updateModalFavButtonState();
                }
            });

            favsListContainer.appendChild(item);
        });
    }

    /* ==========================================================================
       UTILITIES & HELPERS
       ========================================================================== */

    // Parse standard YouTube URL into an embed link
    function getYoutubeEmbedUrl(url) {
        if (!url) return null;
        let videoId = "";
        try {
            if (url.includes("v=")) {
                videoId = url.split("v=")[1].split("&")[0];
            } else if (url.includes("youtu.be/")) {
                videoId = url.split("youtu.be/")[1].split("?")[0];
            } else if (url.includes("embed/")) {
                videoId = url.split("embed/")[1].split("?")[0];
            }
            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        } catch (e) {
            console.error("Error parsing YouTube URL:", url, e);
            return null;
        }
    }

    // Show center notification messages (loading or error feedback)
    function showMessage(text, isLoader = false) {
        if (isLoader) {
            message.innerHTML = `
                <div class="spinner"></div>
                <p>${text}</p>
            `;
        } else {
            message.innerHTML = `<p>${text}</p>`;
        }
    }

    function clearMessage() {
        message.innerHTML = "";
    }

    // Run app init
    init();
});