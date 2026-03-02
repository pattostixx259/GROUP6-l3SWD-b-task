// dashboard.js - Simple version with real icons only

// ========== DATA ==========
let products = [];
let deleteId = null;
let currentEditId = null;

// ========== START ==========
document.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    showUserName();
    loadProducts();
    showProducts();
    updateStats();
});

function checkLogin() {
    if (sessionStorage.getItem('loggedIn') !== 'true') {
        window.location.href = 'login.html';
    }
}

function showUserName() {
    let name = sessionStorage.getItem('userName') || 'User';
    document.getElementById('loggedUser').innerText = name;
}

function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}

function loadProducts() {
    let saved = localStorage.getItem('products');
    products = saved ? JSON.parse(saved) : [];
    if (products.length === 0) addDemoData();
}

function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

// ========== DISPLAY ==========
function showProducts() {
    let html = '';
    if (products.length === 0) {
        html = '<tr><td colspan="7" style="text-align:center; padding:20px;">📦 No products yet</td></tr>';
    } else {
        for (let i = 0; i < products.length; i++) {
            let p = products[i];
            let status = p.quantity > 0 ? '✅ In Stock' : '❌ Out of Stock';
            html += '<tr>' +
                '<td>' + (i+1) + '</td>' +
                '<td>' + p.name + '</td>' +
                '<td>' + p.category + '</td>' +
                '<td>' + p.quantity + '</td>' +
                '<td>$' + p.price.toFixed(2) + '</td>' +
                '<td>' + status + '</td>' +
                '<td>' +
                    '<button onclick="viewProduct(' + p.id + ')">👁️</button> ' +
                    '<button onclick="editProduct(' + p.id + ')">✏️</button> ' +
                    '<button onclick="deleteProduct(' + p.id + ')">🗑️</button>' +
                '</td>' +
                '</tr>';
        }
    }
    document.getElementById('productTable').innerHTML = html;
    updateStats();
}

function updateStats() {
    let total = products.length;
    let inStock = 0, outStock = 0, totalValue = 0;
    for (let i = 0; i < products.length; i++) {
        let p = products[i];
        if (p.quantity > 0) inStock++; else outStock++;
        totalValue += p.price * p.quantity;
    }
    document.getElementById('totalProducts').innerText = total;
    document.getElementById('inStock').innerText = inStock;
    document.getElementById('outStock').innerText = outStock;
    document.getElementById('totalValue').innerText = '$' + totalValue.toFixed(2);
}

// ========== ADD ==========
function openForm() {
    document.getElementById('popup').style.display = 'flex';
}

function closeForm() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('name').value = '';
    document.getElementById('category').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('price').value = '';
}

function addProduct() {
    let name = document.getElementById('name').value.trim();
    let category = document.getElementById('category').value.trim();
    let quantity = Number(document.getElementById('quantity').value) || 0;
    let price = Number(document.getElementById('price').value) || 0;
    
    if (name === '' || category === '') {
        alert('Please fill all fields');
        return;
    }
    
    products.push({
        id: Date.now(),
        name: name,
        category: category,
        quantity: quantity,
        price: price
    });
    
    saveProducts();
    showProducts();
    closeForm();
    alert('✅ Product added!');
}

// ========== VIEW ==========
function viewProduct(id) {
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            let p = products[i];
            alert('📦 Name: ' + p.name + '\n' +
                  '🏷️ Category: ' + p.category + '\n' +
                  '🔢 Quantity: ' + p.quantity + '\n' +
                  '💰 Price: $' + p.price + '\n' +
                  '📊 Status: ' + (p.quantity > 0 ? 'In Stock' : 'Out of Stock'));
            return;
        }
    }
}

// ========== EDIT ==========
function editProduct(id) {
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            currentEditId = id;
            document.getElementById('editName').value = products[i].name;
            document.getElementById('editCategory').value = products[i].category;
            document.getElementById('editQuantity').value = products[i].quantity;
            document.getElementById('editPrice').value = products[i].price;
            document.getElementById('editPopup').style.display = 'flex';
            return;
        }
    }
}

function closeEditForm() {
    document.getElementById('editPopup').style.display = 'none';
    currentEditId = null;
}

function updateProduct() {
    let name = document.getElementById('editName').value.trim();
    let category = document.getElementById('editCategory').value.trim();
    let quantity = Number(document.getElementById('editQuantity').value) || 0;
    let price = Number(document.getElementById('editPrice').value) || 0;
    
    if (name === '' || category === '') {
        alert('Please fill all fields');
        return;
    }
    
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === currentEditId) {
            products[i].name = name;
            products[i].category = category;
            products[i].quantity = quantity;
            products[i].price = price;
            break;
        }
    }
    
    saveProducts();
    showProducts();
    closeEditForm();
    alert('✏️ Product updated!');
}

// ========== DELETE ==========
function deleteProduct(id) {
    deleteId = id;
    document.getElementById('deleteModal').style.display = 'flex';
}

function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
    deleteId = null;
}

function confirmDelete() {
    let newProducts = [];
    for (let i = 0; i < products.length; i++) {
        if (products[i].id !== deleteId) {
            newProducts.push(products[i]);
        }
    }
    products = newProducts;
    saveProducts();
    showProducts();
    closeDeleteModal();
    alert('🗑️ Product deleted!');
}

// ========== SEARCH ==========
function searchProducts() {
    let search = document.getElementById('searchInput').value.toLowerCase();
    if (search === '') {
        showProducts();
        return;
    }
    
    let html = '';
    let found = false;
    let count = 0;
    
    for (let i = 0; i < products.length; i++) {
        let p = products[i];
        if (p.name.toLowerCase().includes(search) || p.category.toLowerCase().includes(search)) {
            found = true;
            count++;
            let status = p.quantity > 0 ? '✅ In Stock' : '❌ Out of Stock';
            html += '<tr>' +
                '<td>' + count + '</td>' +
                '<td>' + p.name + '</td>' +
                '<td>' + p.category + '</td>' +
                '<td>' + p.quantity + '</td>' +
                '<td>$' + p.price.toFixed(2) + '</td>' +
                '<td>' + status + '</td>' +
                '<td>' +
                    '<button onclick="viewProduct(' + p.id + ')">👁️</button> ' +
                    '<button onclick="editProduct(' + p.id + ')">✏️</button> ' +
                    '<button onclick="deleteProduct(' + p.id + ')">🗑️</button>' +
                '</td>' +
                '</tr>';
        }
    }
    
    if (!found) {
        html = '<tr><td colspan="7" style="text-align:center; padding:20px;">🔍 No products found</td></tr>';
    }
    
    document.getElementById('productTable').innerHTML = html;
}

// ========== FILTER ==========
function filterProducts(type) {
    let html = '';
    let count = 0;
    
    for (let i = 0; i < products.length; i++) {
        let p = products[i];
        let show = false;
        if (type === 'all') show = true;
        else if (type === 'instock' && p.quantity > 0) show = true;
        else if (type === 'outstock' && p.quantity === 0) show = true;
        else if (type === 'lowstock' && p.quantity > 0 && p.quantity < 10) show = true;
        
        if (show) {
            count++;
            let status = p.quantity > 0 ? '✅ In Stock' : '❌ Out of Stock';
            html += '<tr>' +
                '<td>' + count + '</td>' +
                '<td>' + p.name + '</td>' +
                '<td>' + p.category + '</td>' +
                '<td>' + p.quantity + '</td>' +
                '<td>$' + p.price.toFixed(2) + '</td>' +
                '<td>' + status + '</td>' +
                '<td>' +
                    '<button onclick="viewProduct(' + p.id + ')">👁️</button> ' +
                    '<button onclick="editProduct(' + p.id + ')">✏️</button> ' +
                    '<button onclick="deleteProduct(' + p.id + ')">🗑️</button>' +
                '</td>' +
                '</tr>';
        }
    }
    
    if (count === 0) {
        html = '<tr><td colspan="7" style="text-align:center; padding:20px;">📭 No products</td></tr>';
    }
    
    document.getElementById('productTable').innerHTML = html;
}

// ========== DEMO ==========
function addDemoData() {
    products = [
        { id: 1001, name: 'Laptop', category: 'Electronics', quantity: 15, price: 999.99 },
        { id: 1002, name: 'Mouse', category: 'Electronics', quantity: 25, price: 29.99 },
        { id: 1003, name: 'Keyboard', category: 'Electronics', quantity: 0, price: 79.99 },
        { id: 1004, name: 'Chair', category: 'Furniture', quantity: 8, price: 199.99 }
    ];
    saveProducts();
}

// ========== NAVIGATION ==========
function showDashboard() {
    document.getElementById('pageTitle').innerHTML = '📊 Dashboard';
    showProducts();
}

function showLowStock() {
    document.getElementById('pageTitle').innerHTML = '⚠️ Low Stock';
    filterProducts('lowstock');
}