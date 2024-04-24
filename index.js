const express = require("express");
const path = require('path')
const app = express();
const connectionWithDb = require('./db')
const webRoutes = require('./webRoutes')
// const webPush = require('web-push')
const cron = require('node-cron')
const moment = require('moment-timezone')
const cookieParser = require('cookie-parser')
const cookieAuth = require('./middleware/authentication')
const sendMail = require('./routes/email')
app.set('view engine', 'ejs');
app.set('views', path.resolve('./public'))

// const publicValidKey = 'BCOmxswvpCjYOluGa32pdH9S_cRP8yFxtxWJ5EE9i9kKKjrgUo8vCDb7CWEr3sf5sCiww6MYXFLefMJSWB_qCK4'
// const privateValidKey = '-e1z6sTwJkbhn5ChVlF-XFbm0N85-iaNtHJDXWwhOd4'

const PORT = 8090
let connection; // Define connection variable

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

(async () => {
    try {
        connection = await connectionWithDb(); // Assign connection in the outer scope

        // Schedule cron job after database connection is established
        scheduleCronJob(connection);
        
        app.use((req, res, next) => {
            req.connection = connection;
            next();
        });

        app.use(cookieAuth('authentication'));

        // web routes
        app.use(webRoutes);

        // api routes
        app.use('/api', require('./apiHandler'));

        // app.listen moved here to ensure cron job is scheduled before starting the server
        app.listen(PORT, () => {
            console.log(`App is Live on: http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Error connecting to database:', error);
        // Handle error connecting to database
    }
})();

const scheduleCronJob = (connection) => {
    cron.schedule('* * * * * *', async () => {
        try {
            const dateTime = moment().tz("America/New_York").format();
            const sql = 'SELECT * FROM reminders INNER JOIN user ON reminders.user_id = user.id WHERE reminder_time = ?';
            connection.query({sql, nestTables: true}, [dateTime], (err, results) => {
                if (err) {
                    console.log('error fetching reminders', err);
                    // You might want to handle the error here
                } else {
                    results.forEach(async (obj) => {
                        const reminder = obj.reminders;
                        const user = obj.user;
                        const to = user?.email;
                        const subject = `Reminder Name: ${reminder.name}`;
                        const html = `You have set a reminder with message: ${reminder.message}`;
                        sendMail(to, subject, html).then(async (success) => {
                            if (success) {
                                console.log(`Reminder sent to ${to}`);
                            } else {
                                console.log('error mailing reminder');
                            }
                        });
                    });
                }
            });
        } catch (error) {
            console.log('cron error', error.message);
        }
    });
};
