// Order form handling
function openOrderModal() {
    if (cart.length === 0) {
        alert('Please add items to your cart first!');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'orderModal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close" onclick="closeOrderModal()">&times;</span>
            <h2 class="modal-title">Complete Your Order</h2>
            
            <div class="order-summary">
                ${cart.map(item => `
                    <div class="summary-item">
                        <span>${item.name} (${item.quantity}x)</span>
                        <span>RM ${item.totalPrice}</span>
                    </div>
                `).join('')}
                <div class="summary-item summary-total">
                    <span>Total Amount:</span>
                    <span>RM ${cartTotal}</span>
                </div>
            </div>
            
            <form id="orderForm" onsubmit="handleOrderSubmit(event)">
                <div class="form-group">
                    <label for="customerName">Name:</label>
                    <input type="text" id="customerName" class="form-control" required>
                </div>
                
                <div class="form-group">
                    <label for="roomNumber">Room Number:</label>
                    <input type="text" id="roomNumber" class="form-control">
                </div>
                
                <div class="form-group">
                    <label for="paymentType">Payment Method:</label>
                    <select id="paymentType" class="form-select" required>
                        <option value="Cash">Cash</option>
                        <option value="Card">Card</option>
                        <option value="Online">Online Transfer</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="orderType">Order Type:</label>
                    <select id="orderType" class="form-select" required>
                        <option value="Dine-In">Dine-In</option>
                        <option value="Takeaway">Takeaway</option>
                        <option value="Delivery">Delivery</option>
                    </select>
                </div>
                
                <button type="submit" class="form-submit">Place Order</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

function closeOrderModal() {
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.remove();
    }
}

async function handleOrderSubmit(event) {
    event.preventDefault();
    
    const customerName = document.getElementById('customerName').value;
    const roomNumber = document.getElementById('roomNumber').value;
    const paymentType = document.getElementById('paymentType').value;
    const orderType = document.getElementById('orderType').value;
    
    try {
        await submitOrder(customerName, roomNumber, paymentType, orderType);
        closeOrderModal();
    } catch (error) {
        console.error('Error handling order submission:', error);
    }
}

// Export functions
window.openOrderModal = openOrderModal;
window.closeOrderModal = closeOrderModal;
window.handleOrderSubmit = handleOrderSubmit;