/**
 * about.js
 * This module manages the product details and interactions on the product detail page.
 * @returns {Object} Object containing product details and related methods.
 */
function productDetails() {
    return {
        product: {}, // Holds the product details fetched from the API
        isFavorited: false, // Indicates if the product is favorited
        loading: true, // Indicates if the data is still being loaded
        sortPrice: '', // Stores sorting criteria based on price
        sortType: '',  // Stores sorting criteria based on type
        
        /**
         * Initializes the product details by fetching data from the API.
         * It also retrieves sorting parameters from the URL and updates the back link.
         */
        init() {
            // Retrieve query parameters from the URL
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get('id');
            this.sortPrice = urlParams.get('sortPrice') || ''; // Get sorting criteria for price
            this.sortType = urlParams.get('sortType') || ''; // Get sorting criteria for type

            if (id) {
                // Fetch product data from the API using the product ID
                fetch(`https://fakestoreapi.com/products/${id}`)
                    .then(res => res.json()) // Parse the response as JSON
                    .then(json => {
                        this.product = json; // Store the product details
                        this.isFavorited = this.checkWishlist(json.id); // Check if the product is in the wishlist
                    })
                    .catch(err => console.error('Error fetching product data:', err)) // Handle any errors
                    .finally(() => {
                        this.loading = false; // Set loading to false once data is fetched
                        this.updateBackLink(); // Update the back link with sorting parameters
                    });
            } else {
                // Handle case where no product ID is provided
                this.product = { title: 'Product not found.' }; // Set default message for missing product
                this.loading = false; // Set loading to false
                this.updateBackLink(); // Update the back link even when product is not found
            }
        },

        /**
         * Updates the href of the back link with sorting parameters.
         * This ensures that when the user navigates back, the sorting criteria are preserved.
         */
        updateBackLink() {
            const backLink = document.getElementById('backLink');
            if (backLink) {
                const url = new URL('Shoppings/mains/index.html', window.location.origin);
                url.searchParams.set('sortPrice', this.sortPrice); // Append sorting criteria for price
                url.searchParams.set('sortType', this.sortType); // Append sorting criteria for type
                backLink.href = url.toString(); // Update the href attribute of the back link
            }
        },

        /**
         * Checks if a product is in the wishlist.
         * @param {number} productId - The ID of the product to check.
         * @returns {boolean} True if the product is in the wishlist, false otherwise.
         */
        checkWishlist(productId) {
            // Implement your wishlist check logic here
            return false; // Placeholder return value, needs implementation
        }
    };
}
