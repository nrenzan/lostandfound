const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const { MONGOURI } = require('./config/keys');

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB database');
});

mongoose.connection.on('error', (err) => {
  console.log('Err connnecting', err);
});

require('./models/user');
require('./models/post');

app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));

if (process.env.NODE_ENV == 'production') {
  app.use(express.static('client/build'));
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log('The server is being run at 5000');
});
