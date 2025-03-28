document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('reviewForm');
    const stars = document.querySelectorAll('.star-rating i');
    let currentRating = 0;

    // Star rating functionality
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.getAttribute('data-rating'));
            currentRating = rating;
            
            // Update star display
            stars.forEach((s, index) => {
                s.classList.toggle('fas', index < rating);
                s.classList.toggle('far', index >= rating);
            });
        });
    });

    // Form submission
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const reviewText = document.getElementById('review').value;
        const email = document.getElementById('email').value;
        
        if (currentRating === 0) {
            alert('Please select a rating');
            return;
        }

        // Create new review element
        const reviewContainer = document.getElementById('reviewsContainer');
        const newReview = document.createElement('div');
        newReview.className = 'review-card glass-card';
        newReview.innerHTML = `
            <div class="review-header">
                <div class="reviewer">${name}</div>
                <div class="stars">
                    ${'<i class="fas fa-star"></i>'.repeat(currentRating)}
                    ${'<i class="far fa-star"></i>'.repeat(5 - currentRating)}
                </div>
            </div>
            <div class="review-content">
                "${reviewText}"
            </div>
            <div class="review-date">${new Date().toLocaleDateString()}</div>
        `;

        // Add new review to the top
        reviewContainer.insertBefore(newReview, reviewContainer.firstChild);
        
        // Reset form
        reviewForm.reset();
        stars.forEach(star => {
            star.classList.remove('fas');
            star.classList.add('far');
        });
        currentRating = 0;
        
        alert('Thank you for your review!');
    });
});