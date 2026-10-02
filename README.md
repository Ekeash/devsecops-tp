# DevSecOps TP - appli volontairement vulnerable

Ne JAMAIS deployer en production.

Failles presentes : injection SQL (`/user`), injection de commande (`/ping`), XSS (`/hello`),
upload non filtre (`/upload`), secret en dur, dependances obsoletes, image Docker `node:14`.

Lancer : `npm install && npm start` puis http://localhost:3000
