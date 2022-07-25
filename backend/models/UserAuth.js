const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Your name is required!'],
    minlength: [4, 'Name must be at least 4 letters!'],
    maxlength: [50, 'Your name is too long!'],
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, 'Your email is required!'],
    maxlength: [50, 'Your email is too long!'],
    unique: true,
    validate: [isEmail, "Your email doesn't look like an email!"],
  },
  password: {
    type: String,
    required: [true, 'Your password is required!'],
    minlength: [8, 'Your password must be at least 8 characters!'],
  },
  isVerified: { type: Boolean, default: false },
});

const tokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    ref: 'User',
  },
  token: { type: String, required: true },
  expireAt: { type: Date, default: Date.now, index: { expires: 864000 } },
});

userSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

const Token = mongoose.model('token', tokenSchema);
const User = mongoose.model('user', userSchema);

module.exports = { User, Token };
