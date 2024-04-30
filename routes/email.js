const nodemailer = require('nodemailer');

const sendMail = async (to, subject, html) => {
    return new Promise(async (resolve, reject) => {
        const transporter = await nodemailer.createTransport({
            host: 'temple.edu',
            port: 465,
            auth: {
                user: 'tuk25392@temple.edu',
                pass: 'Samp@1933'
            }
        });

        // Construct the email message
        const mailOptions = {
            from: 'tuk25392@temple.edu',
            to: to,
            subject: subject,
            html: html
        };
        var success = false
        // Send the email
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
        return success

    })
}

module.exports = sendMail
