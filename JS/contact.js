document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const successPopup = document.getElementById('successPopup');
    const overlay = document.getElementById('overlay');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Here you would typically send the form data to your server
        // For now, we'll just show the success message
        
        // Show the overlay and success message
        overlay.style.display = 'block';
        successPopup.style.display = 'block';

        // Reset the form
        contactForm.reset();

        // Hide the message after 3 seconds
        setTimeout(() => {
            overlay.style.display = 'none';
            successPopup.style.display = 'none';
        }, 3000);
    });

    // Close popup when clicking on overlay
    overlay.addEventListener('click', function() {
        overlay.style.display = 'none';
        successPopup.style.display = 'none';
    });
}); 