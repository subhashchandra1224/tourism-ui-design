document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('overlay');
    const bookingPopup = document.getElementById('bookingPopup');
    const successPopup = document.getElementById('successPopup');
    const closePopup = document.getElementById('closePopup');
    const bookingForm = document.getElementById('bookingForm');
    const packageNameInput = document.getElementById('packageName');

    // Add click event listeners to all "Book Now" buttons
    document.querySelectorAll('.cta-button-outline').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const packageCard = this.closest('.package-card');
            const packageName = packageCard.querySelector('h3').textContent;
            packageNameInput.value = packageName;
            
            // Show booking popup
            overlay.style.display = 'block';
            bookingPopup.style.display = 'block';
        });
    });

    // Close popup when clicking on overlay or close button
    overlay.addEventListener('click', closeAllPopups);
    closePopup.addEventListener('click', closeAllPopups);

    // Handle form submission
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Hide booking popup
        bookingPopup.style.display = 'none';
        
        // Show success message
        successPopup.style.display = 'block';
        
        // Reset form
        bookingForm.reset();
        
        // Hide success message after 3 seconds
        setTimeout(() => {
            successPopup.style.display = 'none';
            overlay.style.display = 'none';
        }, 3000);
    });

    function closeAllPopups() {
        overlay.style.display = 'none';
        bookingPopup.style.display = 'none';
        successPopup.style.display = 'none';
    }

    // Set minimum date for travel date input to today
    const travelDateInput = document.getElementById('travelDate');
    const today = new Date().toISOString().split('T')[0];
    travelDateInput.min = today;
}); 