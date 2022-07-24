const User = require('../models/UserAuth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const expiration = 1 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'secret of the world', { expiresIn: expiration });
};

let errors = [];
let errorName = [];
module.exports.login_handler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    const verify = bcrypt.compareSync(password, user.password);
    const token = createToken(user._id);
    if (user && verify) {
      res.cookie('loginToken', token, {
        httpOnly: true,
        maxAge: expiration * 1000,
      });
      res.cookie('loginCookie', user._id, {
        maxAge: expiration * 1000,
      });
      res.status(200).send(user);
    } else {
      throw Error();
    }
  } catch (err) {
    errors.push('Email or Password is incorrect');
    res.status(400).send(errors);
    errors = [];
  }
};

module.exports.signup_handler = async (req, res) => {
  const signUpDetails = req.body;

  try {
    const user = await User.create({ ...signUpDetails });
    res.status(200).send(user.email);
  } catch (error) {
    if (error._message === 'user validation failed') {
      Object.values(error.errors).forEach(({ properties }) => {
        errors.push(properties.message);
      });
      errorName = Object.keys(error.errors);
      if (!error.code === 11000) return;
      errors.push('Email already exist!');
    } else if (error.code === 11000) {
      errors.push('Email already exist!');
    }
    res.status(400).send({ errors, errorName });
    errors = [];
  }
};

module.exports.logout_handler = (req, res) => {
  res.cookie('loginToken', '', {
    maxAge: 1,
  });
  res.cookie('loginCookie', '', {
    maxAge: 1,
  });
  res.status(200).send('logout succesful');
};

module.exports.get_user = async (req, res) => {
  const id = req.body;

  try {
    const { name, email } = await User.findById(id.id);
    res.status(200).send({ name, email });
  } catch (error) {
    console.log(error);
  }
};
