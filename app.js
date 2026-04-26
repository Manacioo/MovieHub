// ===== MOVIEHUB APP =====

let currentPage = 'home';
let prevPage = 'home';
let activeMovieGenre = 'All';
let activeTVGenre = 'All';
let activeHomeGenre = 'All';
let currentWatchItem = null;
let myList = [];
let isLoggedIn = false;
let loggedInUser = { name: '', email: '' };

// ===== HERO SLIDE CONFIG =====
// Uses HERO_SLIDES from data.js
// Each slide: { title, video, poster }
let heroSlideIndex = 0;
let heroSlideTimer = null;
const HERO_SLIDE_INTERVAL = 10000; // 10 seconds

// ===== HERO SLIDES =====
function initHeroSlides() {
  renderHeroSlide(0);
  heroSlideTimer = setInterval(() => {
    heroSlideIndex = (heroSlideIndex + 1) % HERO_SLIDES.length;
    renderHeroSlide(heroSlideIndex);
  }, HERO_SLIDE_INTERVAL);
}

function renderHeroSlide(index) {
  const slide = HERO_SLIDES[index];
  if (!slide) return;

  // Update movie title display
  const titleEl = document.getElementById('hero-movie-title');
  if (titleEl) {
    titleEl.style.opacity = '0';
    setTimeout(() => {
      titleEl.textContent = slide.title;
      titleEl.style.opacity = '1';
    }, 400);
  }

  // Update dot indicators
  document.querySelectorAll('.hero-dot').forEach((d, i) => {
    d.classList.toggle('active', i === index);
  });

  // Switch background video
  switchHeroVideo(slide.video);
}

function goToHeroSlide(index) {
  heroSlideIndex = index;
  renderHeroSlide(index);
  clearInterval(heroSlideTimer);
  heroSlideTimer = setInterval(() => {
    heroSlideIndex = (heroSlideIndex + 1) % HERO_SLIDES.length;
    renderHeroSlide(heroSlideIndex);
  }, HERO_SLIDE_INTERVAL);
}

function switchHeroVideo(src) {
  const video = document.getElementById('hero-video');
  if (!video) return;
  video.classList.remove('loaded');
  video.src = src;
  video.load();
  video.play().catch(() => {});
  video.addEventListener('canplay', () => video.classList.add('loaded'), { once: true });
  video.addEventListener('error', () => { video.style.display = 'none'; }, { once: true });
}


// ===== POSTER GRADIENT COLOURS =====
const POSTER_GRADIENTS = [
  ['#0d1a3a','#1a0a2e'],['#1a0a00','#2e1a00'],['#001a1a','#0a2e2e'],
  ['#1a001a','#2e002e'],['#001a0a','#002e1a'],['#0a0a1a','#1a1a2e'],
  ['#1a0a0a','#2e0a0a'],['#0a1a00','#1a2e00'],['#000a1a','#001a2e'],
];
function getPosterStyle(item) {
  const idx = item.id % POSTER_GRADIENTS.length;
  const [c1, c2] = POSTER_GRADIENTS[idx];
  return `background:linear-gradient(145deg,${c1},${c2});`;
}

// (hero video init is handled by initHeroSlides)

// ===== MINI-HERO SLIDES (for non-home pages) =====
// Shares the same HERO_SLIDES data as home
let miniSlideIndex = 0;
let miniSlideTimer = null;
const MINI_SLIDE_INTERVAL = 10000;
const MINI_HERO_PAGE_IDS = ['movies', 'tvshows', 'topmovies', 'mylist', 'team'];

function initMiniHeroSlides() {
  // Build dots for every mini-hero
  MINI_HERO_PAGE_IDS.forEach(pageId => {
    const hero = document.getElementById(`mini-hero-${pageId}`);
    if (!hero) return;
    const dotsWrap = hero.querySelector('.mini-hero-dots');
    if (!dotsWrap) return;
    dotsWrap.innerHTML = HERO_SLIDES.map((_, i) =>
      `<span class="mini-dot${i === 0 ? ' active' : ''}" onclick="goToMiniSlide(${i})"></span>`
    ).join('');
    // Seed embers
    seedMiniEmbers(hero.querySelector('.mini-hero-embers'));
  });
  renderMiniSlide(0);
  miniSlideTimer = setInterval(() => {
    miniSlideIndex = (miniSlideIndex + 1) % HERO_SLIDES.length;
    renderMiniSlide(miniSlideIndex);
  }, MINI_SLIDE_INTERVAL);
}

function renderMiniSlide(index) {
  const slide = HERO_SLIDES[index];
  if (!slide) return;

  MINI_HERO_PAGE_IDS.forEach(pageId => {
    const hero = document.getElementById(`mini-hero-${pageId}`);
    if (!hero) return;

    // Update title with fade
    const titleEl = hero.querySelector('.mini-movie-title');
    if (titleEl) {
      titleEl.style.opacity = '0';
      setTimeout(() => {
        titleEl.textContent = slide.title;
        titleEl.style.opacity = '1';
      }, 400);
    }

    // Update dots
    hero.querySelectorAll('.mini-dot').forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });

    // Switch video
    const video = hero.querySelector('.mini-hero-video');
    if (video) {
      video.style.opacity = '0';
      setTimeout(() => {
        video.src = slide.video;
        video.load();
        video.play().catch(() => {});
        video.oncanplay = () => { video.style.opacity = '1'; };
      }, 200);
    }
  });
}

function goToMiniSlide(index) {
  miniSlideIndex = index;
  renderMiniSlide(index);
  clearInterval(miniSlideTimer);
  miniSlideTimer = setInterval(() => {
    miniSlideIndex = (miniSlideIndex + 1) % HERO_SLIDES.length;
    renderMiniSlide(miniSlideIndex);
  }, MINI_SLIDE_INTERVAL);
}

function seedMiniEmbers(container) {
  if (!container) return;
  for (let i = 0; i < 20; i++) {
    const e = document.createElement('div');
    e.className = 'ember';
    const size = Math.random() * 3 + 1;
    e.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      bottom:${Math.random()*40}%;
      animation-delay:${Math.random()*8}s;
      animation-duration:${Math.random()*6+6}s;
      --drift:${(Math.random()-0.5)*80}px;
    `;
    container.appendChild(e);
  }
}

// ===== EMBER PARTICLES =====
function createEmbers() {
  const container = document.getElementById('hero-embers');
  if (!container) return;
  const count = 30;
  for (let i = 0; i < count; i++) {
    const ember = document.createElement('div');
    ember.className = 'ember';
    const size = Math.random() * 3 + 1;
    const left = Math.random() * 100;
    const delay = Math.random() * 8;
    const duration = Math.random() * 6 + 6;
    const drift = (Math.random() - 0.5) * 80;
    const startBottom = Math.random() * 40;
    ember.style.cssText = `
      width:${size}px; height:${size}px;
      left:${left}%;
      bottom:${startBottom}%;
      animation-delay:${delay}s;
      animation-duration:${duration}s;
      --drift:${drift}px;
    `;
    container.appendChild(ember);
  }
}

// ===== PAGE NAVIGATION =====
function showPage(name) {
  prevPage = currentPage;
  currentPage = name;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-' + name);
  if (pg) { pg.classList.add('active'); window.scrollTo(0, 0); }
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.dataset.page === name);
  });
  if (name === 'movies')    renderMoviesPage();
  if (name === 'tvshows')   renderTVPage();
  if (name === 'topmovies') renderTopImdb();
  if (name === 'mylist')    renderMyList();
  if (name === 'team')      renderTeam();
}

function goBack() { showPage(prevPage || 'home'); }

// ===== MOBILE NAV =====
function toggleMobileNav() {
  document.getElementById('mobile-nav').classList.toggle('open');
}
function closeMobileNav() {
  document.getElementById('mobile-nav').classList.remove('open');
}

// ===== USER MENU =====
function toggleUserMenu() {
  document.getElementById('user-avatar-btn').classList.toggle('open');
}
document.addEventListener('click', (e) => {
  const av = document.getElementById('user-avatar-btn');
  if (av && !av.contains(e.target)) av.classList.remove('open');
});

// ===== RENDER CARD =====
function renderCard(item, showRank) {
  const badge = item.quality === 'HD'
    ? '<span class="badge badge-hd">HD</span>'
    : item.quality === 'CAM'
      ? '<span class="badge badge-cam">CAM</span>'
      : '';
  const rankBadge = showRank ? `<span class="badge badge-top">#${showRank}</span>` : '';
  const typeTag = item.type !== 'Movie'
    ? `<span class="card-type">${item.type}</span>` : '';
  const inList = myList.includes(item.id);

  const posterHTML = item.poster
    ? `<img src="${item.poster}" alt="${item.title}" class="card-poster-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
    : '';
  const placeholderStyle = item.poster ? 'display:none;' : '';

  return `
  <div class="movie-card" id="card-${item.id}" onclick="openDetail(${item.id}, this)">
    <div class="card-poster">
      ${posterHTML}
      <div class="card-poster-placeholder" style="${getPosterStyle(item)}${placeholderStyle}">
        <div class="card-poster-icon">🎬</div>
        <div class="poster-title">${item.title}</div>
        <div class="poster-year">${item.year}</div>
      </div>
      <div class="card-badges">${badge}${rankBadge}</div>
      <div class="card-hover-overlay">
        <div class="play-circle">&#9654;</div>
      </div>
    </div>
    <div class="card-info">
      <div class="card-title">${item.title}</div>
      <div class="card-meta">
        <span>${item.year}</span>
        <span class="card-dot"></span>
        <span class="card-rating">⭐ ${item.rating}</span>
        ${typeTag}
      </div>
    </div>
  </div>`;
}

// ===== HOME GENRE CHIPS =====
const HOME_GENRES = ['All','Action','Comedy','Drama','Sci-Fi','Thriller','Romance','Animation','Crime','Fantasy','Horror'];

function renderHomeGenreChips() {
  const wrap = document.getElementById('home-genre-chips');
  if (!wrap) return;
  wrap.innerHTML = HOME_GENRES.map(g =>
    `<button class="home-genre-chip${g === activeHomeGenre ? ' active' : ''}" onclick="setHomeGenre('${g}')">${g}</button>`
  ).join('');
}

function setHomeGenre(g) {
  activeHomeGenre = g;
  renderHomeGenreChips();
  renderHomeSections();
}

// ===== HOME PAGE =====
function renderHomeSections() {
  const filter = (items) => activeHomeGenre === 'All' ? items
    : items.filter(m => m.genres.includes(activeHomeGenre));

  // Trending Now
  const trending = filter(MOVIES.filter(m => m.trending));
  document.getElementById('trending-grid').innerHTML = trending.map(m => renderCard(m)).join('');

  // Top Rated Movies
  const topRated = filter(MOVIES.filter(m => m.topImdb)).sort((a, b) => b.rating - a.rating).slice(0, 12);
  document.getElementById('top-rated-grid').innerHTML = topRated.map((m, i) => renderCard(m, i + 1)).join('');

  // Popular TV Shows
  const tvShows = filter(MOVIES.filter(m => m.type === 'TV Series')).slice(0, 12);
  document.getElementById('popular-tv-grid').innerHTML = tvShows.map(m => renderCard(m)).join('');

  // New Releases
  const newReleases = filter(MOVIES.filter(m => m.type === 'Movie' && !m.topImdb))
    .sort((a, b) => b.year - a.year).slice(0, 12);
  document.getElementById('new-releases-grid').innerHTML = newReleases.map(m => renderCard(m)).join('');
}

function renderHome() {
  renderHomeGenreChips();
  renderHomeSections();
}

// ===== MOVIES PAGE =====
function renderMoviesPage() {
  const genre = activeMovieGenre;
  let items = MOVIES.filter(m => m.type === 'Movie' || m.type === 'TV Series').filter(m => !m.topImdb);
  if (genre !== 'All') items = items.filter(m => m.genres.includes(genre));

  const sort = document.getElementById('movies-sort')?.value || 'latest';
  if (sort === 'rating') items.sort((a, b) => b.rating - a.rating);
  else if (sort === 'year') items.sort((a, b) => b.year - a.year);
  else if (sort === 'az') items.sort((a, b) => a.title.localeCompare(b.title));
  else items.sort((a, b) => b.year - a.year);

  document.getElementById('movies-count').textContent = `${items.length} titles`;
  document.getElementById('movies-main-grid').innerHTML = items.map(m => renderCard(m)).join('');
}

function renderMovieGenreFilter() {
  const wrap = document.getElementById('movie-genre-filter');
  if (!wrap) return;
  wrap.innerHTML = GENRES_MOVIES.map(g =>
    `<button class="genre-chip${g === activeMovieGenre ? ' active' : ''}" onclick="setMovieGenre('${g}')">${g}</button>`
  ).join('');
}
function setMovieGenre(g) {
  activeMovieGenre = g;
  renderMovieGenreFilter();
  renderMoviesPage();
}

// ===== TV PAGE =====
function renderTVPage() {
  const genre = activeTVGenre;
  let items = MOVIES.filter(m => m.type === 'TV Series');
  if (genre !== 'All') items = items.filter(m => m.genres.includes(genre));

  const sort = document.getElementById('tv-sort')?.value || 'latest';
  if (sort === 'rating') items.sort((a, b) => b.rating - a.rating);
  else if (sort === 'year') items.sort((a, b) => b.year - a.year);
  else if (sort === 'az') items.sort((a, b) => a.title.localeCompare(b.title));
  else items.sort((a, b) => b.year - a.year);

  document.getElementById('tv-count').textContent = `${items.length} shows`;
  document.getElementById('tv-main-grid').innerHTML = items.map(m => renderCard(m)).join('');
}

function renderTVGenreFilter() {
  const wrap = document.getElementById('tv-genre-filter');
  if (!wrap) return;
  wrap.innerHTML = GENRES_TV.map(g =>
    `<button class="genre-chip${g === activeTVGenre ? ' active' : ''}" onclick="setTVGenre('${g}')">${g}</button>`
  ).join('');
}
function setTVGenre(g) {
  activeTVGenre = g;
  renderTVGenreFilter();
  renderTVPage();
}

// ===== TOP IMDB =====
function renderTopImdb() {
  const items = MOVIES.filter(m => m.topImdb).sort((a, b) => b.rating - a.rating);
  document.getElementById('top-imdb-grid').innerHTML = items.map((m, i) => renderCard(m, i + 1)).join('');
}

// ===== MY LIST =====
function renderMyList() {
  const items = MOVIES.filter(m => myList.includes(m.id));
  const grid = document.getElementById('mylist-grid');
  const empty = document.getElementById('mylist-empty');
  if (items.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    grid.innerHTML = items.map(m => renderCard(m)).join('');
  }
}

function toggleMyList(id, title) {
  if (myList.includes(id)) {
    myList = myList.filter(i => i !== id);
    showToast(`"${title}" removed from your list`);
  } else {
    myList.push(id);
    showToast(`"${title}" added to your list`);
  }
}

// ===== DETAIL MODAL — FLIP "expand from card" animation =====
function openDetail(id, cardEl) {
  const item = MOVIES.find(m => m.id === id);
  if (!item) return;

  const genreTags = item.genres.map(g => `<span class="modal-genre">${g}</span>`).join('');
  const castTags  = item.cast.map(c => `<span class="cast-tag">${c}</span>`).join('');
  const inList    = myList.includes(id);

  const modalPosterHTML = item.poster
    ? `<img src="${item.poster}" alt="${item.title}" class="modal-poster-img"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
       <div class="modal-poster-placeholder" style="${getPosterStyle(item)};display:none">
         <div class="card-poster-icon">🎬</div>
         <div class="mpp-title">${item.title}</div>
       </div>`
    : `<div class="modal-poster-placeholder" style="${getPosterStyle(item)}">
         <div class="card-poster-icon">🎬</div>
         <div class="mpp-title">${item.title}</div>
       </div>`;

  const heroBgVideo = item.trailer
    ? `<video class="modal-hero-bg-video" autoplay muted loop playsinline>
         <source src="${item.trailer}" type="video/mp4">
       </video>`
    : '';

  // Build modal HTML
  document.getElementById('modal-content').innerHTML = `
    <button class="modal-close" onclick="closeDetailModal()">&#10005;</button>
    <div class="modal-hero-area">
      ${heroBgVideo}
      <div class="modal-hero-overlay"></div>
      <div class="modal-poster-wrap">${modalPosterHTML}</div>
      <div class="modal-info-area">
        <div class="modal-title">${item.title}</div>
        <div class="modal-meta">
          <span>${item.year}</span><span>•</span>
          <span>${item.duration}</span><span>•</span>
          <span class="modal-rating">⭐ ${item.rating}/10</span><span>•</span>
          <span>${item.type}</span>
        </div>
        <div class="modal-genres">${genreTags}</div>
        <div class="modal-btns">
          <button class="btn-watch-now" onclick="watchMovie(${item.id})">&#9654; Watch Now</button>
          <button class="btn-watchlist" id="mylist-btn-${item.id}"
            onclick="toggleMyList(${item.id},'${item.title.replace(/'/g,"\\'")}');updateMyListBtn(${item.id})">
            ${inList ? '✓ In My List' : '+ My List'}
          </button>
        </div>
      </div>
    </div>
    <div class="modal-body">
      <p class="modal-desc">${item.description}</p>
      <div class="modal-detail-row">
        <div class="modal-detail-item"><label>Director</label><span>${item.director}</span></div>
        <div class="modal-detail-item"><label>Duration</label><span>${item.duration}</span></div>
        <div class="modal-detail-item"><label>Quality</label><span>${item.quality}</span></div>
        <div class="modal-detail-item"><label>Genres</label><span>${item.genres.join(', ')}</span></div>
      </div>
      <div style="margin-bottom:0.5rem">
        <div class="modal-detail-item" style="margin-bottom:0.75rem"><label>Cast</label></div>
        <div class="cast-list">${castTags}</div>
      </div>
    </div>
  `;

  // ---- FLIP animation ----
  const overlay   = document.getElementById('detail-modal');
  const modalBox  = document.getElementById('modal-content');

  // 1. Get card's bounding rect BEFORE showing overlay
  const cardRect = cardEl
    ? cardEl.getBoundingClientRect()
    : { left: window.innerWidth/2 - 90, top: window.innerHeight/2 - 130, width: 180, height: 270 };

  // 2. Show overlay (invisible yet) so we can measure modal's final rect
  overlay.classList.add('open');
  overlay.style.pointerEvents = 'none';

  // 3. Measure modal's final position
  const modalRect = modalBox.getBoundingClientRect();

  // 4. Compute transform: scale + translate from card → modal
  const scaleX  = cardRect.width  / modalRect.width;
  const scaleY  = cardRect.height / modalRect.height;
  const dx = cardRect.left + cardRect.width  / 2 - (modalRect.left + modalRect.width  / 2);
  const dy = cardRect.top  + cardRect.height / 2 - (modalRect.top  + modalRect.height / 2);

  // 5. Start: snap modal to card's position/size — no transition yet
  modalBox.style.transition = 'none';
  modalBox.style.transform  = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
  modalBox.style.opacity    = '0.3';
  modalBox.style.borderRadius = '8px';

  // Also start overlay fully transparent
  overlay.style.transition  = 'none';
  overlay.style.background  = 'rgba(0,0,0,0)';
  overlay.style.backdropFilter = 'blur(0px)';

  // 6. Next frame: animate to final state
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      modalBox.style.transition = 'transform 1s cubic-bezier(0.22,1,0.36,1), opacity 0.32s ease, border-radius 0.42s ease';
      modalBox.style.transform  = 'translate(0,0) scale(1)';
      modalBox.style.opacity    = '1';
      modalBox.style.borderRadius = '14px';

      overlay.style.transition  = 'background 0.35s ease, backdrop-filter 0.35s ease';
      overlay.style.background  = 'rgba(0,0,0,0.85)';
      overlay.style.backdropFilter = 'blur(8px)';
      overlay.style.pointerEvents = '';
    });
  });
}

function closeDetailModal() {
  const overlay  = document.getElementById('detail-modal');
  const modalBox = document.getElementById('modal-content');

  // Stop trailer video
  const bgVid = modalBox.querySelector('.modal-hero-bg-video');
  if (bgVid) { bgVid.pause(); bgVid.src = ''; }

  // Animate out: shrink + fade
  modalBox.style.transition = 'transform 1s cubic-bezier(0.55,0,1,0.45), opacity 0.22s ease';
  modalBox.style.transform  = 'scale(0.88)';
  modalBox.style.opacity    = '0';
  overlay.style.transition  = 'background 0.25s ease, backdrop-filter 0.25s ease';
  overlay.style.background  = 'rgba(0,0,0,0)';
  overlay.style.backdropFilter = 'blur(0px)';

  setTimeout(() => {
    overlay.classList.remove('open');
    // Reset inline styles for next open
    modalBox.style.transition    = '';
    modalBox.style.transform     = '';
    modalBox.style.opacity       = '';
    modalBox.style.borderRadius  = '';
    overlay.style.transition     = '';
    overlay.style.background     = '';
    overlay.style.backdropFilter = '';
  }, 280);
}

function updateMyListBtn(id) {
  const btn = document.getElementById(`mylist-btn-${id}`);
  if (btn) btn.textContent = myList.includes(id) ? '✓ In My List' : '+ My List';
}

function closeModal(e) {
  if (e.target === document.getElementById('detail-modal')) {
    closeDetailModal();
  }
}

// ===== WATCH PAGE =====
function watchMovie(id) {
  const item = MOVIES.find(m => m.id === id);
  if (!item) return;
  currentWatchItem = item;
  document.getElementById('detail-modal').classList.remove('open');

  document.getElementById('now-playing-title').textContent = item.title;

  document.getElementById('watch-info').innerHTML = `
    <div class="watch-title">${item.title}</div>
    <div class="watch-meta">
      <span>${item.year}</span>
      <span class="wrating">⭐ ${item.rating}/10</span>
      <span class="wtag">${item.duration}</span>
      <span class="wtag">${item.quality}</span>
      <span class="wtag">${item.type}</span>
      ${item.genres.map(g => `<span class="wtag">${g}</span>`).join('')}
    </div>
    <p class="watch-desc">${item.description}</p>
    <div style="margin-top:1rem;display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn-watchlist" onclick="toggleMyList(${item.id},'${item.title.replace(/'/g,"\\'")}')">+ My List</button>
      <button class="btn-watchlist" onclick="showToast('Share link copied!')">&#128279; Share</button>
    </div>
  `;

  const related = MOVIES.filter(m => m.id !== item.id && m.genres.some(g => item.genres.includes(g))).slice(0, 8);
  document.getElementById('related-grid').innerHTML = related.map(m => renderCard(m)).join('');

  showPage('watch');
}

// ===== SEARCH =====
function triggerSearch() {
  const q = document.getElementById('search-input').value.trim();
  if (!q) return;
  doSearch(q);
}
function triggerHeroSearch() {
  const q = document.getElementById('hero-search')?.value.trim();
  if (!q) return;
  doSearch(q);
}

function doSearch(q) {
  const ql = q.toLowerCase();
  const results = MOVIES.filter(m =>
    m.title.toLowerCase().includes(ql) ||
    m.genres.some(g => g.toLowerCase().includes(ql)) ||
    m.type.toLowerCase().includes(ql) ||
    m.cast.some(c => c.toLowerCase().includes(ql)) ||
    String(m.year).includes(ql)
  );
  document.getElementById('search-results-title').textContent =
    `Results for "${q}" — ${results.length} found`;
  document.getElementById('search-results-grid').innerHTML =
    results.length ? results.map(m => renderCard(m)).join('')
    : `<div style="grid-column:1/-1;color:#5577aa;padding:2rem 0">No results found for "<strong style="color:#8899bb">${q}</strong>". Try a different keyword.</div>`;
  showPage('search');
}

function filterByGenre(genre) {
  activeMovieGenre = genre;
  showPage('movies');
  renderMovieGenreFilter();
}

// ===== AUTH STATE =====
function setLoggedIn(name, email) {
  isLoggedIn = true;
  loggedInUser = { name, email };
  document.body.classList.add('logged-in');

  // Hide hero CTA buttons (Sign Up + Login) after login
  const heroCta = document.getElementById('hero-cta-row');
  if (heroCta) heroCta.style.display = 'none';

  // Swap header panels
  document.getElementById('header-guest').style.display = 'none';
  const userBar = document.getElementById('header-user');
  userBar.style.removeProperty('display');
  userBar.style.display = 'flex';

  // Build avatar initials + user-menu
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const av = document.getElementById('user-avatar-btn');
  av.innerHTML = `
    <span style="font-family:'Oswald',sans-serif;font-size:14px;font-weight:700;color:#fff;line-height:1">${initials}</span>
    <div class="user-menu" id="user-menu">
      <div class="user-menu-item" style="font-weight:700;color:#c8d4f0;cursor:default">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        ${name}
      </div>
      <div class="user-menu-item" onclick="showPage('mylist')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        My List
      </div>
      <div class="user-menu-item" style="color:#e05555;border-top:1px solid rgba(255,255,255,0.07);margin-top:4px;padding-top:10px" onclick="logOut()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Logout
      </div>
    </div>`;
  av.style.background = 'linear-gradient(135deg, #1a3a6e, #0d2555)';
}

function logOut() {
  isLoggedIn = false;
  loggedInUser = { name: '', email: '' };
  document.body.classList.remove('logged-in');

  // Show hero CTA buttons again
  const heroCta = document.getElementById('hero-cta-row');
  if (heroCta) heroCta.style.display = '';
  document.getElementById('header-guest').style.display = 'flex';
  document.getElementById('header-user').style.display = 'none';
  const av = document.getElementById('user-avatar-btn');
  av.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><div class="user-menu" id="user-menu"></div>`;
  av.style.background = '';
  av.classList.remove('open');
  showPage('home');
  showToast('You have been logged out.');
}

// ===== LOGIN MODAL =====
function showLoginModal() {
  document.getElementById('signup-modal').classList.remove('open');
  document.getElementById('login-modal').classList.add('open');
  const av = document.getElementById('user-avatar-btn');
  if (av) av.classList.remove('open');
}
function closeLoginModal(e) {
  if (e.target === document.getElementById('login-modal')) {
    document.getElementById('login-modal').classList.remove('open');
  }
}
function fakeLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-password').value;
  if (!email) { showToast('Please enter your email address'); return; }
  if (!pass)  { showToast('Please enter your password'); return; }
  document.getElementById('login-modal').classList.remove('open');
  setLoggedIn(email.split('@')[0], email);
  showToast(`Welcome back, ${email.split('@')[0]}!`);
}

// ===== SIGNUP MODAL =====
function showSignupModal() {
  document.getElementById('login-modal').classList.remove('open');
  document.getElementById('signup-modal').classList.add('open');
  const av = document.getElementById('user-avatar-btn');
  if (av) av.classList.remove('open');
}
function closeSignupModal(e) {
  if (e.target === document.getElementById('signup-modal')) {
    document.getElementById('signup-modal').classList.remove('open');
  }
}
function fakeSignup() {
  const first   = document.getElementById('signup-firstname').value.trim();
  const last    = document.getElementById('signup-lastname').value.trim();
  const email   = document.getElementById('signup-email').value.trim();
  const pass    = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm').value;
  const agreed  = document.getElementById('signup-agree').checked;
  if (!first || !last)          { showToast('Please enter your full name'); return; }
  if (!email)                   { showToast('Please enter your email address'); return; }
  if (!pass || pass.length < 6) { showToast('Password must be at least 6 characters'); return; }
  if (pass !== confirm)         { showToast('Passwords do not match'); return; }
  if (!agreed)                  { showToast('Please agree to the Terms of Service'); return; }
  document.getElementById('signup-modal').classList.remove('open');
  setLoggedIn(`${first} ${last}`, email);
  showToast(`Welcome to MovieHub, ${first}! Account created.`);
}

function switchToSignup() {
  document.getElementById('login-modal').classList.remove('open');
  document.getElementById('signup-modal').classList.add('open');
}
function switchToLogin() {
  document.getElementById('signup-modal').classList.remove('open');
  document.getElementById('login-modal').classList.add('open');
}

// ===== TEAM PAGE =====
function renderTeam() {
  const grid = document.getElementById('team-grid');
  if (!grid) return;
  grid.innerHTML = TEAM.map(member => {
    // Build initials avatar or photo if a photo path is provided
    const avatarInner = member.photo
      ? `<img src="${member.photo}" alt="${member.name}" class="team-avatar-photo" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
         <span class="team-initials" style="display:none">${member.initials}</span>`
      : `<span class="team-initials">${member.initials}</span>`;

    return `
    <div class="team-card" onclick="window.open('${member.portfolio}','_blank')">
      <div class="team-avatar" style="background: radial-gradient(135deg, ${member.avatarColor} 0%, #080a10 100%)">
        ${avatarInner}
        <div class="team-avatar-ring"></div>
      </div>
      <div class="team-name">${member.name}</div>
      <div class="team-role">${member.role}</div>
      <div class="team-links">
        ${member.github ? `<a href="${member.github}" target="_blank" onclick="event.stopPropagation()" class="team-link-btn" title="GitHub">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.92.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
        </a>` : ''}
        ${member.linkedin ? `<a href="${member.linkedin}" target="_blank" onclick="event.stopPropagation()" class="team-link-btn" title="LinkedIn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </a>` : ''}
      </div>
    </div>`;
  }).join('');
}

// ===== TOAST =====
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  createEmbers();
  initHeroSlides();
  initMiniHeroSlides();
  renderHome();
  renderMovieGenreFilter();
  renderTVGenreFilter();
});

