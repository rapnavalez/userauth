const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Your name is required!'],
    minlength: [4, 'Your name is too short to be a Name!'],
    maxlength: [50, 'Your name is too long to be a Name!'],
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
});

userSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

const user = mongoose.model('user', userSchema);
module.exports = user;
