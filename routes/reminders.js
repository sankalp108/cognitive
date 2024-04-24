const express = require('express')
const router = express.Router()

router.post('/add-todo', (req, res) => {
    try {
        const connection = req.connection
        const { name, time, message } = req.body
        const timeObj = new Date(time)
        const userId = req.user?.id;
        console.log('userId', userId)
        if (req.user) {
            const insertQuery = 'INSERT INTO reminders (user_id, name, reminder_time, message) VALUES (?, ?, ?, ?)';
            connection.query(insertQuery, [userId, name, timeObj, message], (error, results, fields) => {
                if (error) {
                    console.error('Error inserting Todo form data: ', error);
                    res.redirect('/add-todos?error=Error adding todo item');
                    return;
                }
                return res.redirect('/reminders');
            });
        } else {
            res.redirect('/login?Login Required to add Todo');
        }
    } catch (error) {
        console.log('error adding todo item', error)
        res.redirect(`/add-todos?error=${error.message}`);
    }
})

router.post('/delete-todo', (req, res) => {
    try {
        const connection = req.connection
        const { id } = req.body
        const userId = req.user?.id;
        if (userId) {
            const deleteQuery = 'DELETE FROM reminders WHERE id = ? AND user_id = ?';
            connection.query(deleteQuery, [id, userId], (error, results, fields) => {
                if (error) {
                    console.error('Error deleting Todo form data: ', error);
                    res.redirect('/add-todos?error=Error deleting todo item');
                    return;
                }
                return res.redirect('/reminders?message=Reminder Deleted Successfully');
            });
        } else {
            res.redirect('/login?Login Required to add Todo');
        }
    } catch (error) {
        console.log('error adding todo item', error)
        res.redirect(`/add-todos?error=${error.message}`);
    }
})

module.exports = router