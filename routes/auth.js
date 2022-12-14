
var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
var passport = require('passport');
var LocalStrategy = require('passport-local');
//var crypto = require('crypto');
const alumni = require("../models/model").alumni;
const connectToDb = require('../dbConnect');
const userController = require('../controllers/usercontroller');
const loginController = require('../controllers/logincontroller');
const signupController = require('../controllers/signup');
const dashboardController = require('../controllers/dashboard');

passport.use(new LocalStrategy({
  usernameField: 'alumni[email]',
  passwordField: 'alumni[password]',
},function verify(email, password, done) => {
  alumni.findOne({ email })
    .then((alumni) => {
      if (!alumni) {
        return done(null, false, { errors: { 'email': 'is invalid' } });
      }
      const match = bcrypt.compare(req.body.password, alumni.password);
      if (!match) {
        return done(null, false, { errors: { 'password': 'is invalid' } });
      }
      return done(null, alumni);
    }).catch(done);
}));
passport.serializeUser(function (alumni, done) {

  done(null, { id: alumni.id, username: alumni.username });

});

passport.deserializeUser(function (id, done) {
  alumni.findById(id, function (err, user) {
    done(err, user);
  });
});

router.get('/login', loginController.loginform);

router.post('/login/password', passport.authenticate('local', {
  failureRedirect: '/login'
}), dashboardController.dashboardcont
);


router.get('/signup', signupController.signUpCont);
router.post('/signup/alumni', userController.signup);
module.exports = router;
