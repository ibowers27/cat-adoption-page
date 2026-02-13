/** 
 * Cards Generation Script
 * Ivy Bowers
 */
const cats = [
  { name: "Leo",      age: "2 yrs",  gender: "male",   img: "../assets/catadoptee1.jpeg",   desc: "Leo is energetic and playful, and loves mouse toys and catnip." },
  { name: "Hazel",    age: "8 yrs",  gender: "female", img: "../assets/catadoptee2.jpeg",   desc: "Hazel is a calm senior cat who enjoys sunny window naps and cuddling." },
  { name: "Bundt",    age: "5 yrs",  gender: "male",   img: "../assets/catadoptee3.jpeg",   desc: "Bundt is the sweetest, the perfect lap cat. " },
  { name: "Hugo",     age: "9 mos",  gender: "male",   img: "../assets/catadoptee4.jpeg",   desc: "Hugo is still a curious kitten full of energy, will explore everything!" },
  { name: "Mocha",    age: "3 yrs",  gender: "female", img: "../assets/catadoptee5.jpeg",   desc: "Mocha is independent and quiet, but will warm up over time." },
  { name: "Quincy",   age: "1 yr",   gender: "male",   img: "../assets/catadoptee6.jpeg",   desc: "Quincy is very social and gets along great with other pets." },
  { name: "Snowball", age: "2 yrs",  gender: "female", img: "../assets/catadoptee7.jpeg",   desc: "Snowball is affectionate and loves being the center of attention." },
  { name: "Cheddar",  age: "4 yrs",  gender: "male",   img: "../assets/catadoptee8.jpeg",   desc: "Cheddar is laid-back and easygoing, adapting well to any home." },
  { name: "Binx",     age: "3 mos",  gender: "male",   img: "../assets/catadoptee9.jpeg",   desc: "Binx is a little furball that can be very mischievous, and his big personality shines through." },
];


function createCard(cat) {
  const card = document.createElement("div");
  card.className = "card";

  // Cat image
  const img = document.createElement("img");
  img.src = cat.img;
  img.alt = cat.name;

  // Cat name, gender, and age
  const heading = document.createElement("h3");
  heading.textContent = `${cat.name} [${cat.gender}, ${cat.age}]`;

  // Learn More button
  const learnMoreBtn = document.createElement("button");
  learnMoreBtn.textContent = "Learn More";
  learnMoreBtn.addEventListener("click", () => openModal(cat)); // Add an event listener to make the button functional

  // Favorite/Star button
  const favoriteBtn = document.createElement("button");
  favoriteBtn.className = "favorite-btn";
  favoriteBtn.type = "button";
  favoriteBtn.setAttribute("aria-pressed", "false");
  favoriteBtn.setAttribute("aria-label", "Toggle favorite");
  favoriteBtn.dataset.catName = cat.name;
  favoriteBtn.dataset.catImg = cat.img;

  // Favorites ActionListener/functionality is handled in Darius' code

  const starIcon = document.createElement("i");
  starIcon.className = "fa-regular fa-star";
  starIcon.setAttribute("aria-hidden", "true");
  favoriteBtn.appendChild(starIcon);

  card.appendChild(img);
  card.appendChild(heading);
  card.appendChild(learnMoreBtn);
  card.appendChild(favoriteBtn);

  return card;
}

// Renders all cats from the data array into the #catCard container.
function renderCards() {
  const grid = document.getElementById("catCards");
  if (!grid) return;

  grid.innerHTML = ""; // clear other cards if any

  cats.forEach((cat) => {
    const card = createCard(cat);
    grid.appendChild(card);
  });
}


/**
 * Learn More Buttons w/ Modal
 * Ivy Bowers
 */

function openModal(cat) {
  document.getElementById("modalImg").src = cat.img;
  document.getElementById("modalImg").alt = cat.name;
  document.getElementById("modalName").textContent = cat.name;
  document.getElementById("modalDetails").textContent = cat.desc;

  document.getElementById("catModal").hidden = false;
}

function closeModal() {
  document.getElementById("catModal").hidden = true;
}

/**
 * Newsletter Signup Script
 * Ivy Bowers
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function handleNewsletterSignup() {
  const input = document.getElementById("email");
  const email = input.value.trim();

  if (!email) {
    alert("Please enter an email address.");
    return;
  }

  if (!isValidEmail(email)) {
    alert("Invalid email — make sure it includes '@' and '.' symbols");
    return;
  }

  alert(`✓ Successfully signed up for the mailing list!`);
  input.value = ""; // clear the textbox
}

/**
 * Favorites & Clear History Buttons Script
 * Darius Beckford
 */
(function () {
  const STORAGE_KEY = "darvy_favorites_v1";

  function byId(id) {
    return document.getElementById(id);
  }

  function loadFavorites() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(arr) ? arr : []);
    } catch {
      return new Set();
    }
  }

  function saveFavorites(favoritesSet) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...favoritesSet]));
    } catch {
      // ignore storage errors
    }
  }

  const favorites = loadFavorites();

  function updateFavoritesCountBadge() {
    const badge = byId("favoritesCountBadge");
    if (!badge) return;

    const count = favorites.size;
    badge.textContent = String(count);
    badge.hidden = count === 0;
  }

  function setStarState(buttonEl, isFav) {
    const iconEl = buttonEl.querySelector("i");
    if (!iconEl) return;

    buttonEl.setAttribute("aria-pressed", String(isFav));
    iconEl.classList.toggle("fa-solid", isFav);
    iconEl.classList.toggle("fa-regular", !isFav);
  }

  function syncAllStars() {
    document.querySelectorAll(".favorite-btn[data-cat-name]").forEach((btn) => {
      const name = btn.dataset.catName;
      setStarState(btn, favorites.has(name));
    });
  }

  function renderFavorites() {
    const list = byId("favoritesList");
    const empty = byId("favoritesEmpty");
    if (!list || !empty) return;

    list.innerHTML = "";

    if (favorites.size === 0) {
      empty.hidden = false;
      return;
    }

    empty.hidden = true;

    const imgMap = new Map();
    document
      .querySelectorAll(".favorite-btn[data-cat-name][data-cat-img]")
      .forEach((btn) => {
        imgMap.set(btn.dataset.catName, btn.dataset.catImg);
      });

    [...favorites]
      .sort((a, b) => a.localeCompare(b))
      .forEach((name) => {
        const chip = document.createElement("div");
        chip.className = "favorite-chip";

        const imgSrc = imgMap.get(name);
        if (imgSrc) {
          const img = document.createElement("img");
          img.src = imgSrc;
          img.alt = name;
          chip.appendChild(img);
        }

        const text = document.createElement("span");
        text.textContent = name;
        chip.appendChild(text);

        list.appendChild(chip);
      });
  }

  function toggleFavoritesPanel(show) {
    const panel = byId("favoritesPanel");
    const toggleBtn = byId("catsFavoritesBtn");
    if (!panel || !toggleBtn) return;

    panel.hidden = !show;
    toggleBtn.setAttribute("aria-expanded", String(show));

    if (show) {
      renderFavorites();
    }
  }

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const catsBtn = target.closest("#catsFavoritesBtn");
    if (catsBtn) {
      event.preventDefault();
      const panel = byId("favoritesPanel");
      toggleFavoritesPanel(panel ? panel.hidden : true);
      return;
    }

    const clearBtn = target.closest("#clearFavoritesBtn");
    if (clearBtn) {
      event.preventDefault();
      favorites.clear();
      saveFavorites(favorites);
      syncAllStars();
      renderFavorites();
      updateFavoritesCountBadge();
      return;
    }

    const favBtn = target.closest(".favorite-btn");
    if (!favBtn) return;

    event.preventDefault();

    const name = favBtn.dataset.catName;
    if (!name) return;

    const nextFav = !favorites.has(name);
    if (nextFav) favorites.add(name);
    else favorites.delete(name);

    saveFavorites(favorites);
    setStarState(favBtn, nextFav);
    renderFavorites();
    updateFavoritesCountBadge();
  });

  document.addEventListener("DOMContentLoaded", () => {
    renderCards(); // populate the cat cards

    // Stars/Favorites
    syncAllStars();
    renderFavorites();
    updateFavoritesCountBadge();

    // Modal
    document.getElementById("modalCloseBtn").addEventListener("click", closeModal);
    document.getElementById("catModal").addEventListener("click", (e) => {
      if (e.target.id === "catModal") closeModal();
    });

    // Newsletter
    document.querySelector(".news-letter-container button").addEventListener("click", handleNewsletterSignup);
    document.getElementById("email").addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleNewsletterSignup();
    });
  });
})();