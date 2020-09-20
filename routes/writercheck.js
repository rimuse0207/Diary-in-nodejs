const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
exports.tokenCheck = (req, res, next) => {
  const token = req.cookies.user;
  const decoded = jwt.verify(token, secretObj.secret);

  try {
    if (decoded) {
      next();
    } else {
      res.send("토큰 확인후 사용해주세요");
    }
  } catch (error) {
    res.send("토큰 확인후 사용해주세요");
  }
};
