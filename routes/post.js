const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model('Post');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        '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'
    }
  })
);

router.get('/allpost', requireLogin, (req, res) => {
  Post.find()
    .populate('postedBy', '_id name')
    .populate('comments.postedBy', '_id name')
    .sort('-createdAt')
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/createpost', requireLogin, (req, res) => {
  const { title, body, pic } = req.body;
  if (!title || !body || !pic) {
    return res.status(422).json({ error: 'Plase add all the fields.' });
  }
  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    photo: pic,
    postedBy: req.user
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
  User.find({}, (err, allUsers) => {
    if (err) {
      console.log(err);
    }
    let mailList = [];
    allUsers.forEach(function (users) {
      mailList.push(users.email);
      return mailList;
    });

    transporter.sendMail({
      to: mailList,
      from: 'lostfoundku@gmail.com',
      subject: 'Lost and Found KU',
      html: '<h1>New item has been found in lost and found KU. Please Check.</h1>'
    });
  });
});

router.put('/comment', requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment }
    },
    {
      new: true
    }
  )
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.delete('/deletepost/:postId', requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate('postedBy', '_id')
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

module.exports = router;
