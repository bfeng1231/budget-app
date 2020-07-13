const express = require('express');
const mongoose = require('mongoose');
const config = require('config')

const app = express();

app.use(express.json());

const db = config.get('mongoURI');

mongoose.connect(db, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

app.use('/api/user', require('./routes/api/user'))
app.use('/api/item', require('./routes/api/item'))

const port = process.env.PORT || 5000;

app.listen(port, () => console.log('Server started on port', port))