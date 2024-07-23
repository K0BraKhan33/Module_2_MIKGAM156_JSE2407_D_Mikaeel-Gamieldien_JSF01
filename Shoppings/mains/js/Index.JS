/**
 * Index.js
 * This module manages the product list component for GoodMarting, including sorting, filtering, and navigation.
 * 
 * @returns {Object} - Alpine.js data object with product list functionality.
 */
function productList() {
    return {
        /**
         * @type {Array} - Array containing all product items fetched from the API.
         */
        items: [],
        /**
         * @type {Array} - Array containing filtered product items based on selected criteria.
         */
        filteredItems: [],
        /**
         * @type {Array} - Array of product categories fetched from the API.
         */
        categories: [],
        /**
         * @type {boolean} - Indicates if data is currently being loaded.
         */
        isLoading: true,
        /**
         * @type {boolean} - Indicates if there was an error during data fetching.
         */
        hasError: false,
        /**
         * @type {string} - Selected price sorting criteria (e.g., 'priceAsc', 'priceDesc').
         */
        sortPrice: '', // Default value
        /**
         * @type {string} - Selected category for filtering products.
         */
        sortType: '', // Default value

        /**
         * Initializes the component by fetching product and category data from the API,
         * and setting initial sorting and filtering values from URL parameters.
         */
        async init() {
            try {
                // Fetch product data and categories in parallel
                const [productsResponse, categoriesResponse] = await Promise.all([
                    fetch('https://fakestoreapi.com/products'),
                    fetch('https://fakestoreapi.com/products/categories')
                ]);

                // Parse the JSON responses
                const products = await productsResponse.json();
                const categories = await categoriesResponse.json();

                // Initialize the items and categories
                this.items = products;
                this.filteredItems = products;
                this.categories = categories;

                // Retrieve sorting and filtering criteria from URL parameters
                const urlParams = new URLSearchParams(window.location.search);
                this.sortPrice = urlParams.get('sortPrice') || ''; // Default to empty string if not present
                this.sortType = urlParams.get('sortType') || ''; // Default to empty string if not present

                // Set the dropdown values based on URL parameters
                document.getElementById('sortPrice').value = this.sortPrice;
                document.getElementById('sortType').value = this.sortType;

            } catch (err) {
                console.error('Error fetching data:', err); // Log any errors
                this.hasError = true; // Set error state to true if fetching fails
            } finally {
                this.isLoading = false; // Set loading state to false once data is fetched
                this.applyFiltersAndSorting(); // Apply filters and sorting based on the current state
            }
        },

        /**
         * Navigates to a specific URL with current sorting and filtering criteria appended as URL parameters.
         * 
         * @param {string} url - The URL to navigate to
         */
        navigateTo(url) {
            const urlParams = new URLSearchParams({
                sortPrice: this.sortPrice,
                sortType: this.sortType
            });
            window.location.href = `${url}&${urlParams.toString()}`; // Append URL parameters
        },

        /**
         * Updates the sorting and filtering criteria based on user selection and updates the URL.
         */
        sortItemsCombined() {
            this.sortPrice = document.getElementById('sortPrice').value;
            this.sortType = document.getElementById('sortType').value;

            // Update URL parameters with current sorting and filtering criteria
            const urlParams = new URLSearchParams({
                sortPrice: this.sortPrice,
                sortType: this.sortType
            });
            window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);

            this.applyFiltersAndSorting(); // Apply the updated filters and sorting
        },

        /**
         * Applies sorting and filtering to the items based on the current criteria.
         */
        applyFiltersAndSorting() {
            let items = [...this.items]; // Create a copy of the items array

            // Filter items by category if a category is selected
            if (this.sortType) {
                items = items.filter(item => item.category === this.sortType);
            }

            // Sort items based on the selected sorting criteria
            if (this.sortPrice) {
                items.sort((a, b) => {
                    switch (this.sortPrice) {
                        case 'priceAsc':
                            return a.price - b.price;
                        case 'priceDesc':
                            return b.price - a.price;
                        case 'titleAsc':
                            return a.title.localeCompare(b.title);
                        case 'titleDesc':
                            return b.title.localeCompare(a.title);
                        default:
                            return 0;
                    }
                });
            }

            this.filteredItems = items; // Update filtered items with the sorted and filtered results
        }
    };
}
