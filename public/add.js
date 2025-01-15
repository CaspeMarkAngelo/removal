document.getElementById('productForm').addEventListener('submit', async function (e) {
    e.preventDefault(); 

    const code = document.getElementById('code').value.trim();
    const description = document.getElementById('description').value.trim();
    const price = document.getElementById('price').value.trim();
    const quantity = document.getElementById('quantity').value.trim();

    const responseDiv = document.getElementById('response');
    responseDiv.innerText = '';

    try {
        const response = await axios.post('/api/check-code', {
            code,
            description,
            price,
            quantity
        });

        responseDiv.innerText = response.data.message;
    } catch (error) {
        console.error('Error:', error.response?.data?.error || error.message);
        responseDiv.innerText = error.response?.data?.error || 'An error occurred while adding the product.';
    }
});
