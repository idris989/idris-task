const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./skating.db');

db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) return console.error(err.message);
    console.table(rows); // <--- THIS WILL SHOW YOUR TABLE
});
db.close();