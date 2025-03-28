document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('reviewForm');
    const stars = document.querySelectorAll('.star-rating i');
    let currentRating = 0;

    // Load saved reviews
    const savedReviews = JSON.parse(localStorage.getItem('speedTestReviews') || '[]');
    const reviewContainer = document.getElementById('reviewsContainer');
    
    savedReviews.forEach(review => {
        const reviewElement = createReviewElement(review);
        reviewContainer.appendChild(reviewElement);
    });

    // Star rating functionality
    stars.forEach(star => {
        star.addEventListener('click', () => {
            currentRating = parseInt(star.getAttribute('data-rating'));
            updateStars(currentRating);
        });

        star.addEventListener('mouseover', () => {
            const hoverRating = parseInt(star.getAttribute('data-rating'));
            updateStars(hoverRating);
        });

        star.addEventListener('mouseout', () => {
            updateStars(currentRating);
        });
    });

    function updateStars(rating) {
        stars.forEach((star, index) => {
            star.classList.toggle('fas', index < rating);
            star.classList.toggle('far', index >= rating);
        });
    }

    // Form submission
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const reviewText = document.getElementById('review').value.trim();
        const email = document.getElementById('email').value.trim();
        
        if (!validateInput(name, reviewText, email, currentRating)) {
            return;
        }

        // Save review
        const newReview = {
            name,
            rating: currentRating,
            review: reviewText,
            email,
            date: new Date().toLocaleDateString()
        };
        
        saveReview(newReview);
        displayNewReview(newReview);
        resetForm();
        
        alert('Thank you for your review!');
    });

    function validateInput(name, review, email, rating) {
        if (!name || !review || !email) {
            alert('Please fill in all fields');
            return false;
        }
        if (rating === 0) {
            alert('Please select a rating');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Please enter a valid email');
            return false;
        }
        return true;
    }

    function createReviewElement(review) {
        const element = document.createElement('div');
        element.className = 'review-card glass-card';
        element.innerHTML = `
            <div class="review-header">
                <div class="reviewer">${review.name}</div>
                <div class="stars">
                    ${'<i class="fas fa-star"></i>'.repeat(review.rating)}
                    ${'<i class="far fa-star"></i>'.repeat(5 - review.rating)}
                </div>
            </div>
            <div class="review-content">
                "${review.review}"
            </div>
            <div class="review-date">${review.date}</div>
        `;
        return element;
    }

    function saveReview(review) {
        const reviews = JSON.parse(localStorage.getItem('speedTestReviews') || '[]');
        reviews.unshift(review);
        localStorage.setItem('speedTestReviews', JSON.stringify(reviews));
    }

    function displayNewReview(review) {
        const reviewContainer = document.getElementById('reviewsContainer');
        reviewContainer.insertBefore(
            createReviewElement(review),
            reviewContainer.firstChild
        );
    }

    function resetForm() {
        reviewForm.reset();
        updateStars(0);
        currentRating = 0;
    }
});