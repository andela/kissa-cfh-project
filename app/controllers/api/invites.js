/**
 * Module dependencies
 */
<<<<<<< HEAD
/* eslint amd:true */

=======
>>>>>>> 7042034... feature(nodemailer):send invites using nodemailer
const nodemailer = require('nodemailer');
require('dotenv').config({ silent: true });

exports.emailinvite = (req, res) => {
  const gameLink = req.body.link;
  const email = req.body.email;
  const link = `${gameLink}&email=${email}`;
  const transporter = nodemailer.createTransport('smtps://victor.nwaiwu9%40gmail.com:Ogechukwu1987@smtp.gmail.com');

  const mailOptions = {
    from: 'victor.nwaiwu9@gmail.com',
    to: req.body.email,
    subject: 'Invitation to join Game',
    html: `<h3> Cards for Humanity </h3><br/>
    You have been invited by <a>${req.user.name}</a> to join a game in cards for humanity<br/>
    click on this link <a href="${link}">here</a> to join the game now.<br/>
    <strong>Cards For Humanity</strong>`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.json({ status: 'error' });
    } else {
      res.json({ status: info.response, user: req.user });
    }
  });
};
