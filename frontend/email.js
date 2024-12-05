const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password', // Use App Password for Gmail
    },
});

// Define email options
const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'recipient-email@gmail.com',
    subject: 'Hello from Node.js!',
    text: 'This is a plain text email.',
    html: '<h1>This is an HTML email!</h1>',
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(`Error: ${error}`);
    }
    console.log(`Email sent: ${info.response}`);
});
