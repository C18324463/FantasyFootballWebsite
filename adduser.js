const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('players.db');

// uncoment these lines and insert your own values
const user = 'gabrielhynes123@gmail.com';
const user_first = 'Gabriel';
const user_second = "Hynes";
const password = 'password';

const bcrypt = require('bcrypt');
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
    // Now we can store the password hash in db.
    const insert = db.prepare('INSERT INTO USERS (user_email, user_first, user_second, password) VALUES ($1, $2, $3, $4);');
    insert.run(user, user_first, user_second, hash);
    insert.finalize();
});