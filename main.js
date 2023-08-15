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
        <div class="orders flex items-center justify-center flex-wrap mt-4"></div>
      </div>
    `;
  }
  
  let eventData = []; // Define eventData in a higher scope
  // Render events
  async function renderHomePage() {
    const mainContentDiv = document.querySelector('.main-content-component');
    mainContentDiv.innerHTML = getHomePageTemplate();
  
    try {
      eventData = await fetchTicketEvents(); // Assign fetched data to eventData
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
  
    // Add a data-event-id attribute to store the event ID
    eventElement.setAttribute('data-event-id', eventData.eventID);
  
    const imagePath = eventImageMapping[eventData.eventID];
  
    const contentMarkup = `
      <div class="event-image-container">
        <img src="${imagePath}" alt="${eventData.eventName}" class="event-image">
      </div>
      <div class="event-details">
        <h2 class="event-title">${eventData.eventName}</h2>
        <p class="event-description">${eventData.eventDescription}</p>
        <p class="event-date">${new Date(eventData.eventStartDate).toDateString()}</p>
        <p class="event-end-date">${new Date(eventData.getEventEndDate).toDateString()}</p>
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
   placeOrderButton.addEventListener('click', async () => {
    if (isPlacingOrder) {
        return; // Exit if an order is already being placed
    }

    isPlacingOrder = true;

    try {
        const eventID = eventCard.getAttribute('data-event-id');
        const ticketTypeSelect = eventCard.querySelector('.ticket-type');
        const numberOfTickets = eventCard.querySelector('.ticket-quantity').value;
        const ticketCategoryDescription = ticketTypeSelect.value;

        // Log the request body
        const requestBody = {
            eventID: eventID, // Use the extracted eventID
            ticketCategoryDescription: ticketCategoryDescription,
            numberOfTickets: numberOfTickets
        };
        console.log('Request Body:', JSON.stringify(requestBody));

        // Call the function to place the order
        await placeNewOrder(eventID, ticketCategoryDescription, numberOfTickets);
    } finally {
        isPlacingOrder = false;
    }
});

    
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
  



  async function renderOrdersPage() {
    const mainContentDiv = document.querySelector('.main-content-component');
    mainContentDiv.innerHTML = getOrdersPageTemplate();
  
    try {
      const ordersData = await fetchOrders();
      addOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders data:', error);
      mainContentDiv.innerHTML = '<p>Error fetching orders data</p>';
    }
  
    async function fetchOrders() {
      try {
        const response = await fetch('http://localhost:8080/api/allOrders');
        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error('Error fetching orders data');
      }
    }
  }
  
  
  const addOrders = (orders) => {
    const ordersDiv = document.querySelector('.orders');
    ordersDiv.innerHTML = '';
  
    if (orders.length) {
      const reversedOrders = orders.slice().reverse(); // Reverse the order of the array
      reversedOrders.forEach((order, index) => {
        const orderNumber = orders.length - index; // Calculate the order number in reverse
        ordersDiv.appendChild(createOrderCard(order, orderNumber));
      });
    } else {
      ordersDiv.innerHTML = 'No orders';
    }
  };
  
  const createOrderCard = (orderData, orderNumber) => {
    const orderElement = document.createElement('div');
    orderElement.classList.add('order-card');
  
    const contentMarkup = `
      <h2 class="order-title">Order number ${orderNumber}</h2>
      <p class="order-details">Event ID: ${orderData.eventID}</p>
      <p class="order-details">Ordered At: ${new Date(orderData.orderedAt).toLocaleString()}</p>
      <p class="order-details">Number of Tickets: ${orderData.numberOfTickets}</p>
      <p class="order-details">Total Price: ${orderData.totalPrice}</p>
      <div class="order-buttons">
        <button class="delete-button">Sterge</button>
        <button class="edit-button">Modifica</button>
      </div>
    `;
  
    orderElement.innerHTML = contentMarkup;
  
    const deleteButton = orderElement.querySelector('.delete-button');
    const editButton = orderElement.querySelector('.edit-button');
  
    // Add event listeners for delete and edit buttons
    deleteButton.addEventListener('click', () => {
      // Handle delete button click for the corresponding order
      console.log(`Delete order with ID: ${orderData.orderID}`);
    });
  
    editButton.addEventListener('click', () => {
      // Handle edit button click for the corresponding order
      console.log(`Edit order with ID: ${orderData.orderID}`);
    });
  
    return orderElement;
  };
// Function to create the response body for a new order
const createNewOrderResponse = (eventID, ticketCategoryDescription, numberOfTickets) => {
    return {
      eventID: eventID,
      ticketCategoryDescription: ticketCategoryDescription,
      numberOfTickets: numberOfTickets
    };
  };
  
  
  // Function to create a new order card
  const createNewOrderCard = (orderData) => {
    const orderElement = document.createElement('div');
    orderElement.classList.add('order-card');
  
    const contentMarkup = `
      <h2 class="order-title">Order number ${orderData.orderNumber}</h2>
      <p class="order-details">Event ID: ${orderData.eventID}</p>
      <p class="order-details">Ordered At: ${new Date(orderData.orderedAt).toLocaleString()}</p>
      <p class="order-details">Number of Tickets: ${orderData.numberOfTickets}</p>
      <p class="order-details">Total Price: ${orderData.totalPrice}</p>
      <div class="order-buttons">
        <button class="delete-button">Sterge</button>
        <button class="edit-button">Modifica</button>
      </div>
    `;
  
    orderElement.innerHTML = contentMarkup;
  
    const deleteButton = orderElement.querySelector('.delete-button');
    const editButton = orderElement.querySelector('.edit-button');
  
    // Add event listeners for delete and edit buttons here
  
    return orderElement;
  };
  
  // Function to handle placing a new order
 // ... (previous code)

// Function to handle placing a new order
const placeNewOrder = async (eventID, ticketCategoryDescription, numberOfTickets) => {
    // Generate the response body for the new order
    const newOrderResponse = await createNewOrderResponse(
      eventID,
      ticketCategoryDescription,
      numberOfTickets
    );
  
    // Send the new order data to the server
    try {
      const response = await fetch('http://localhost:8080/api/placeOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newOrderResponse)
      });
  
      if (response.ok) {
        const newOrderData = await response.json();
        const newOrderCard = createNewOrderCard(newOrderData);
        
        // Append the new order card to the orders section
        const ordersDiv = document.querySelector('.orders');
        if (ordersDiv.firstChild) {
          ordersDiv.insertBefore(newOrderCard, ordersDiv.firstChild);
        } else {
          ordersDiv.appendChild(newOrderCard);
        }
      } else {
        console.error('Error placing order:', response.statusText);
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
};
// Add event listener for the "Place Order" button on the event card
document.addEventListener('click', async (event) => {
    if (event.target && event.target.classList.contains('place-order-btn')) {
      event.stopPropagation(); // Prevent the event from propagating further
      const eventCard = event.target.closest('.event-card');
      const eventID = eventCard.getAttribute('data-event-id');
      const ticketTypeSelect = eventCard.querySelector('.ticket-type');
      const numberOfTickets = eventCard.querySelector('.ticket-quantity').value;
      const ticketCategoryDescription = ticketTypeSelect.value;
  
      // Log the request body
      const requestBody = {
        eventID: eventID, // Use the extracted eventID
        ticketCategoryDescription: ticketCategoryDescription,
        numberOfTickets: numberOfTickets
      };
      console.log('Request Body:', JSON.stringify(requestBody));
  
      // Call the function to place the order
      await placeNewOrder(eventID, ticketCategoryDescription, numberOfTickets);
    }
  });
  function filterEventsBySearch(searchTerm, eventData) {
    const filteredEvents = eventData.filter(event => {
      return event.eventName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  
    const eventsDiv = document.querySelector('.events');
    eventsDiv.innerHTML = '';
  
    if (filteredEvents.length) {
      filteredEvents.forEach(event => {
        eventsDiv.appendChild(createEvent(event));
      });
    } else {
      eventsDiv.innerHTML = 'No matching events';
    }
  }
  
// Add event listener to the search bar input
const searchInput = document.getElementById('eventSearch');

searchInput.addEventListener('input', (event) => {
  const searchTerm = event.target.value;
  filterEventsBySearch(searchTerm, eventData); // Pass eventData here
});


  
// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage(); 