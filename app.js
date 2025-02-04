const express = require('express');
const mysql = require('mysql');

const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'product_crud'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.message);
    }
    console.log('Connected to MySQL');
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err.message);
            return res.status(500).send('Error fetching products');
        }
        res.render('index', { products: results });
    });
});

app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/api/check-code', (req, res) => {
    const { code, description, price, quantity } = req.body;
    const checkQuery = 'SELECT * FROM products WHERE code = ?';
    db.query(checkQuery, [code], (err, results) => {
        if (err) {
            console.error('Error in SELECT Query:', err.message);
        }

        console.log('SELECT Query Results:', results);

        if (results.length > 0) {
            const existingQuantity = results[0].quantity;
            const newQuantity = existingQuantity + parseInt(quantity, 10);
            const updateQuery = 'UPDATE products SET quantity = ? WHERE code = ?';

            db.query(updateQuery, [newQuantity, code], err => {
                if (err) {
                    console.log(err);
                }
                console.log('UPDATE Success:', { code, newQuantity });
                res.json({ message: 'Quantity updated', updatedQuantity: newQuantity });
            });
        } else {
            const insertQuery = 'INSERT INTO products (code, description, price, quantity) VALUES (?, ?, ?, ?)';

            db.query(insertQuery, [code, description, price, quantity], err => {
                if (err) {
                    console.log(err);
                }
                console.log('INSERT Success:', { code, description, price, quantity });
                res.json({ message: 'Product added' });
            });
        }
    });
});

app.get('/edit/:id', (req, res) => {
    const query = 'SELECT * FROM products WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.log(err);
        }
        if (results.length === 0) {
            return res.send('Product not found');
        }
        res.render('edit', { product: results[0] });
    });
});

app.post('/edit/:id', (req, res) => {
    const { code, description, price, quantity } = req.body;

    const query = 'UPDATE products SET code = ?, description = ?, price = ?, quantity = ? WHERE id = ?';
    db.query(query, [code, description, price, quantity, req.params.id], err => {
        if (err) {
            console.error('Error in UPDATE Query:', err.message);
            return res.send('Error updating product');
        }
        res.redirect('/');
    });
});

app.get('/delete/:id', (req, res) => {
    const query = 'DELETE FROM products WHERE id = ?';
    db.query(query, [req.params.id], err => {
        if (err) {
            console.error('Error in DELETE Query:', err.message);
            return res.send('Error deleting product');
        }
        res.redirect('/');
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
