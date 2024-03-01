const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;

const cors = require('cors');
app.use(cors());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'myreact',
    password: 'root',
    port: 5432, 
});

pool.connect()
    .then(() => {
        console.log("Connected to PostgreSQL database!");
    })
    .catch(err => {
        console.error("Error connecting to PostgreSQL:", err.message);
    });

app.use(bodyParser.json());

// Insert user operation
app.post('/users', (req, res) => {
    const { name, age, phone_no, location } = req.body;
    const sql = "INSERT INTO users (name, age, phone_no, location) VALUES ($1, $2, $3, $4)";
    pool.query(sql, [name, age, phone_no, location], (err, result) => {
        if (err) throw err;
        res.send("User inserted successfully");
    });
});

// Get All Data
app.get('/users', (req, res) => {
    pool.query('SELECT * FROM users', (err, result) => {
        if (err) throw err;
        res.json(result.rows);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
