// Appli du TP DevSecOps - version corrigee.
// Les failles d'origine (SQLi, injection de commande, XSS, upload non
// filtre, secret en dur) sont corrigees ci-dessous. Le code original
// vulnerable reste consultable dans l'historique git (premier commit).
const express = require('express');
const sqlite3 = require('sqlite3');
const multer = require('multer');
const { execFile } = require('child_process');
const path = require('path');

const app = express();
const db = new sqlite3.Database(':memory:');

// Correction upload : liste blanche d'extensions + taille limitee.
const ALLOWED_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.pdf', '.txt']);
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 Mo max
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, ALLOWED_EXT.has(ext));
  },
});

// Correction secret en dur : la cle vient d'une variable d'environnement.
const API_KEY = process.env.API_KEY || 'dev-only-placeholder';

// Correction XSS : on echappe tout texte insere dans du HTML.
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

db.serialize(() => {
  db.run('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, secret TEXT)');
  db.run("INSERT INTO users (name, secret) VALUES ('admin', 'FLAG{sqli_ok}'), ('bob', 'rien')");
});

app.get('/', (req, res) => {
  res.send(`<h1>DevSecOps TP</h1>
  <ul>
    <li><a href="/user?name=bob">/user?name=</a></li>
    <li><a href="/ping?host=127.0.0.1">/ping?host=</a></li>
    <li><a href="/hello?name=toi">/hello?name=</a></li>
    <li><form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="file"><button>Upload</button></form></li>
  </ul>`);
});

// Correction injection SQL : requete parametree, plus de concatenation.
app.get('/user', (req, res) => {
  db.all('SELECT id, name FROM users WHERE name = ?', [req.query.name], (err, rows) => {
    res.send(err ? 'Erreur' : JSON.stringify(rows));
  });
});

// Correction injection de commande : execFile (pas de shell), arguments
// separes, et l'entree est validee avant tout appel systeme.
const HOST_RE = /^[a-zA-Z0-9.-]+$/;
app.get('/ping', (req, res) => {
  const host = req.query.host || '';
  if (!HOST_RE.test(host)) {
    return res.status(400).send('Hote invalide.');
  }
  execFile('ping', ['-c', '1', host], (err, out) => {
    res.send('<pre>' + escapeHtml(out || String(err)) + '</pre>');
  });
});

// Correction XSS : la valeur est echappee avant d'etre inseree dans la page.
app.get('/hello', (req, res) => {
  res.send('<h1>Bonjour ' + escapeHtml(req.query.name || '') + '</h1>');
});

// Correction upload : extension controlee par fileFilter (voir plus haut).
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Fichier refuse (extension non autorisee ou absente).');
  }
  res.send('Fichier recu : ' + escapeHtml(req.file.originalname));
});

app.listen(3000, () => console.log('http://localhost:3000'));
