const { Conflict } = require("http-errors");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");

const { User } = require("../../models");

const signup = async (req, res) => {
  const { email, password, subscription = "starter" } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw new Conflict(`User with ${email} already exist`);
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, { protocol: "http", s: "250" });

  const newUser = await User.create({
    email,
    password: hashPassword,
    subscription,
    avatarURL,
  });

  res.status(201).json({
    status: "Success",
    code: 201,
    message: "User was created",
    data: {
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarPath: avatarURL,
      },
    },
  });
};

module.exports = signup;
