const express = require('express');
// const Datastore = require('nedb');
const Datastore = require('@seald-io/nedb');

const port = process.env.PORT || 3000;

const app = express();

app.listen(port, () => {
  console.log(`Starting server at ${port}`);
  console.log(`open in browser http://localhost:${port}/`);
});
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore({ filename: 'database.db' });
// const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      console.log('database.find err', err);
      // console.log('database.find data', data);
      response.end();
      return;
    }
    // console.log('database.find data', data);
    console.log('database.find data keys', Object.keys(data));
    response.json(data);
  });
});

app.post('/api', (request, response) => {
  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;

  // Insert the data into the database and check for errors
  // console.log('database.insert data', data);
  console.log('database.insert data', Object.keys(data));
  database.insert(data, (err, newDoc) => {
    console.log('database.insert err', err);
    // console.log('database.insert newDoc', newDoc);
    console.log('database.insert newDoc keys', Object.keys(newDoc));
  });

  response.json(data);
});
