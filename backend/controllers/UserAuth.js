require('dotenv').config();
const { User, Token } = require('../models/UserAuth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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
      if (user.isVerified) {
        res.cookie('loginToken', token, {
          httpOnly: true,
          maxAge: expiration * 1000,
        });
        res.cookie('loginCookie', user._id, {
          maxAge: expiration * 1000,
        });
        res.status(200).send(user);
      } else {
        console.log('email is not verified');
        errors.push('Please confirm your email first');
        throw Error();
      }
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
    const verifyToken = await Token.create({
      email: user.email,
      token: createToken(user._id),
    });

    const transporter = nodemailer.createTransport({
      host: 'smtp.elasticemail.com',
      port: 2525,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: 'rapwebdev@gmail.com',
      to: user.email,
      subject: 'Please confirm your email',
      html: `<div style="display: block;">
      <h1 style="font-size: 48px;color:#6c757d;font-weight: 700; font-family: 'Arial';">Hello, <span style="color: #007bff; text-transform: capitalize">${user.name}</span>!</h1>
      <p style="margin: 20px 0 25px; font-size: 24px;color:#6c757d;font-weight: 500; font-family: 'Arial';">
        Thank for registering at loaners! Please click the link below to
        complete your registration.
      </p>
      <br />
      <a style="margin: 0 auto; background: #007bff;border: 1px solid #007bff; padding: 20px; border-radius: 250px; font-size: 21px;color:#FFF;font-weight: 700; text-decoration: none; font-family: 'Arial';" href='http://localhost:5000/api/verifyemail/${verifyToken.token}'>Verify Email</a>
    </div>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.status(200).send(user.email);
  } catch (error) {
    if (error.code === 11000) {
      errors.push('Email already exist!');
    } else if (error._message === 'user validation failed') {
      Object.values(error.errors).forEach(({ properties }) => {
        errors.push(properties.message);
      });
      errorName = Object.keys(error.errors);
      if (error.code === 11000) errors.push('Email already exist!');
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

module.exports.verify_email = async (req, res) => {
  const token = req.params.token;
  const doesExist = await Token.findOne({ token });
  await User.findOneAndUpdate(doesExist.email, {
    isVerified: true,
  });
  try {
    if (doesExist) {
      await Token.findOneAndRemove({ token });
      res.status(200).send('verified!');
    }
  } catch (error) {
    console.log(error);
  }
};
