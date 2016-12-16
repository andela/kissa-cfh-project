/**
 * Module dependencies
 */
/* eslint amd:true */

const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

const Invitation = mongoose.model('Invitation');
require('dotenv').config({ silent: true });


const Invites = {
  emailinvite(req, res) {
    const gameLink = req.body.link;
    const email = req.body.email;
    const sender = req.body.sender;
    const link = `${gameLink}&email=${email}`;
    if (req.user && req.user.id) {
      const transporter = nodemailer.createTransport(process.env.EMAIL_SERVICES);
      const mailOptions = {
        from: process.env.EMAIL_OWNER,
        to: req.body.email,
        subject: 'Invitation to join Game',
        html: `<h3> Cards for Humanity </h3><br/>
        You have been invited by <strong>${sender}</strong> to join a game in cards for humanity<br/>
        click on this link <a href="${link}">here</a> to join the game now.<br/>
        <strong>Cards For Humanity</strong>`
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) return res.status(500).json({ message: 'An error occured while trying to send the message', error: err });
        return res.status(200).json({ status: info.response });
      });
    } else {
      return res.status(403).json({ message: 'you do not have permission to access this route' });
    }
  },
  appMessage(req, res) {
    const gameLink = req.body.link;
    const email = req.body.email;
    const sender = req.body.sender;
    if (req.user && req.user.id) {
      const invite = new Invitation({
        to: email,
        userId: req.body.userId,
        from: sender,
        link: gameLink
      });
      invite.save((err) => {
        if (err) return res.status(500).json({ message: 'An error occured while sending the invite', error: err });
        return res.status(200).json({ message: 'Invite successfully sent' });
      });
    } else {
      return res.status(403).json({ message: 'You do not have permission to access this route' });
    }
  },
  getMessages(req, res) {
    if (req.user && req.user.id) {
      const userInfo = req.user.id;
      Invitation.find({ $and: [{ userId: userInfo }, { read: false }] }).sort({ _id: -1 }).limit(10)
      .exec((err, result) => {
        if (err) return res.status(500).json({ message: 'Can not retrieve messages at the moment', error: err });
        return res.status(200).json(result);
      });
    } else {
      return res.status(403).json({ message: 'You do not have permission to access this route' });
    }
  },
  viewMessage(req, res) {
    if (req.user && req.user.id) {
      const messageId = req.params.id;
      const query = { $and: [{ _id: messageId }, { read: false }] };
      Invitation.update(query, {
        read: true
      }, (err, result) => {
        if (err) return res.status(500).json({ message: 'An error occured while updating this data', error: err });
        return res.status(200).json({ message: 'Message has been marked as read' });
      });
    } else {
      return res.status(403).json({ message: 'You do not have permission to access this route' });
    }
  }
};

module.exports = Invites;
