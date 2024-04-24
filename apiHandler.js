const express = require('express')
const router = express.Router()

router.use('/contacts',require('./routes/contacts'))

router.use('/reminders',require('./routes/reminders'))

router.use('/user',require('./routes/user'))

router.use('/chat',require('./routes/chat'))

module.exports = router