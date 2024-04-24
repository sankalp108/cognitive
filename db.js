const mysql = require('mysql');

const connectionWithDb = () => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: 'localhost',
            port: '3306',
            user: 'root',
            database: 'cognitive',
            password: ''
        });

        connection.connect((err) => {
            if (err) {
                console.error('Error connecting to database:', err.stack);
                reject(err);
                return;
            }
            console.log('Connected to database as id ' + connection.threadId);
            resolve(connection);
        });
    });
};

module.exports = connectionWithDb;
