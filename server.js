const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


const db = new sqlite3.Database('./skating.db');

// Cədvəli yaradır
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});


app.post('/signup', (req, res) => {
    const { email, password } = req.body;
    db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, password], (err) => {
        if (err) return res.status(500).json({ error: "Error saving" });
        res.json({ message: " Email databaza-da saxlanıldı" });
    });
});


app.post('/login', (req, res) => {
    const { email, password } = req.body;

    
   const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  // const sql = SELECT * FROM users WHERE email = '${email}' AND password = '${password}';

    db.get(sql, [email, password], (err, row) => {
        if (err) {
            
            console.log("SQL Error:", err.message);
            return res.status(500).json({ error: "Database error: " + err.message });
        }
        
        if (row) {
            res.json({ message: "Welcome back, skater!", user: row });
        } else {
            res.status(401).json({ error: "Skater tapilmadi  email/pass yoxla." });
        }
    });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));