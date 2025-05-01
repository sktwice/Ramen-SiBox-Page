// Import Firebase modules
import { getFirestore, collection, getDocs, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Get Firestore instance from the existing config
const db = getFirestore();

// Function to update stock display
function updateStockDisplay(productId, quantity) {
    const stockDisplays = document.querySelectorAll(`[data-product-id="${productId}"] .stock-display`);
    stockDisplays.forEach(display => {
        display.textContent = `Stock: ${quantity}`;
        
        // Update related quantity input max value
        const quantityInput = display.closest('.product-card').querySelector('.quantity-input');
        if (quantityInput) {
            quantityInput.max = quantity;
            // If current value is more than new max, adjust it
            if (parseInt(quantityInput.value) > quantity) {
                quantityInput.value = quantity;
            }
        }
    });
}

// Initialize real-time stock monitoring
async function initializeStockMonitoring() {
    const inventoryRef = collection(db, 'Inventory');
    
    // Set up real-time listener
    onSnapshot(inventoryRef, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            const item = change.doc.data();
            updateStockDisplay(change.doc.id, item.quantity);
        });
    });
}

// Start monitoring when the page loads
document.addEventListener('DOMContentLoaded', initializeStockMonitoring);