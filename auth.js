const passport = require('passport');
const LocalStrategy = require('passport-local');
const GitHubStrategy = require('passport-github').Strategy;
const bcrypt = require('bcrypt');
const ObjectID    = require('mongodb').ObjectID;

module.exports = function (app, db) {
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
      db.collection('users').findOne(
          {_id: new ObjectID(id)},
          (err, doc) => {
              done(null, doc);
          }
      );
  });

  passport.use(new LocalStrategy(
    function(username, password, done) {
      db.collection('users').findOne({ username: username }, function (err, user) {
        console.log('User '+ username +' attempted to log in.');
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!bcrypt.compareSync(password, user.password)) { return done(null, false); }
        return done(null, user);
      });
    }
  ));

  //Move to server.js to pass test
  // passport.use(new GitHubStrategy({
  //   clientID: process.env.GITHUB_CLIENT_ID,
  //   clientSecret: process.env.GITHUB_CLIENT_SECRET,
  //   callbackURL: "https://junyada100-express-advance.glitch.me/auth/github/callback"
  // },
  // function(accessToken, refreshToken, profile, cb) {
  //   db.collection('users').findOrCreate({ githubId: profile.id }, function (err, user) {
  //     return cb(err, user);
  //   });
  // }
  // ));
}
