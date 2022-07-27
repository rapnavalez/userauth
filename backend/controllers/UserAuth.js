require('dotenv').config();
const { User, Token } = require('../models/UserAuth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const expiration = 1 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: expiration });
};

//login
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
          res.cookie('loginToken', token, {
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

module.exports.get_user = async (req, res) => {
  const token = req.cookies.loginToken;
  if (!token) return;

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const { name, email } = await User.findById(data.id);
    res.status(200).send({ name, email });
  } catch (error) {
    res.status(500);
  }
};

//signup and request confirmation email
const generateTokenAndEmail = async (user, passwordReset) => {
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
    subject: passwordReset
      ? 'Password reset link'
      : 'Please confirm your email',
    html: passwordReset
      ? `
      <div style="display: block; margin: 20px 0; padding: 20px;">
        <h1 style="color:#6c757d; font-size: 48px;font-weight: 700; font-family: 'Arial';">Hello, <span style="color: #007bff; text-transform: capitalize">${user.name}</span>!</h1>
        <p style="margin: 20px 0 25px; font-size: 24px;color:#6c757d;font-weight: 500; font-family: 'Arial';">
          Here's your password reset link. Please ignore this email if you didn't request to reset your password.
        </p>
        <a style="margin-bottom: 20px;background: #007bff;border: 1px solid #007bff; padding: 10px 20px; border-radius: 250px; font-size: 21px;color:#FFF;font-weight: 700; text-decoration: none; font-family: 'Arial';" href='${process.env.SERVER_BASE_ADDRESS}/api/newpassword/${verifyToken.token}'>Password reset link</a>
      </div>
    `
      : `
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
    generateTokenAndEmail(user, false);
    res.status(200).send(user.email);
  } catch (error) {
    if (error.code === 11000) {
      const user = await User.findOne({ email: signUpDetails.email });
      if (user.isVerified) {
        errors.push('Email already exist!');
      } else {
        errors.push('Email was already registered but not verified!');
      }
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

    if (user) {
      if (!user.isVerified) {
        generateTokenAndEmail(user, false);
        res.status(200).send(user.email);
      } else {
        errors.push('Your email was already confirmed!');
        throw Error();
      }
    } else {
      errors.push('That Email is not yet registered!');
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
    await User.findOneAndUpdate(doesExist.email, {
      isVerified: true,
    });
    await Token.findOneAndRemove({ token });
    res
      .status(200)
      .redirect(
        `${process.env.CLIENT_BASE_ADDRESS}/login/?emailconfirmationsuccess`
      );
  } catch (error) {
    res
      .status(400)
      .redirect(
        `${process.env.CLIENT_BASE_ADDRESS}/emailtokenexpired/${token}`
      );
  }
};

//logout
module.exports.logout_handler = (req, res) => {
  res.cookie('loginToken', '', {
    maxAge: 1,
  });
  res.status(200).send('logout succesful');
};

//password reset
module.exports.request_password_reset_link = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    const stillHasActiveToken = await Token.findOne({ email });

    if (user) {
      if (user.isVerified) {
        if (stillHasActiveToken === null) {
          generateTokenAndEmail(user, true);
          res.status(200).send(user.email);
        } else {
          errors.push(
            "You've recently requested for password reset link, please check your email(All mail, Spam, etc..)"
          );
          throw Error();
        }
      } else {
        errors.push('Your email is yet to be confirmed!');
        throw Error();
      }
    } else {
      errors.push('That Email is not yet registered!');
      throw Error();
    }
  } catch (error) {
    res.status(400).send(errors);
    errors = [];
  }
};

module.exports.new_password_token = async (req, res) => {
  const token = req.params.token;
  const doesExist = await Token.findOne({ token });
  try {
    if (!doesExist) throw Error();
    res
      .status(200)
      .redirect(
        `${process.env.CLIENT_BASE_ADDRESS}/createnewpassword/${token}`
      );
  } catch (error) {
    res
      .status(400)
      .redirect(
        `${process.env.CLIENT_BASE_ADDRESS}/passwordtokenexpired/${token}`
      );
  }
};

module.exports.create_new_password = async (req, res) => {
  const createPasswordDetails = req.body;
  const token = req.params.token;

  try {
    const { email } = await Token.findOne({ token });
    const newPassword = bcrypt.hashSync(createPasswordDetails.password, 10);
    await User.findOneAndUpdate(
      { email },
      {
        password: newPassword,
      }
    );
    await Token.findOneAndRemove({ token });
    res.status(200).send({ email });
  } catch (error) {
    res.status(400).send(error);
  }
};
