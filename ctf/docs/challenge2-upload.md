# Challenge 2 - Greffons du tableau de bord (Upload malveillant)

**Catégorie :** Web — Upload de fichier
**Difficulté :** Moyenne
**Lien :** http://localhost:5002 (ou l'adresse fournie par le formateur)

## Consigne (visible par les joueurs)

Le tableau de bord interne permet à n'importe qui de déposer un
"greffon" (plugin) et de l'exécuter. Aucune vérification n'est faite
sur le contenu déposé. Le flag se trouve dans une variable d'environnement
du serveur, accessible depuis l'intérieur d'un greffon exécuté.

Déposez un greffon qui révèle le flag. Le flag est au format `FLAG{...}`.

**Indice 1 (coût léger) :** Regardez comment la page affiche le résultat
d'exécution d'un greffon : que doit contenir votre fichier pour que ce
résultat apparaisse ?

**Indice 2 (coût plus élevé) :** Le serveur exécute votre fichier Python
avec un espace de noms qui contient déjà une variable nommée `FLAG`.

## Corrigé formateur (ne pas publier aux joueurs)

Le serveur exécute le fichier déposé avec `exec()`, en lui passant un
dictionnaire contenant déjà `FLAG` :

```python
exec(compile(source, name, "exec"), {"FLAG": FLAG, "__name__": "__plugin__"}, captured)
result = captured.get("output", ...)
```

Il suffit de déposer un fichier `.py` dont le contenu est :

```python
output = FLAG
```

puis de l'exécuter via le bouton "Exécuter". Le serveur renvoie
`FLAG{uns4f3_upl0ad_c0de_exec}`.

Variante plus "offensive" possible : lire des fichiers du système
(`output = open('/etc/hostname').read()`) ou lancer une commande
(`import os; output = os.popen('id').read()`), pour illustrer que
l'upload non filtré équivaut en pratique à une exécution de code
arbitraire côté serveur.

**Correction à recommander :** ne jamais exécuter un fichier déposé par
un utilisateur ; whitelister les extensions et le type MIME réel du
fichier (vérification du contenu, pas seulement du nom) ; stocker les
fichiers hors de tout répertoire exécutable ou interprété ; limiter la
taille et renommer les fichiers à la réception.
