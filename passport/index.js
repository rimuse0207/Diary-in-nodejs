const local = require("./localStrategy");

module.exports = passport => {
  passport.serializeUser((user, done) => {
    // Strategy 성공시 호출됨

    done(null, user.email);
  });

  passport.deserializeUser((id, done) => {
    done(null, id);
  });
  local(passport);
};
