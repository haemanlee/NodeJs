const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { route } = require('./page');
const passport = require('passport');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password } = req.body;
    try {
      const exUser = await User.findOne({ where: { email } });
      if (exUser) {
        return res.redirect('/join?error=exist');
      }
      const hash = await bcrypt.hash(password, 12);//12: 높아질 수록 보안성이 좋아짐.
      await User.create({
        email,
        nick,
        password: hash,
      });
      return res.redirect('/');//302 location '/'
    } catch (error) {
      console.error(error);
      return next(error);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {//localStrategy를 찾는다.
        if (authError) {
          console.error(authError);
          return next(authError);
        }
        if (!user) {
          return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => { //passport index 로 감.
          if (loginError) {
            console.error(loginError);
            return next(loginError);
          }
          // 세션 쿠키를 브라우저로 보내줌.
          return res.redirect('/');
        });
      })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',
}), (req, res) => {
    res.redirect('/');
});


module.exports = router;