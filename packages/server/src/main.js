const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const registerApis = require('./apis');
registerApis(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'app/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'app/build', 'index.html'));
  });
}

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const mongoUrl = 'mongodb://localhost:27017/easy-mern-stack-db';

console.log('Mongoose attempting to connect to MongoDB');
const db = mongoose.connection;
db.on('error', () => console.error('Mongoose connection error'));
db.once('open', () => console.log('Mongoose connected to MongoDB'));

mongoose.connect(mongoUrl, { useNewUrlParser: true });

app.listen(port, () => console.log(`Express listening on port ${port}`));
