// ATTENTION : appli VOLONTAIREMENT vulnerable, a usage pedagogique uniquement.
const express = require('express');
const sqlite3 = require('sqlite3');
const multer = require('multer');
const { exec } = require('child_process');

const app = express();
const db = new sqlite3.Database(':memory:');
const upload = multer({ dest: 'uploads/' }); // aucun filtre sur le type de fichier

const API_KEY = 'sk_live_1234567890abcdef'; // secret en dur

db.serialize(() => {
  db.run('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, secret TEXT)');
  db.run("INSERT INTO users (name, secret) VALUES ('admin', 'FLAG{sqli_ok}'), ('bob', 'rien')");
});

app.get('/', (req, res) => {
  res.send(`<h1>DevSecOps TP</h1>
  <ul>
    <li><a href="/user?name=bob">/user?name=</a> (SQLi)</li>
    <li><a href="/ping?host=127.0.0.1">/ping?host=</a> (injection de commande)</li>
    <li><a href="/hello?name=toi">/hello?name=</a> (XSS)</li>
    <li><form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="file"><button>Upload</button></form></li>
  </ul>`);
});

// Injection SQL
app.get('/user', (req, res) => {
  const q = "SELECT id, name FROM users WHERE name = '" + req.query.name + "'";
  db.all(q, (err, rows) => res.send(err ? String(err) : JSON.stringify(rows)));
});

// Execution de commande shell
app.get('/ping', (req, res) => {
  exec('ping -c 1 ' + req.query.host, (err, out) => res.send('<pre>' + out + '</pre>'));
});

// XSS reflechi
app.get('/hello', (req, res) => {
  res.send('<h1>Bonjour ' + req.query.name + '</h1>');
});

// Upload non controle
app.post('/upload', upload.single('file'), (req, res) => {
  res.send('Fichier recu : ' + req.file.originalname);
});

app.listen(3000, () => console.log('http://localhost:3000'));
