const express = require('express');
// const Datastore = require('nedb');
const loki = require('lokijs');
const db = new loki('example.db', { autosave: true });

let posts;

db.loadDatabase({}, function (err) {
  if (err) {
    console.log('error : ' + err);
  } else {
    console.log('database loaded.');
    prepare_database();
  }
});

function prepare_database() {
  posts = db.getCollection('posts');
  if (!posts) {
    // Create a collection
    console.log('addCollection');
    posts = db.addCollection('posts');
  }
}

const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

// const database = new Datastore('database.db');
// database.loadDatabase();

app.get('/api', (request, response) => {
  if (posts) {
    let data = posts.find();
    // console.log('api data', data);
    console.log('api data.length', data.length);
    response.json(data);
  } else {
    response.end();
  }
});

app.post('/api', (request, response) => {
  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  // database.insert(data);
  // { lat, lon, mood, image64 }
  // console.log('api insert', data);
  // console.log('api insert data', data);
  console.log('api insert data keys', Object.keys(data));
  posts.insert(data);
  response.json(data);
});
