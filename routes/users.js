const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const { Users } = require("../models");
const router = express.Router();
const { isLoggedIn } = require("./userCheck");

/* GET users listing. */

router.get("/login", (req, res, next) => {
  const flashs = req.flash().error;
  res.render("users/login", { flashs: flashs });
});

router.post(
  "/logins",
  passport.authenticate("local", {
    successRedirect: "/diary/texts",
    failureRedirect: "/users/login",
    failureFlash: true
  })
);

router.get("/sign_up", (req, res) => {
  res.render("users/sign_up", { flashs2: req.flash().error2 });
});

router.post("/sign_up_process", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const exUser = await Users.findOne({ where: { email } });
    if (exUser) {
      req.flash("error2", "이미 회원이 존재합니다");
      return res.redirect("sign_up");
    }
    const hash = await bcrypt.hash(password, 12);
    await Users.create({
      email,
      password: hash
    });

    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.redirect("./error");
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

router.get("/token", isLoggedIn, async (req, res, next) => {
  const token = jwt.sign(
    {
      email: req.user
    },
    secretObj.secret,
    {
      expiresIn: "5m"
    }
  );

  res.cookie("user", token);
  res.json({
    token: token
  });
});
// router.post("/login_process", async (req, res, next) => {
//   const { email, password } = req.body;

//   try {
//     const exUser = await Users.findOne({ where: { email } });
//     if (exUser) {
//       const result = await bcrypt.compare(password, exUser.password);
//       if (result) {
//         res.send("login success");
//       } else {
//         console.log("paswword error");
//         res.redirect("login");
//       }
//     } else {
//       console.log("email error");
//       res.redirect("login");
//     }
//   } catch (error) {
//     console.log(error);
//     done(error);
//   }
// });
module.exports = router;
