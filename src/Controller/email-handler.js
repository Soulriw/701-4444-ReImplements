const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();

// Parse JSON requests
router.use(express.json());

// Email sending route
router.post('/send-email', async (req, res) => {
  try {
    const { subject, email, message, recipient } = req.body;
    
    if (!subject || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields (subject, email, or message)' 
      });
    }

    // Check if the email matches the EMAIL_USER from .env
    if (email !== process.env.EMAIL_USER) {
      return res.status(400).json({
        success: false,
        message: 'The email must match the authorized email address.'
      });
    }
    
    // Configure nodemailer with Gmail credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address from .env
        pass: process.env.EMAIL_APP_PASSWORD // Your App Password from .env
      }
    });
    
    // Email options
    const mailOptions = {
      from: `"Contact Form" <${process.env.EMAIL_USER}>`,
      replyTo: email, // Set reply-to as the sender's email
      to: recipient || 'k.khimmy.y12@gmail.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <h3>Contact Form Submission</h3>
        <p><strong>From:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    // Return success response
    res.json({ success: true, message: 'Email sent successfully' });
    
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email. Please try again later.' 
    });
  }
});

module.exports = router;