// login.js - Fixed to check against registered users

// Login function
function loginuser() {
    // Get input values
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Simple validation
    if (!email || !password) {
        alert('Please fill in all fields!');
        return;
    }
    
    // Get users from localStorage (registered users)
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Debug: Check what users exist
    console.log('Registered users:', users);
    console.log('Attempting login with:', email, password);
    
    // Check if user exists in registered users
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Save user info to session
        sessionStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('userName', user.name);
        sessionStorage.setItem('userEmail', user.email);
        
        alert('Login successful! Welcome ' + user.name);
        window.location.href = 'dashboard.html';
    } else {
        // Check if user exists but password wrong
        const userExists = users.find(u => u.email === email);
        if (userExists) {
            alert('Wrong password! Please try again.');
        } else {
            alert('Email not registered! Please create an account first.');
        }
    }
}

// Check if user is already logged in
function checkLogin() {
    if (sessionStorage.getItem('loggedIn') === 'true') {
        window.location.href = 'dashboard.html';
    }
}

// Add enter key support
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loginuser();
            }
        });
    }
});

// Auto-check login on page load
checkLogin();

// For testing - add a default test user if none exists
document.addEventListener('DOMContentLoaded', function() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.length === 0) {
        // Add a test user
        users.push({
            name: 'Test User',
            email: 'test@test.com',
            password: 'test123',
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Test user created: test@test.com / test123');
    }
});