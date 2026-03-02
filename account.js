// account.js - Fixed registration

// Register function
function registerUser() {
    // Get all input values
    const inputs = document.querySelectorAll('.input input');
    const fullname = inputs[0].value.trim();
    const email = inputs[1].value.trim();
    const password = inputs[2].value;
    const confirmPass = inputs[3].value;
    
    // Validation
    if (!fullname || !email || !password || !confirmPass) {
        alert('Please fill in all fields!');
        return false;
    }
    
    // Email validation
    if (!email.includes('@') || !email.includes('.')) {
        alert('Please enter a valid email address!');
        return false;
    }
    
    // Password validation
    if (password.length < 6) {
        alert('Password must be at least 6 characters!');
        return false;
    }
    
    // Confirm password
    if (password !== confirmPass) {
        alert('Passwords do not match!');
        return false;
    }
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        alert('Email already registered! Please login.');
        window.location.href = 'login.html';
        return false;
    }
    
    // Add new user
    const newUser = {
        name: fullname,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    console.log('User registered:', newUser); // Debug
    console.log('All users:', users); // Debug
    
    alert('Registration successful! Please login with your email and password.');
    window.location.href = 'login.html';
    return false;
}

// Add event listener to register button
document.addEventListener('DOMContentLoaded', function() {
    const registerBtn = document.querySelector('.btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            registerUser();
        });
    }
    
    // Add enter key support
    const inputs = document.querySelectorAll('.input input');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                registerUser();
            }
        });
    });
});