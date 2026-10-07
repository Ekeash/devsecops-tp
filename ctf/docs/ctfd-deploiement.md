# Déploiement de CTFd

CTFd est un projet tiers (GPL). Son code n'est pas versionné dans ce
dépôt : on clone officiellement le projet et on le lance avec Docker
Compose.

## 1. Lancer les 3 challenges

```bash
cd ctf
docker compose up -d --build
```

Les challenges sont alors disponibles sur :
- http://localhost:5001 — Challenge 1 (injection SQL)
- http://localhost:5002 — Challenge 2 (upload malveillant)
- http://localhost:5003 — Challenge 3 (injection de commande)

## 2. Lancer CTFd

```bash
cd ctf
git clone --depth 1 https://github.com/CTFd/CTFd.git ctfd
cd ctfd
docker compose up -d --build
```

CTFd est accessible sur http://localhost (port 80, via nginx).

## 3. Assistant d'installation

Au premier démarrage, ouvrez http://localhost/setup et suivez
l'assistant :
1. Nom et description de l'évènement.
2. Mode de jeu (équipes ou joueurs individuels).
3. Visibilité (laisser les valeurs par défaut pour un usage interne).
4. Compte administrateur : choisissez un identifiant, un e-mail et un
   mot de passe. **Ne les committez jamais dans le dépôt.**
5. Style, dates, intégrations : peuvent être laissés par défaut.

## 4. Créer les 3 challenges dans CTFd

Dans l'administration (`/admin/challenges/new`), créer un challenge par
vulnérabilité, en reprenant le contenu "Consigne (visible par les
joueurs)" de chaque fiche :
- [challenge1-sqli.md](challenge1-sqli.md)
- [challenge2-upload.md](challenge2-upload.md)
- [challenge3-cmdinj.md](challenge3-cmdinj.md)

Pour chaque challenge : nom, catégorie, description (= la consigne),
valeur en points, puis le flag exact (voir `docker-compose.yml` du
dossier `ctf/` pour les valeurs de `FLAG`). Penser à repasser l'état du
challenge sur **Visible** après création (nouveau challenge = caché par
défaut).

## 5. Vérification

- Se connecter en tant que joueur (ou créer une équipe si le mode
  équipe est actif), ouvrir `/challenges`, résoudre un challenge et
  soumettre son flag : le statut doit passer à **Correct**.
- Le barème de points de l'exemple : 100 (challenge 1), 200
  (challenge 2, plus difficile), 100 (challenge 3).

## 6. Arrêt / nettoyage

```bash
cd ctf/ctfd && docker compose down
cd ctf && docker compose down
```

Pour tout réinitialiser (y compris les données CTFd) :

```bash
cd ctf/ctfd && docker compose down -v
```
