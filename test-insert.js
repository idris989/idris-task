const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./skating.db');

db.serialize(() => {
    
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    const queries = [
        ["skater_idris@mail.com", "ice_magic_123"],
        ["skate_bro@gmail.com", "ollie_master"],
        ["newbie_skater@mail.com", "helmet123"],
        ["tony.hawk@skate.com", "birdman99"]
    ];

    queries.forEach((user) => {
        db.run("INSERT INTO users (email, password) VALUES (?, ?)", user, function(err) {
            if (err) {
                console.log("❌ Skip:", user[0], "(Already exists)");
            } else {
                console.log("✅ Inserted:", user[0], "| ID:", this.lastID);
            }
        });
    });
});

db.close();