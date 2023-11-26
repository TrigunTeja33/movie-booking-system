// Selecting elements from the DOM
const container = document.querySelector('.container');
const movieSelect = document.getElementById('movie');
const count = document.getElementById('count');
const total = document.getElementById('total');
const buyButton = document.getElementById('buyButton');

document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the movieTitle parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const movieTitle = urlParams.get('movieTitle');

    // Display the movieTitle in the HTML
    const movieTitleElement = document.getElementById('movieTitle');
    movieTitleElement.textContent = ` ${movieTitle}`;
});

// Prices for each movie
const moviePrices = {
  m1: 450,
  m2: 225,
  m3: 290,
  m4: 300,
};

// Creating a screen element
const screen = document.createElement('div');
screen.className = 'screen';
container.appendChild(screen);

// Seat configurations for each movie
const movieSeatConfigurations = {
  m1: {
    numRows: 8,
    seatsPerRow: 18,
    divisionColumns: [5, 10, 11, 14],
  },
  m2: {
    numRows: 6,
    seatsPerRow: 16,
    divisionColumns: [6, 8, 12],
  },
  m3: {
    numRows: 7,
    seatsPerRow: 20,
    divisionColumns: [5, 10, 15],
  },
  m4: {
    numRows: 9,
    seatsPerRow: 22,
    divisionColumns: [7, 11, 15, 18],
  },
};

// Initializing seats based on the selected movie
initializeSeats();

// Updating seat selection and count
updateSelectedCount();

// Event listener for movie selection change
movieSelect.addEventListener('change', () => {
  initializeSeats();
  updateSelectedCount();
});

// Event listener for seat clicks
container.addEventListener('click', (e) => {
  if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
    e.target.classList.toggle('selected');
    updateSelectedCount();
  }
});

// Event listener for booking button click
buyButton.addEventListener('click', () => {
  const selectedSeatsCount = parseInt(count.innerText);
  const totalPrice = parseInt(total.innerText) + 21;
    // Retrieve the movieTitle parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const movieTitle = urlParams.get('movieTitle');

    // Display the movieTitle in the HTML
    const movieTitleElement = document.getElementById('movieTitle');
    movieTitleElement.textContent = `${movieTitle}`

  if (selectedSeatsCount > 0) {
    // Generating ticket information
    const ticketInfo = `
    <div class="ticketContainer">
    <div class="ticket">
      <div class="ticketTitle">Your Booking</div>
      <hr>
      <div class="ticketDetail">
        <div>Movie: ${movieTitleElement.textContent}</div>
        <div>Theatre: ${movieSelect.options[movieSelect.selectedIndex].text}</div>
        <div>Time: 18:30</div>
        <div>Tickets Booked: ${selectedSeatsCount} (Rs.${totalPrice})<br>(Tax Included)</div>
      </div>      
      <div class="ticketRip">
        <div class="circleLeft"></div>
        <div class="ripLine"></div>
        <div class="circleRight"></div>
      </div>
      <div class="ticketSubDetail">
        <div class="code">LO-2314XXX</div>
        <div class="date"> Jan 14<sup>th</sup> 2023</div>
      </div>

        </div>
      <div class="ticketShadow"></div>
    </div>
    `;

    // Opening a new window with the ticket information
    openTicketWindow(ticketInfo);

    // Updating selected seats to "occupied"
    const selectedSeats = document.querySelectorAll('.row .seat.selected');
    selectedSeats.forEach((seat) => {
      seat.style.backgroundColor = '#a59e9e';
      seat.classList.remove('selected');
      seat.classList.add('occupied');
    });

    // Update the count and total
    updateSelectedCount();
  } else {
    alert('Please select seats before buying a ticket.');
  }
});

// Function to open a new window with ticket information
function openTicketWindow(ticketInfo) {
  const ticketWindow = window.open('', '_blank', 'width=400,height=400');
  ticketWindow.document.write(`
  <html>
  <head>
    <title>Your Movie Ticket</title>
    <style>
    body {
      background-color: #ecc58f;
      font-family: Arial, sans-serif;
      text-align: center;
    }
    .ticketContainer {
      display: flex;
      justify-content: center;
      
    }
    .ticket {
      position: relative;
      box-sizing: border-box;
      width: 300px;
      height: 250px;
      margin: 50px auto 0;
      padding: 20px;
      border-radius: 10px;
      background: gold radial-gradient(lightyellow, gold);
      box-shadow: 2px 2px 15px 0px #333;
      
    }
    .ticketTitle {
      font-size: 24px;
    }
    hr {
      border: 1px solid #333;
    }
    .ticketDetail {
      text-align: left;
    }
    .ticketRip {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 20px 0;
    }
    .circleLeft, .circleRight {
      width: 20px;
      height: 20px;
      background-color: #333;
      border-radius: 50%;
    }
    .ripLine {
      width: 200px;
      border-bottom: 1px solid #333;
      margin: 0 10px;
    }
    .ticketSubDetail {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }
    .code, .date {
      font-size: 16px;
    }
    </style>
  </head>
  <body>
    ${ticketInfo}
  </body>
  </html>
`);
  ticketWindow.document.close();
}

// Function to initialize seats based on the selected movie
function initializeSeats() {
  const selectedMovie = movieSelect.value;
  const seatConfiguration = movieSeatConfigurations[selectedMovie];

  container.innerHTML = '';
  container.appendChild(screen);

  for (let i = 0; i < seatConfiguration.numRows; i++) {
    const row = document.createElement('div');
    row.className = 'row';

    for (let j = 0; j < seatConfiguration.seatsPerRow; j++) {
      const seat = document.createElement('div');
      seat.className = 'seat';

      if (seatConfiguration.divisionColumns.includes(j)) {
        seat.classList.add('division');
      }

      row.appendChild(seat);
    }

    container.appendChild(row);
  }

  // Mark the last two rows as "occupied" and not selectable
  const allSeats = document.querySelectorAll('.row .seat');
  const totalRows = seatConfiguration.numRows;
  const seatsPerRow = seatConfiguration.seatsPerRow;
  const lastTwoRows = totalRows - 2;
  for (let i = lastTwoRows; i < totalRows; i++) {
    for (let j = 0; j < seatsPerRow; j++) {
      const seatIndex = i * seatsPerRow + j;
      allSeats[seatIndex].classList.add('occupied');
    }
  }
}

// Function to update selected seat count and total price
function updateSelectedCount() {
  const selectedSeats = document.querySelectorAll('.row .seat.selected');

  const selectedSeatsCount = selectedSeats.length;
  count.innerText = selectedSeatsCount;

  const seatPrices = moviePrices[movieSelect.value];

  let totalPrice = 0;
  selectedSeats.forEach(() => {
    totalPrice += seatPrices;
  });

  total.innerText = totalPrice;

  // Get indexes of selected seats
  const selectedSeatsIndexes = [...selectedSeats].map((seat) => {
    const seats = document.querySelectorAll('.row .seat');
    return [...seats].indexOf(seat);
  });
}
