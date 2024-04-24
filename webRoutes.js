const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const JWT_SECRET = "C0GN!T!v";

const formatTimeDate = (dateTime) => {
    console.log(dateTime)
    // 15/4/2024 9:00AM
    const dateTimeObj = new Date(dateTime)
    console.log('dateTimeObj', dateTimeObj)
    let date = dateTimeObj.getDate()
    let month = dateTimeObj.getMonth() + 1
    let year = dateTimeObj.getFullYear()
    let hours = dateTimeObj.getHours() < 12 ? dateTimeObj.getHours() : dateTimeObj.getHours() % 12
    let minutes = dateTimeObj.getMinutes() < 10 ? `0${dateTimeObj.getMinutes()}` : dateTimeObj.getMinutes()
    let daylight = Number(dateTimeObj.getHours()) < 12 ? 'AM' : 'PM'
    return `${date}/${month}/${year} ${hours}:${minutes}${daylight}`
}

router.get('/', (req, res) => {
    const user = req.user;
    const message = req.query.message;
    const error = req.query.error; 
    res.render('index', { user, message, error });
});


router.get('/dashboard', (req, res) => {
    const user = req.user
    const message = req.query.message
    const error = req.query.error
    res.render('dashboard', { user, message, error })
})

router.get('/signup', (req, res) => {
    if (!req.user) {
        const user = req.user
        const message = req.query.message
        const error = req.query.error
        return res.render('signup', { user, message, error })
    }
    res.redirect('/dashboard?message=User Already Logged In')
})

router.get('/login', (req, res) => {
    if (!req.user) {
        const user = req.user
        const message = req.query.message
        const error = req.query.error
        return res.render('login', { user, message, error })
    }
    res.redirect('/dashboard?message=User Already Logged In')
})

router.get('/add-todos', (req, res) => {
    if (!req.user) {
        return res.redirect('/login?Login Required to add Todo Item');
    }
    const user = req.user
    const message = req.query.message
    const error = req.query.error
    res.render('add-todos', { user, message, error })
})

router.get('/reminders', (req, res) => {
    try {
        if (!req.user) {
            return res.redirect('/login?Login Required to see Reminders');
        }
        const connection = req.connection
        const userId = req.user.id
        const query = 'SELECT * FROM reminders WHERE user_id = ?';
        connection.query(query, [userId], (err, results) => {
            if (err) {
                console.log('error fetching reminders', err)
                return res.redirect(`/?error=${err.message}`);
            }
            const reminders = results.map(item => ({
                id: item.id,
                name: item.name,
                time: item.reminder_time,
                message: item.message
            }))
            console.log('reminders', reminders)
            const user = req.user
            const message = req.query.message
            const error = req.query.error
            res.render('reminders', { reminders, formatTimeDate, user, message, error })
        });
    } catch (error) {
        return res.redirect(`/?error=${error.message}`);
    }
})

router.get('/add-contacts', (req, res) => {
    if (!req.user) {
        return res.redirect('/login?Login Required to add Contact');
    }
    const user = req.user
    const message = req.query.message
    const error = req.query.error
    res.render('add-contacts', { user, message, error })
})

router.get('/contact', (req, res) => {
    try {
        if (!req.user) {
            return res.redirect('/login?Login Required to See Contacts');
        }
        const userId = req.user.id
        const connection = req.connection
        const query = 'SELECT * FROM contacts WHERE user_id = ?';
        connection.query(query, [userId], (err, results) => {
            if (err) {
                console.log('error fetching contacts', err)
                return res.redirect(`/?error=${err.message}`);
            }
            const contacts = results.map(item => ({
                id: item.id,
                firstName: item.first_name,
                lastName: item.last_name,
                email: item.email,
                phone: item.phone,
            }))
            const user = req.user
            const message = req.query.message
            const error = req.query.error
            res.render('contact', { contacts, user, message, error })
        });
    } catch (error) {
        return res.redirect(`/?error=${error.message}`);
    }
})

router.get('/password-reset/:token', (req, res) => {
    try {
        if (req.user) {
            return res.redirect('/?message=User Already Logged In')
        }
        const token = req.params.token
        const tokenObj = jwt.verify(token, JWT_SECRET)
        const user = req.user
        const message = req.query.message
        const error = req.query.error
        res.render('password-reset', { tokenObj, token, user, message, error })
    } catch (error) {
        console.log
        res.redirect('/login?error=Invalid or Expired Token')
    }
})

router.get('/chat', (req, res) => {
    if (!req.user) {
        return res.redirect('/login?Login Required to See Chat');
    }
    const user = req.user
    const message = req.query.message
    const error = req.query.error
    res.render('chat', { user, message, error })
})

router.get('/mood-tracker', (req, res) => {
    const user = req.user
    const message = req.query.message
    const error = req.query.error
    res.render('mood-tracker', { user, message, error })
})

router.get('/mind-games', (req, res) => {
    const user = req.user
    const message = req.query.message
    const error = req.query.error
    res.render('mind-games', { user, message, error })
})

router.get('/forgot-password', (req, res) => {
    if (req.user) {
        return res.redirect('/?message=User Already Logged In')
    }
    const user = req.user
    const message = req.query.message
    const error = req.query.error
    res.render('forgot-password', { user, message, error })
})

module.exports = router