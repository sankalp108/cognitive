const express = require('express')
const router = express.Router()

router.post('/add-new', (req, res) => {
    try {
        const connection = req.connection
        const { firstName, lastName, email, phone } = req.body;
        const userId = req.user?.id;
        if (req.user) {
            const insertQuery = 'INSERT INTO contacts (user_id, first_name, last_name, email, phone) VALUES (?, ?, ?, ?, ?)';
            connection.query(insertQuery, [userId, firstName, lastName, email, phone], (error, results, fields) => {
                if (error) {
                    console.error('Error inserting contact form data: ', error);
                    res.redirect('/add-contacts?error=Error submitting contact form');
                    return;
                }
                res.redirect('/contact');
            });
        } else {
            res.redirect('/login?Login Required to add Contact');
        }
    } catch (error) {
        console.log('error adding new contact', error)
        res.redirect(`/add-contacts?error=${error.message}`);
    }
})

router.post('/delete', (req, res) => {
    try {
        const connection = req.connection
        const { id } = req.body;
        const userId = req.user?.id;
        if (req.user) {
            const deleteQuery = 'DELETE FROM contacts WHERE id = ? AND user_id = ?';
            connection.query(deleteQuery, [id, userId], (error, results, fields) => {
                if (error) {
                    console.error('Error deleting contact form data: ', error);
                    res.redirect('/add-contacts?error=Error deleting contact item');
                    return;
                }
                res.redirect('/contact');
            });
        } else {
            res.redirect('/login?Login Required to delete Contact');
        }
    } catch (error) {
        console.log('error adding delete contact', error)
        res.redirect(`/contact?error=${error.message}`);
    }
})

module.exports = router