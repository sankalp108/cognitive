const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendMail = require('./email');
const JWT_SECRET = "C0GN!T!v";

router.post('/register', async (req, res) => {
    try {
        const connection = req.connection;
        const { name, email, password, confirmpassword } = req.body;
        if (password !== confirmpassword) {
            return res.redirect('/signup?error=Password and confirm password do not match');
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        const userData = {
            name: name,
            email: email,
            password: hashPassword
        };
        connection.query('INSERT INTO user SET ?', userData, function (error, results, fields) {
            if (error) {
                console.error('Error registering user:', error);
                return res.redirect('/signup?error=Internal server error');
            }
            console.log('User registered successfully:', results);
            const user = {
                id: results.insertId, email
            }
            const authtoken = jwt.sign(user, JWT_SECRET);
            const subject = `Welcome to Cognitive Disabled` 
            const html = `<p>Your registration with Cognitive Disabled has been successfully created. Thank you!`
            sendMail(email,subject,html)
            return res.redirect("/login?message=User registered successfully");
            // return res.cookie('authentication', authtoken).redirect("/?message=User registered successfully");
        });
    } catch (error) {
        console.error('An error occurred during user registration:', error);
        return res.redirect('/signup?error=' + error.message);
    }
});
router.post('/login', async (req, res) => {
    try {
        const connection = req.connection;
        const { email, password } = req.body;
        connection.query('SELECT * FROM user WHERE email = ?', [email.toLowerCase()], async function (error, results, fields) {
            if (error) {
                console.error('Error fetching user:', error);
                return res.redirect('/login?error=' + error.message)
            }
            // Check if user exists
            if (results.length === 0) {
                return res.redirect('/login?error=Invalid Credentials')
            }
            const passwordCompare = await bcrypt.compare(password, results[0].password);
            if (!passwordCompare) {
                return res.redirect('/login?error=Invalid Credentials')
            }
            const userDataObj = {
                id: results[0].id,
                email: results[0].email
            }
            const authtoken = jwt.sign(userDataObj, JWT_SECRET);
            return res.cookie('authentication', authtoken).redirect("/dashboard?message=User Logged In successfully");
        });
    } catch (error) {
        console.error('An error occurred during user registration:', error);
        return res.redirect('/login?error=' + error.message);
    }
});

router.post('/forgot-password', async (req, res) => {
    try {
        const connection = req.connection;
        const { email } = req.body;
        connection.query('SELECT * FROM user WHERE email = ?', [email.toLowerCase()], async function (error, results, fields) {
            if (error) {
                console.error('Error fetching user:', error);
                return res.redirect('/forgot-password?error=' + error.message)
            }
            // Check if user exists
            if (results.length === 0) {
                return res.redirect('/forgot-password?error=User for this Email not Found!')
            }
            const userDataObj = {
                id: results[0].id,
                email: results[0].email
            }
            const expiresInMinutes = 5;
            const token = jwt.sign(userDataObj, JWT_SECRET, { expiresIn: expiresInMinutes * 60 });
            const to = results[0].email;
            const resetLink = `https://srsemy66hq.us-east-1.awsapprunner.com/password-reset/${token}`
            const subject = `Reset Your Password - Cognitive`
            const html = `<p>Click the Link below to Reset Your Passord. 
            <br>
            ${resetLink}
            `
            sendMail(to,subject,html)
            return res.redirect("/login?message=Check your email to reset password");
        });
    } catch (error) {
        console.error('An error occurred during user registration:', error);
        return res.redirect('/forgot-password?error=' + error.message);
    }
});

router.post('/reset-password/:token', async (req, res) => {
    try {
        const connection = req.connection;
        const { password, confirmpassword } = req.body;
        const token = req.params.token
        if (password !== confirmpassword) {
            return res.redirect(`/password-reset/${token}?error=Password and Confirm Password Should be Same`)
        }
        const salt = await bcrypt.genSalt(10)
        const newPassword = await bcrypt.hash(password, salt)
        const tokenUser = jwt.verify(token, JWT_SECRET)
        const { email, id } = tokenUser
        connection.query('SELECT * FROM user WHERE email = ?', [email.toLowerCase()], async function (error, results, fields) {
            if (error) {
                console.error('Error fetching user:', error);
                return res.redirect(`/password-reset/${token}?error=` + error.message)
            }
            // Check if user exists
            if (results.length === 0) {
                return res.redirect(`/password-reset/${token}?error=User for this Email not Found!`)
            }
            connection.query('UPDATE user SET password = ? WHERE email = ?', [newPassword, email.toLowerCase()], async function (error, results, fields) {
                if (error) {
                    console.error('Error fetching user:', error);
                    return res.redirect(`/password-reset/${token}?error=` + error.message)
                }
                // Check if user exists
                if (results.length === 0) {
                    return res.redirect(`/password-reset/${token}?error=User for this Email not Found!`)
                }
                console.log('results', results)
                const userDataObj = { id, email }
                const authtoken = jwt.sign(userDataObj, JWT_SECRET);
                return res.cookie('authentication', authtoken).redirect("/?message=User Logged In successfully");
            });
        });
    } catch (error) {
        console.error('An error occurred during user registration:', error);
        return res.redirect('/password-reset?error=' + error.message);
    }
});

router.get('/logout', async (req, res) => {
    try {
        res.clearCookie('authentication')
        res.redirect('/?message=User Logged Out')
    } catch (error) {
        return res.redirect('/?error=' + error.message);
    }
});

module.exports = router
