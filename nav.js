// Function to check if user is logged in and update UI
function checkUserAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginLink = document.getElementById('loginLink');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');

    if (currentUser && currentUser.username) {
        loginLink.style.display = 'none';
        userInfo.style.display = 'inline-flex';
        userName.textContent = currentUser.username;
    } else {
        loginLink.style.display = 'inline';
        userInfo.style.display = 'none';
        loginLink.textContent = 'Login';
    }
}

// Function to handle logout
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'user-login.html';
}

// Function to update active navigation link
function updateActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    checkUserAuth();
    updateActiveNav();
}); 