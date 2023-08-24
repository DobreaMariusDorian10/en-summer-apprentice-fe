 
// ... (previous code)

export const createOrderCard = (orderData, orderNumber) => {
    const orderElement = document.createElement('div');
    orderElement.classList.add('order-card');
  
    orderElement.setAttribute('data-order-number', orderNumber);
  
    const formattedTotalPrice = '$' + orderData.totalPrice;
  
    const contentMarkup = `
      <h2 class="order-title">Order number ${orderNumber}</h2>
      <p class="order-details">Event ID: ${orderData.eventID}</p>
      <p class="order-details">Ordered At: ${new Date(orderData.orderedAt).toLocaleString()}</p>
      <p class="order-details">Number of Tickets: <span class="editable-tickets">${orderData.numberOfTickets}</span></p>
      <p class="order-details">Ticket Type: <span class="editable-type">${orderData.ticketCategoryDTO.description}</span></p>
      <p class="order-details">Total Price: <span class="editable-total-price">${formattedTotalPrice}</span></p>
      <div class="order-buttons">
        <button class="delete-button">Sterge</button>
        <button class="save-button" style="display: none;">Salveaza</button>
        <button class="edit-button">Modifica</button>
      </div>
    `;
  
    orderElement.innerHTML = contentMarkup;
  
    const deleteButton = orderElement.querySelector('.delete-button');
    const saveButton = orderElement.querySelector('.save-button');
    const editButton = orderElement.querySelector('.edit-button');
    const editableTickets = orderElement.querySelector('.editable-tickets');
    const editableType = orderElement.querySelector('.editable-type');
    const editableTotalPrice = orderElement.querySelector('.editable-total-price');
  
    // Initialize editable state
    let isEditable = false;
  
    deleteButton.addEventListener('click', async () => {
      const orderNumber = orderElement.getAttribute('data-order-number');
      await deleteOrder(orderNumber);
  
      // Optionally, remove the deleted order card from the DOM
      orderElement.remove();
    });
  
    editButton.addEventListener('click', () => {
      if (!isEditable) {
        isEditable = true;
  
        // Replace the ticket quantity with an input field
        editableTickets.innerHTML = `<input type="number" class="edited-quantity" value="${orderData.numberOfTickets}" />`;
  
        // Replace the ticket type with a dropdown
        editableType.innerHTML = `
          <select class="edited-type">
            <option value="Standard" ${orderData.ticketCategoryDTO.description === 'Standard' ? 'selected' : ''}>Standard</option>
            <option value="VIP" ${orderData.ticketCategoryDTO.description === 'VIP' ? 'selected' : ''}>VIP</option>
          </select>
        `;
  
        // Display the "Salveaza" button
        saveButton.style.display = 'block';
      }
    });
  
    // ...

    saveButton.addEventListener('click', async () => {
        if (isEditable) {
          isEditable = false;
          const editedQuantity = orderElement.querySelector('.edited-quantity').value;
          const editedType = orderElement.querySelector('.edited-type').value;
          const orderID = orderElement.getAttribute('data-order-number');
      
          const patchData = {
            orderID: parseInt(orderID),
            ticketCategoryDescription: editedType,
            nrTickets: parseInt(editedQuantity)
          };
      
          try {
            const response = await fetch('http://localhost:8080/api/patchOrder', {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(patchData)
            });
      
            if (response.ok) {
              const updatedOrderData = await response.json();
              
              // Update the order data in memory
              orderData.numberOfTickets = parseInt(editedQuantity);
              orderData.ticketCategoryDTO.description = editedType;
              orderData.totalPrice = updatedOrderData.totalPrice; // Update the total price here
      
              // Update the order card content with the edited data
              editableTickets.textContent = editedQuantity;
              editableType.textContent = editedType;
              editableTotalPrice.textContent = '$' + updatedOrderData.totalPrice; // Update total price display with "$"
      
              // Hide the "Salveaza" button
              saveButton.style.display = 'none';
            } else {
              console.error('Error updating order:', response.statusText);
            }
          } catch (error) {
            console.error('Error updating order:', error);
          }
        }
    });
    
  
  // ...
  
    // Rest of the event listeners and code...
  
    return orderElement;
  };