// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBi03pGrUkrulFjIUe6Pd9KC3CZz-AvpBI",
  authDomain: "ramen-sibox-2b0d7.firebaseapp.com",
  projectId: "ramen-sibox-2b0d7",
  storageBucket: "ramen-sibox-2b0d7.firebasestorage.app",
  messagingSenderId: "182662563425",
  appId: "1:182662563425:web:ea3ab8faf2a2c30d29cc20"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Cart state
let cart = [];
let cartTotal = 0;

// Function to fetch product inventory
async function getProductInventory(productName) {
    try {
        const inventoryRef = collection(db, 'Inventory');
        const querySnapshot = await getDocs(inventoryRef);
        const item = querySnapshot.docs.find(doc => doc.data().name === productName);
        return item ? { id: item.id, ...item.data() } : null;
    } catch (error) {
        console.error('Error fetching product inventory:', error);
        return null;
    }
}

// Function to update product quantity
async function updateProductQuantity(productId, newQuantity) {
    try {
        const inventoryRef = doc(db, 'Inventory', productId);
        await updateDoc(inventoryRef, {
            quantity: newQuantity
        });
    } catch (error) {
        console.error('Error updating product quantity:', error);
        throw error;
    }
}

// Function to add item to cart
async function addToCart(productName, basePrice, quantityId) {
    const quantity = parseInt(document.getElementById(`${quantityId}-qty`).value);
    const addon = document.querySelector('input[name="addon"]:checked').value;
    
    // Get product inventory
    const product = await getProductInventory(productName);
    if (!product) {
        alert('Product not found in inventory!');
        return;
    }
    
    // Check if enough inventory
    if (product.quantity < quantity) {
        alert(`Sorry, only ${product.quantity} items available in stock!`);
        return;
    }
    
    // Calculate addon price
    let addonPrice = 0;
    switch(addon) {
        case 'masak':
            addonPrice = 1;
            break;
        case 'masak-telur':
            addonPrice = 2;
            break;
    }
    
    const totalPrice = (basePrice + addonPrice) * quantity;
    
    // Add to cart array
    cart.push({
        productId: product.id,
        name: productName,
        quantity: quantity,
        addon: addon,
        basePrice: basePrice,
        addonPrice: addonPrice,
        totalPrice: totalPrice
    });
    
    updateCartDisplay();
}

// Function to update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const cartCountElement = document.querySelector('.cart-count');
    
    cartItems.innerHTML = '';
    cartTotal = 0;
    
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div>Qty: ${item.quantity} | ${item.addon}</div>
            </div>
            <div class="cart-item-price">RM ${item.totalPrice}</div>
            <div class="cart-item-remove" onclick="removeFromCart(${index})">×</div>
        `;
        cartItems.appendChild(itemElement);
        cartTotal += item.totalPrice;
    });
    
    cartTotalElement.textContent = `RM ${cartTotal}`;
    cartCountElement.textContent = cart.length;
}

// Function to remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

// Function to submit order
async function submitOrder(customerName, roomNumber, paymentType, orderType) {
    try {
        // Create order document with items array
        const orderData = {
            customerName: customerName,
            roomNumber: roomNumber,
            paymentType: paymentType,
            orderType: orderType,
            items: cart,
            totalAmount: cartTotal,
            status: 'Pending',
            orderDate: serverTimestamp()
        };
        
        // Add order to Firebase
        const ordersRef = collection(db, 'orders');
        const orderDoc = await addDoc(ordersRef, orderData);
        
        // Update product quantities
        for (const item of cart) {
            const product = await getProductInventory(item.name);
            if (product) {
                await updateProductQuantity(product.id, product.quantity - item.quantity);
            }
        }
        
        // Clear cart
        cart = [];
        updateCartDisplay();
        
        alert('Order submitted successfully!');
        return orderDoc.id;
        
    } catch (error) {
        console.error('Error submitting order:', error);
        alert('Error submitting order. Please try again.');
        throw error;
    }
}

// Export functions
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.submitOrder = submitOrder;
window.toggleCart = function() {
    document.getElementById('cartPreview').classList.toggle('active');
};