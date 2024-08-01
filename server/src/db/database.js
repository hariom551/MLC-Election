import dotenv from 'dotenv';
import mysql from 'mysql2'; // Change to mysql2 if you are using mysql2

dotenv.config(); // Load environment variables from .env file

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
    connectTimeout: 10000, // 10 seconds
});


// To test the connection:
pool.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
    if (error) {
        console.error('Database connection test failed.', error);
    } else {
        console.log('Database connected successfully.');
    }
});

// Don't forget to close the pool when done
// You can do this when your application is shutting down
process.on('SIGINT', () => {
    pool.end((err) => {
        if (err) {
            console.error('Error closing the database connection:', err);
        } else {
            console.log('Database connection closed.');
        }
        process.exit();
    });
});

export { pool };
