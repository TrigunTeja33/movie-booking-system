const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1'
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="'

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')

const showPopupBtn = document.querySelector(".login-btn");
const formPopup = document.querySelector(".form-popup");
const hidePopupBtn = formPopup.querySelector(".close-btn");
const signupLoginLink = formPopup.querySelectorAll(".bottom-link a");

const userStatusElement = document.getElementById('user-status');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const signupForm = document.getElementById('signup-form');

// Check if the user is already logged in
updateUserStatus();

function updateUserStatus(username) {
  if (isLoggedIn()) {
    userStatusElement.innerHTML = `Logged In as <b>${username}</b> | <button id="logout-btn" style="width:140px;height:40px;border:none;outline:none;background:#fff;color:#275360;font-size:1rem;font-weight:600;padding:10px18px;border-radius:3px;cursor:pointer;transition:ease;">Logout</button>`;
    document.getElementById('logout-btn').addEventListener('click', logout);
  } else {
    userStatusElement.innerHTML = 'Not Logged In | <button id="login-btn" style="width:140px;height:40px;border:none;outline:none;background:#fff;color:#275360;font-size:1rem;font-weight:600;padding:10px18px;border-radius:3px;cursor:pointer;transition:ease;">Login</button>';
    document.getElementById('login-btn').addEventListener('click', showLoginPopup);
  }
}

// Function to check if the user is logged in
function isLoggedIn() {
  // Check if the authentication token exists in local storage
  const token = localStorage.getItem('authToken');
  return token !== null;
}



// Regular expression for password validation
// This example requires a minimum of 8 characters, at least one uppercase letter, one lowercase letter, and one digit
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

// Show login popup
showPopupBtn.addEventListener("click", () => {
  document.body.classList.toggle("show-popup");
});

// Hide login popup
hidePopupBtn.addEventListener("click", () => showPopupBtn.click());

// Show or hide signup form
signupLoginLink.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    formPopup.classList[link.id === "signup-link" ? "add" : "remove"](
      "show-signup"
    );
  });
});

// Get initial movies
getMovies(API_URL)

async function getMovies(url) {
    const res = await fetch(url)
    const data = await res.json()

    showMovies(data.results)
}

function showMovies(movies) {
    main.innerHTML = ''

    movies.forEach((movie) => {
        const { title, poster_path, vote_average, overview } = movie

        const movieEl = document.createElement('div')
        movieEl.classList.add('movie')

        movieEl.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="movie-info">
          <h3>${title}</h3>
          <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
          <h3>Overview</h3>
          ${overview}
        </div>
        `
        movieEl.addEventListener('click', () => {
            // Check if the user is logged in
            if (isLoggedIn()) {
                // Log the clicked movie title to the console
                console.log('Clicked Movie Title:', title);
                // Open html.html in a new window or tab
                window.location.href = `html.html?movieTitle=${encodeURIComponent(title)}`;
            } else {
                alert('Please log in to view movie details.');
            }
        });
        
        main.appendChild(movieEl)
    })
}

function getClassByRate(vote) {
    if(vote >= 8) {
        return 'green'
    } else if(vote >= 5) {
        return 'orange'
    } else {
        return 'red'
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const searchTerm = search.value

    if(searchTerm && searchTerm !== '') {
        getMovies(SEARCH_API + searchTerm)

        search.value = ''
    } else {
        window.location.reload()
    }
})

// Function to validate username
function validateUsername(username) {
  // Adjust the regular expression based on your username requirements
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

// Function to validate password
function validatePassword(password) {
  return passwordRegex.test(password);
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  if (!validateUsername(username)) {
    alert('Please enter a valid username');
    return;
  }

  if (!validatePassword(password)) {
    alert('Please enter a valid password (minimum 8 characters, at least one uppercase letter, one lowercase letter, and one digit).');
    return;
  }

  // Continue with login logic if validation passes
  // ...
  login(username, password);
});

const userData = [{ username: 'trigun', password: 'passWORD123' },];
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('signup-username').value;
  const password = document.getElementById('signup-password').value;

  if (!validateUsername(username)) {
    alert('Please enter a valid email address.');
    return;
  }

  if (!validatePassword(password)) {
    alert('Please enter a valid password (minimum 8 characters, at least one uppercase letter, one lowercase letter, and one digit).');
    return;
  }
  
  const existingUser = userData.find((user) => user.username === username);

  if (existingUser) {
    alert('Username is already taken. Please choose another.');
    return;
  }
  // Continue with signup logic if validation passes
  userData.push({ username, password });
  alert(`User data for ${username} saved successfully!`);
  const token = 'your_auth_token';

  // Store the token in local storage
  localStorage.setItem('authToken', token);

  // Update the UI with the logged-in username
  updateUserStatus(username);

  // Display a welcome message
  alert(`Welcome, ${username}!`);

  closeSignupPopup();

});

const DUMMY_USERNAME = 'trigun';
const DUMMY_PASSWORD = 'passWORD123';
function login(username, password) {
  const authenticatedUser = userData.find(
    (user) => user.username === username && user.password === password);
   if (authenticatedUser) {
  const token = 'your_auth_token';

  // Store the token in local storage
  localStorage.setItem('authToken', token);

  // Update the UI
  updateUserStatus(username);


  closeLoginPopup();
} else {
  // Display an alert for incorrect credentials
  alert('Invalid username or password. Please try again.');
}
}

// Function to log out the user
function logout() {
  // Remove the authentication token from local storage
  localStorage.removeItem('authToken');

  // Update the UI
  updateUserStatus();
}

function showLoginPopup() {
  document.body.classList.add("show-popup");
}

// Function to close the login popup
function closeLoginPopup() {
  document.body.classList.remove("show-popup");
}
