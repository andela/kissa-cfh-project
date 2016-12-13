/**
 * Module dependencies
 */
/* eslint amd:true */

const nodemailer = require('nodemailer');
require('dotenv').config({ silent: true });


exports.emailinvite = (req, res) => {
  if(req.user && req.user.id) {
    const gameLink = req.body.link;
    const email = req.body.email;
    const sender = req.body.sender;
    const link = `${gameLink}&email=${email}`;
    const transporter = nodemailer.createTransport(process.env.EMAIL_SERVICES);

    const mailOptions = {
      from: process.env.EMAIL_OWNER,
      to: req.body.email,
      subject: 'Invitation to join Game',
      html: `<h3> Cards for Humanity </h3><br/>
      You have been invited by <a>${sender}</a> to join a game in cards for humanity<br/>
      click on this link <a href="${link}">here</a> to join the game now.<br/>
      <strong>Cards For Humanity</strong>`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ status: 'error' });
      } else {
        return res.status(200).json({ status: info.response });
      }
    });
  } else {
    return res.status(403).json({ message: 'you do not have permission to access this route' });
  }
};
