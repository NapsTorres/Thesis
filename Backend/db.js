    const mysql = require('mysql2');

    const secretKey = 'napoleon-secret-key';

    const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'testing'
    
    });

    function connectDB() {
        db.connect((err) => {
            if (err) {
                console.error('Error connecting to MySQL:', err);
            } else {
                console.log('Connected to MySQL');
            }
        });
    }

    module.exports = { db, secretKey, connectDB };