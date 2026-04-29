# MovieHub

**A theme-based streaming platform website built as part of the Phase II Web Development Project.**

MovieHub is a fully client-side movie and TV show streaming interface designed to replicate the look, feel, and functionality of a modern streaming platform. The project demonstrates the practical application of HTML5, CSS3, and JavaScript through a feature-rich, visually engaging, and fully responsive web experience.

---

## Live Site

[View Hosted Website](https://manacioo.github.io/MovieHub/)

---

## Table of Contents

- [Theme and Purpose](#theme-and-purpose)
- [Target Audience](#target-audience)
- [Pages and Sections](#pages-and-sections)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [File Structure](#file-structure)
- [Team Members](#team-members)

---

## Theme and Purpose

The theme of this project is a **Movie and TV Streaming Platform**. The website simulates a real-world streaming service where users can browse movies and TV shows by genre, view detailed information about titles, manage a personal watchlist, and experience a cinematic interface.

The purpose is to demonstrate proficiency in front-end web development by building a multi-page, interactive, and visually polished web application without the use of any external frameworks or backend services.

---

## Target Audience

- General users who enjoy browsing and discovering movies and TV shows
- Students and educators reviewing front-end development techniques
- Evaluators assessing HTML, CSS, and JavaScript implementation skills

---

## Pages and Sections

| Page | Description |
|---|---|
| Home | Hero section with video background, genre filter chips, trending movies, top-rated titles, popular TV shows, and new releases |
| Movies | Full movie catalogue with genre filter chips and sort controls |
| TV Shows | Full TV series catalogue with genre filter chips and sort controls |
| Top IMDB | Ranked list of highest-rated titles with rank badges |
| My List | Personal watchlist saved during the session |
| Search | Live search results filtered by title, genre, cast, type, and year |
| Watch | Video player page with related title recommendations |
| Team | Meet the team section with member profiles, role descriptions, and social links |
| Contact | Contact form with JavaScript validation, social media links, and location information |

---

## Features

**Navigation and Layout**
- Fixed header with desktop navigation and hamburger menu for mobile
- Guest view and logged-in view with separate header states
- Smooth page transitions with fade-in animation

**Authentication**
- Sign Up modal with full form validation (name, email, password strength, confirmation, terms agreement)
- Login modal with email and password validation
- Session-based login state that updates the header, navigation, and hero section dynamically
- Logout functionality that resets all UI state

**Hero Section**
- Auto-rotating hero slideshow synced to background video clips
- Dot indicators with manual navigation
- Ember particle animation overlay
- Genre filter strip with chip-style buttons

**Movie and TV Browsing**
- Cards with poster images, fallback gradient placeholders, HD/CAM quality badges, and rank badges
- Hover overlay with animated play button
- Genre filter and sort controls on Movies and TV Shows pages

**Detail Modal**
- FLIP animation that expands the card into a full modal
- Live trailer video playing in the modal background
- Cast list, director, duration, quality, and genre information
- Watch Now and My List buttons

**My List**
- Toggle any title into or out of the watchlist from the detail modal or watch page
- Toast notification on add or remove
- Empty state message when the list is cleared

**Search**
- Real-time search across title, genre, cast, type, and year
- Result count displayed with the query

**Mini-Hero Banners**
- All non-home pages feature a compact video banner that mirrors the home hero slideshow
- Includes ember particles, overlay gradient, page title, and NOW SHOWING panel

**Watch Page**
- Full title metadata display
- Related titles grid based on shared genres
- Share and My List actions

**Team Page**
- Member cards with avatar photos or initials fallback
- Animated glowing ring on hover
- GitHub and LinkedIn icon links
- Portfolio redirect on card click

---

## Technologies Used

**Core Technologies**
- HTML5 — semantic page structure, multi-section layout, accessible form elements
- CSS3 — flexbox and grid layout, custom properties, keyframe animations, media queries for full responsiveness
- JavaScript (ES6) — DOM manipulation, event handling, form validation, dynamic rendering, session state management

**Advanced Techniques (Beyond Syllabus)**
- CSS `backdrop-filter` and `blur` for glassmorphism effects
- CSS `clamp()` for fluid responsive typography
- FLIP animation technique using `getBoundingClientRect()` and `requestAnimationFrame()` for the card-to-modal expand transition
- HTML5 `<video>` element with autoplay, muted, and loop for background video support
- CSS `aspect-ratio` property for consistent poster sizing
- CSS custom properties (`--drift`) used within keyframe animations for dynamic ember particle movement
- CSS `will-change` for GPU-accelerated modal transitions
- `onerror` attribute on `<img>` elements for graceful poster fallback

---

## File Structure

```
moviehub/
|
|-- index.html                     # Main HTML file containing all pages
|-- style.css                      # All styles including layout, components, and responsive rules
|-- app.js                         # All JavaScript logic, rendering functions, and event handlers
|-- data.js                        # Movie database, team data, genre lists, and hero slide config
|-- README.md                      # Project documentation
|
|-- images/
|   |-- posters/
|   |   |-- the_boys.jpg
|   |   |-- super_mario.jpg
|   |   |-- avatar_fire_and_ash.jpg
|   |   |-- dark_knight.jpg
|   |   |-- breaking_bad.jpg
|   |   |-- frieren.jpg
|   |   |-- shawshank.jpg
|   |   |-- the_godfather.jpg
|   |   |-- inception.jpg
|   |   |-- stranger_things.jpg
|   |   |-- last_of_us.jpg
|   |   |-- pulp_fiction.jpg
|   |   |-- forrest_gump.jpg
|   |   |-- one_piece.jpg
|   |   |-- daredevil_born_again.jpg
|   |   |-- ... (all remaining poster images)
|   |
|   |-- maanas.jpeg                # Team member photo
|   |-- sahad.jpeg                 # Team member photo
|   |-- aswathy.jpeg               # Team member photo
|   |-- gaadha.jpeg                # Team member photo
|
|-- videos/
    |-- hero.mp4                   # Default home hero background video
    |-- hero1.mp4                  # Iron Man slide video
    |-- hero2.mp4                  # Avatar: Fire and Ash slide video
    |-- hero3.mp4                  # Spider-Man slide video
    |-- hero4.mp4                  # Fast and Furious slide video
    |
    |-- trailers/
        |-- the_boys_trailer.mp4
        |-- avatar_fire_and_ash_trailer.mp4
        |-- breaking_bad_trailer.mp4
        |-- dark_knight_trailer.mp4
        |-- inception_trailer.mp4
        |-- shawshank_trailer.mp4
        |-- stranger_things_trailer.mp4
        |-- last_of_us_trailer.mp4
        |-- frieren_trailer.mp4
        |-- ... (all remaining trailer videos)
```

---

## Team Members

| Name | Role | Contribution |
|---|---|---|
| Maanas Vishnu | Member 1 | Project lead, JavaScript logic, hero slideshow, modal system, page navigation |
| Muhammed Sahad | Member 2 | CSS layout and styling, responsive design, mini-hero banners, card design |
| Aswathy B Kumar | Member 3 | HTML structure, authentication modals, form validation, watch page |
| Gaadha Jayakumar | Member 4 | Data layer, team page, genre filters, search functionality, README |

---



---

## Notes

- All movie and TV show data is stored locally in `data.js` and rendered entirely through JavaScript. No backend or external API is used.
- The authentication system is simulated client-side for demonstration purposes. No real user data is stored or transmitted.
- Video and image assets must be placed in the correct folder paths as listed in the file structure for the site to render correctly.
- The project is intended for educational and demonstration purposes only. All movie titles, posters, and related media belong to their respective copyright holders.
