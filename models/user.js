const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  expenses: {
    type: Array
  },
  budget: {
    type: Number
  },
  profile: {
    type: String,
    required: true
  }
});

module.exports = User = mongoose.model('User', userSchema);