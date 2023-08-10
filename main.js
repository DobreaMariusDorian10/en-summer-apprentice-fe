// Navigate to a specific URL
function navigateTo(url) {
    history.pushState(null, null, url);
    renderContent(url);
  }
  
  // HTML templates
  function getHomePageTemplate() {
    return `
      <div id="content">
        <img src="./src/assets/Endava.png" alt="summer">
        <h1 class="text-2xl font-bold text-center mt-4">Upcoming Events</h1>
        <div class="events flex items-center justify-center flex-wrap mt-4"></div>
      </div>
    `;
  }
  
  function getOrdersPageTemplate() {
    return `
      <div id="content">
        <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
      </div>
    `;
  }
  
  // Render events
  async function renderHomePage() {
    const mainContentDiv = document.querySelector('.main-content-component');
    mainContentDiv.innerHTML = getHomePageTemplate();
  
    try {
      const eventData = await fetchTicketEvents();
      addEvents(eventData);
    } catch (error) {
      console.error('Error fetching event data:', error);
      mainContentDiv.innerHTML = '<p>Error fetching event data</p>';
    }
  
    async function fetchTicketEvents() {
      try {
        const response = await fetch('http://localhost:8080/api/getAllEvents');
        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error('Error fetching event data');
      }
    }
  }
  
  // Add events to the DOM
 const addEvents = (events) => {
  const eventsDiv = document.querySelector('.events');
  eventsDiv.innerHTML = '';

  if (events.length) {
    events.forEach(event => {
      eventsDiv.appendChild(createEvent(event));
    });
  } else {
    eventsDiv.innerHTML = 'No events';
  }
};

const createEvent = (eventData) => {
  const eventElement = document.createElement('div');
  eventElement.classList.add('event-card');

  const imagePath = eventImageMapping[eventData.eventID];

  const contentMarkup = `
    <div class="event-image-container">
      <img src="${imagePath}" alt="${eventData.eventName}" class="event-image">
    </div>
    <div class="event-details">
      <h2 class="event-title">${eventData.eventName}</h2>
      <p class="event-description">${eventData.eventDescription}</p>
      <p class="event-date">${new Date(eventData.eventStartDate).toDateString()}</p>
      <p class="event-end-date">${new Date(eventData.eventEndDate).toDateString()}</p>
      <p class="event-location">${eventData.venue.locationName}</p>
    </div>
    <div class="quantity">
      <div class="quantity-buttons">
        <button class="quantity-button decrement-button">-</button>
        <input type="number" class="ticket-quantity" value="0">
        <button class="quantity-button increment-button">+</button>
      </div>
      <select class="ticket-type">
        <option value="Standard">Standard</option>
        <option value="VIP">VIP</option>
      </select>
      <button class="place-order-btn">Place Order</button>
    </div>
  `;

  eventElement.innerHTML = contentMarkup;

  const decrementButton = eventElement.querySelector('.decrement-button');
  const incrementButton = eventElement.querySelector('.increment-button');
  const ticketQuantityInput = eventElement.querySelector('.ticket-quantity');
  const ticketTypeSelect = eventElement.querySelector('.ticket-type');
  const placeOrderButton = eventElement.querySelector('.place-order-btn');

  decrementButton.addEventListener('click', () => {
    if (ticketQuantityInput.value > 0) {
      ticketQuantityInput.value = parseInt(ticketQuantityInput.value) - 1;
    }
  });

  incrementButton.addEventListener('click', () => {
    ticketQuantityInput.value = parseInt(ticketQuantityInput.value) + 1;
  });

  // Add your logic for handling the "Place Order" button click here

  return eventElement;
};



  
  
  // Setup navigation events
  function setupNavigationEvents() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const href = link.getAttribute('href');
        navigateTo(href);
      });
    });
  }
  
  // Setup mobile menu event
  function setupMobileMenuEvent() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
  
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }
  }
  
  // Setup popstate event
  function setupPopstateEvent() {
    window.addEventListener('popstate', () => {
      const currentUrl = window.location.pathname;
      renderContent(currentUrl);
    });
  }
  
  // Setup initial page
  function setupInitialPage() {
    const initialUrl = window.location.pathname;
    renderContent(initialUrl);
  }
  
  // Render content based on URL
  function renderContent(url) {
    const mainContentDiv = document.querySelector('.main-content-component');
    mainContentDiv.innerHTML = '';
  
    if (url === '/') {
      renderHomePage();
    } else if (url === '/orders') {
      renderOrdersPage();
    }
  }

  const eventImageMapping = {
    1: './src/assets/event1.jpg',
    2: './src/assets/event2.jpg',
    3: './src/assets/event3.jpg',
    4: './src/assets/event4.jpg',
  };
  
  // Call the setup functions
  setupNavigationEvents();
  setupMobileMenuEvent();
  setupPopstateEvent();
  setupInitialPage();
  