const mysql = require('mysql');

const connectionWithDb = () => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: 'cognitive.cj6qyymwab69.us-east-1.rds.amazonaws.com',
            port: '3306',
            user: 'admin',
            database: 'cognitive',
            password: 'cognitive123'
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
