// Event listener for form submission
document.getElementById('productForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent form from reloading the page

    // Get form values
    const code = document.getElementById('code').value.trim();
    const description = document.getElementById('description').value.trim();
    const price = document.getElementById('price').value.trim();
    const quantity = document.getElementById('quantity').value.trim();

    // Clear response div
    const responseDiv = document.getElementById('response');
    responseDiv.innerText = '';

    try {
        // Axios POST request
        const response = await axios.post('/api/check-code', {
            code,
            description,
            price,
            quantity
        });

        // Show success message
        responseDiv.innerText = response.data.message;
    } catch (error) {
        // Show error message
        console.error('Error:', error.response?.data?.error || error.message);
        responseDiv.innerText = error.response?.data?.error || 'An error occurred while adding the product.';
    }
});
