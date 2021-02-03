const express = require('express');

const { isLoggedIn } = require('./middlewares');
const { User,Follow } = require('../models');
const { addFollowing } = require('../controllers/user');

const router = express.Router();

//POST /user/1/follow
router.post('/:id/follow', isLoggedIn, addFollowing);

//POST /user/1/unfollow
router.post('/:id/unfollow', isLoggedIn, async (req, res, next) => {
    try {
      const follow = await Follow.findOne({ where: { followerId: req.user.id } });
      if (follow) {
        await follow.destroy([parseInt(req.params.id, 10)]);
        res.send('success');
      } else {
        res.status(404).send('no user');
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  });

module.exports = router;