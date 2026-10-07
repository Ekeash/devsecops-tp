# Mini CTF et CTFd - Sensibilisation par la pratique

Ce dossier contient la partie "Sensibilisation par la pratique" du TP :
un mini CTF de 3 challenges, déployé sur une instance CTFd, plus un quiz
interactif prêt à importer dans Kahoot.

**Usage strictement local et pédagogique.** Les applications de ce
dossier sont volontairement vulnérables : elles ne doivent jamais être
exposées sur Internet ni utilisées hors d'un atelier encadré.

## Contenu

- `challenge1-sqli/`, `challenge2-upload/`, `challenge3-cmdinj/` :
  les 3 mini-applications vulnérables (une par type de faille), chacune
  conteneurisée.
- `docker-compose.yml` : lance les 3 challenges (ports 5001-5003).
- `docs/` :
  - `challenge1-sqli.md`, `challenge2-upload.md`, `challenge3-cmdinj.md` :
    consigne joueur + corrigé formateur pour chaque challenge.
  - `quiz-kahoot.md` / `quiz-kahoot.xlsx` : 17 questions de
    sensibilisation, au format d'import Kahoot.
  - `ctfd-deploiement.md` : procédure de déploiement de CTFd et
    d'intégration des 3 challenges.
- `ctfd/` : *non versionné*, cloné depuis le dépôt officiel CTFd (voir
  `docs/ctfd-deploiement.md`).

## Démarrage rapide

```bash
# 1. Les 3 challenges
cd ctf && docker compose up -d --build

# 2. CTFd
git clone --depth 1 https://github.com/CTFd/CTFd.git ctfd
cd ctfd && docker compose up -d --build
```

Puis suivre `docs/ctfd-deploiement.md` pour l'installation et
l'intégration des challenges.

## Flags (référence formateur)

| Challenge | Flag |
|---|---|
| 1 - Injection SQL | `FLAG{sQl1_1nj3ct10n_byp4ss_l0g1n}` |
| 2 - Upload malveillant | `FLAG{uns4f3_upl0ad_c0de_exec}` |
| 3 - Injection de commande | `FLAG{c0mm4nd_1nj3ct10n_v1a_p1ng}` |
