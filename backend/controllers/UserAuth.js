require('dotenv').config();
const { User, Token } = require('../models/UserAuth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const expiration = 1 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: expiration });
};

let errors = [];
module.exports.login_handler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const verify = bcrypt.compareSync(password, user.password);
      if (verify) {
        const token = createToken(user._id);
        if (user.isVerified) {
          await res.cookie('loginToken', token, {
            httpOnly: true,
            maxAge: expiration * 1000,
          });
          res.status(200).send(user);
        } else {
          errors.push('Your email is not verified! Please check your inbox.');
          throw Error();
        }
      } else {
        errors.push('Email or Password is incorrect!');
        throw Error();
      }
    } else {
      errors.push('Email or Password is incorrect!');
      throw Error();
    }
  } catch (err) {
    res.status(400).send(errors);
    errors = [];
  }
};

const generateAndEmailToken = async (user) => {
  const randonNum = Math.floor(Math.random() * 100000);

  const verifyToken = await Token.create({
    email: user.email,
    token: randonNum + createToken(user._id),
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
    html: `
      <div style="display: block; margin: 20px 0; padding: 20px;">
        <h1 style="color:#6c757d; font-size: 48px;font-weight: 700; font-family: 'Arial';">Hello, <span style="color: #007bff; text-transform: capitalize">${user.name}</span>!</h1>
        <p style="margin: 20px 0 25px; font-size: 24px;color:#6c757d;font-weight: 500; font-family: 'Arial';">
          Thank for registering at loaners! Please click the link below to
          complete your registration.
        </p>
        <a style="margin-bottom: 20px;background: #007bff;border: 1px solid #007bff; padding: 10px 20px; border-radius: 250px; font-size: 21px;color:#FFF;font-weight: 700; text-decoration: none; font-family: 'Arial';" href='${process.env.SERVER_BASE_ADDRESS}/api/verifyemail/${verifyToken.token}'>Verify Email</a>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports.signup_handler = async (req, res) => {
  const signUpDetails = req.body;
  try {
    const user = await User.create({ ...signUpDetails });
    generateAndEmailToken(user);
    res.status(200).send(user.email);
  } catch (error) {
    if (error.code === 11000) {
      errors.push('Email already exist!');
    } else if (error._message === 'user validation failed') {
      Object.values(error.errors).forEach(({ properties }) => {
        errors.push(properties.message);
      });
      if (error.code === 11000) errors.push('Email already exist!');
    }
    res.status(400).send(errors);
    errors = [];
  }
};

module.exports.request_new_confirmation_email = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user.isVerified) {
      if (user) {
        generateAndEmailToken(user);
        res.status(200).send(user.email);
      } else {
        errors.push('That Email is not yet registered!');
        throw Error();
      }
    } else {
      errors.push('Your email was already confirmed!');
      throw Error();
    }
  } catch (error) {
    res.status(400).send(errors);
    errors = [];
  }
};

module.exports.verify_email = async (req, res) => {
  const token = req.params.token;
  const doesExist = await Token.findOne({ token });
  try {
    if (!doesExist) throw Error();
    if (doesExist.expireAt <= Date.now) throw Error();
    await User.findOneAndUpdate(doesExist.email, {
      isVerified: true,
    });
    await Token.findOneAndRemove({ token });
    res.status(200).redirect(`${process.env.CLIENT_BASE_ADDRESS}/login`);
  } catch (error) {
    res
      .status(400)
      .redirect(`${process.env.CLIENT_BASE_ADDRESS}/tokenexpired/${token}`);
  }
};

module.exports.logout_handler = (req, res) => {
  res.cookie('loginToken', '', {
    maxAge: 1,
  });
  res.status(200).send('logout succesful');
};

module.exports.get_user = async (req, res) => {
  const token = await req.cookies.loginToken;
  if (!token) return;

  const data = jwt.verify(token, process.env.JWT_SECRET);
  const { name, email } = await User.findById(data.id);
  res.status(200).send({ name, email });
};
