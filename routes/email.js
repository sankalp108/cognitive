const nodemailer = require('nodemailer');

const sendMail = async (to, subject, html) => {
    return new Promise(async (resolve, reject) => {
        const transporter = await nodemailer.createTransport({
            host: 'provolutiontech.com',
            port: 465,
            auth: {
                user: 'sankalp@moodtracker.com',
                pass: 'FhXz(Tj%IzkM'
            }
        });

        // Construct the email message
        const mailOptions = {
            from: 'sankalp@moodtracker.com',
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
