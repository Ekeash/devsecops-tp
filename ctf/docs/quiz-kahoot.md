# Quiz interactif - Sensibilisation aux vulnérabilités web

Ce quiz est conçu pour être recréé sur **Kahoot** (https://kahoot.com), ou
sur n'importe quel outil équivalent (Wooclap, Socrative...). Kahoot
nécessite un compte ; la création de ce compte et la saisie des
questions dans l'interface Kahoot doivent être faites directement par
l'utilisateur. Ce document fournit le contenu prêt à copier-coller,
ainsi qu'un fichier `quiz-kahoot.xlsx` au format d'import officiel de
Kahoot (modèle "Spreadsheet import").

Durée indicative : 15 questions, environ 20 minutes avec les
explications. Chaque question propose 4 réponses, une seule correcte.

## 1. Un formulaire de connexion accepte l'entrée `admin' --` et vous connecte sans mot de passe. De quelle vulnérabilité s'agit-il ?
- A. Cross-Site Scripting (XSS)
- B. **Injection SQL** ✅
- C. Command Injection
- D. CSRF

## 2. Quelle est la meilleure protection contre l'injection SQL ?
- A. Filtrer les apostrophes à la main
- B. Utiliser un pare-feu applicatif
- C. **Utiliser des requêtes paramétrées (prepared statements)** ✅
- D. Chiffrer la base de données

## 3. Un site affiche directement dans la page le contenu du paramètre `?name=` sans l'échapper. Quel risque cela introduit-il ?
- A. Déni de service
- B. **Cross-Site Scripting (XSS) réfléchi** ✅
- C. Injection SQL
- D. Path Traversal

## 4. Quel caractère shell permet d'enchaîner deux commandes dans une injection de commande ?
- A. `#`
- B. `%`
- C. **`;`** ✅
- D. `@`

## 5. Pourquoi est-il dangereux de permettre l'upload d'un fichier sans vérifier son contenu ?
- A. Cela ralentit uniquement le serveur
- B. **Le fichier peut contenir du code exécuté par le serveur** ✅
- C. Cela ne pose aucun risque si le fichier est petit
- D. Cela sature uniquement la bande passante

## 6. Que signifie l'acronyme SAST ?
- A. Secure Access Security Token
- B. **Static Application Security Testing** ✅
- C. System Authentication Security Test
- D. Software Access Scan Tool

## 7. Dans ce TP, quel outil a été utilisé pour l'analyse statique du code (SAST) ?
- A. Trivy
- B. Dependabot
- C. **CodeQL** ✅
- D. CTFd

## 8. Quel outil a scanné l'image Docker pour y trouver des vulnérabilités connues ?
- A. CodeQL
- B. **Trivy** ✅
- C. Dependabot
- D. GitHub Actions

## 9. Quel outil ouvre automatiquement des pull requests pour mettre à jour des dépendances vulnérables ?
- A. Trivy
- B. CodeQL
- C. **Dependabot** ✅
- D. CTFd

## 10. Dans une pipeline CI/CD, pourquoi est-il utile de faire échouer le build sur une vulnérabilité critique ?
- A. Pour ralentir les développeurs
- B. **Pour empêcher le déploiement d'une image ou d'un code dangereux** ✅
- C. Pour économiser des ressources serveur
- D. Ce n'est jamais utile

## 11. Qu'est-ce que le principe DevSecOps ?
- A. Confier toute la sécurité à une équipe externe
- B. Faire la sécurité uniquement avant la mise en production
- C. **Intégrer la sécurité en continu, tout au long du cycle de développement** ✅
- D. Un outil spécifique de scan de vulnérabilités

## 12. Un mot de passe ou une clé d'API écrite en dur dans le code source est un risque parce que :
- A. Cela ralentit l'exécution du programme
- B. **Toute personne ayant accès au code (dépôt, historique git...) peut la récupérer** ✅
- C. Cela empêche les tests automatiques
- D. Ce n'est pas un risque si le dépôt est privé

## 13. Que recommande-t-on de faire face à une commande système construite avec une entrée utilisateur ?
- A. Échapper uniquement les espaces
- B. Utiliser `shell=True` pour plus de flexibilité
- C. **Appeler le programme avec des arguments séparés, sans passer par un shell** ✅
- D. Convertir l'entrée en majuscules

## 14. Pourquoi est-il risqué d'utiliser une image Docker de base très ancienne (ex : `node:14`) ?
- A. Elle consomme plus de mémoire
- B. **Elle contient des vulnérabilités connues, non corrigées, dans l'OS et les paquets systèmes** ✅
- C. Elle est incompatible avec Docker Compose
- D. Elle ne peut pas être publiée sur un registre

## 15. Dans un mini CTF, à quoi correspond le "flag" ?
- A. Un drapeau décoratif affiché sur la plateforme
- B. **Une chaîne secrète prouvant qu'un challenge a été résolu avec succès** ✅
- C. Le nom du joueur gagnant
- D. Un type de vulnérabilité

---

## Pour aller plus loin (questions bonus optionnelles)

## 16. Quelle est la différence principale entre SAST et DAST ?
- A. Aucune, ce sont des synonymes
- B. **SAST analyse le code source sans l'exécuter ; DAST teste l'application en fonctionnement** ✅
- C. SAST est plus rapide mais moins précis
- D. DAST ne s'applique qu'aux applications mobiles

## 17. Un correctif Dependabot propose de passer d'une version majeure à une autre (ex : Express 4 → 5). Que faut-il faire avant de fusionner ?
- A. Fusionner immédiatement, Dependabot ne se trompe jamais
- B. **Vérifier la compatibilité et faire tourner les tests avant de fusionner** ✅
- C. Ignorer la pull request
- D. Supprimer la dépendance
