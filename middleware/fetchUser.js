const jwt = require("jsonwebtoken");

const jwtSecret = "MYJWTSECRETKEYTOAUTHENTICATEUSERBASEDONJWTTOKEN";

const fetchuser = (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) {
    res.status(401).send({
      sucess: false,
      message: "unauthorized access",
    });
  }

  try {
    const data = jwt.verify(token, jwtSecret);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({
      sucess: false,
      message: "unauthorized access",
    });
  }
};

module.exports = fetchuser;
