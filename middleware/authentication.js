const jwt = require('jsonwebtoken');
const JWT_SECRET = "C0GN!T!v";

const cookieAuth = (cookieName) => {
    return (req, res, next) => {
        try {
            const connection = req.connection
            const cookieAuthtoken = req.cookies[cookieName]
            if (cookieAuthtoken) {
                const tokenUser = jwt.verify(cookieAuthtoken, JWT_SECRET)
                const userId = tokenUser?.id
                connection.query('SELECT * FROM user WHERE id = ?', [userId], function (error, results, fields) {
                    if (error) {
                        console.error('Error fetching user:', error);
                        return res.status(500).json({ message: "Internal server error" });
                    }

                    if (results.length === 0) {
                        next()
                        return;
                    }
                    req.user = {
                        id: results[0].id,
                        name: results[0].name,
                        email: results[0].email,
                    };
                    next()

                });
            } else {
                next()
            }
        }
        catch (err) {
            next()
            console.log(err.message)
        }
    }
}

module.exports = cookieAuth