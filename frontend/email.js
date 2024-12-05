const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use your email service provider (e.g., Gmail, Outlook, etc.)
            auth: {
                user: 'your-email@gmail.com', // Your email
                pass: 'your-email-password', // Your email password or app-specific password
            },
        });

        // Email options
        const mailOptions = {
            from: 'your-email@gmail.com', // Sender address
            to, // Recipient address
            subject, // Subject line
            text, // Email body
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;
