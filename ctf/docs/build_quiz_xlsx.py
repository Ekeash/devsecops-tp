"""
Generates a Kahoot-compatible "spreadsheet import" .xlsx from the quiz
content described in quiz-kahoot.md.

Kahoot's official import template header row (English UI) is:
  Question | Answer 1 | Answer 2 | Answer 3 | Answer 4 | Time limit (sec) | Correct answer(s)

"Correct answer(s)" uses the answer number(s), comma separated for
multiple correct answers (here always a single number, single choice).
"""
import openpyxl
from openpyxl.styles import Font

questions = [
    ("Un formulaire de connexion accepte l'entree admin' -- et vous connecte sans mot de passe. De quelle vulnerabilite s'agit-il ?",
     ["Cross-Site Scripting (XSS)", "Injection SQL", "Command Injection", "CSRF"], 20, 2),
    ("Quelle est la meilleure protection contre l'injection SQL ?",
     ["Filtrer les apostrophes a la main", "Utiliser un pare-feu applicatif",
      "Utiliser des requetes parametrees (prepared statements)", "Chiffrer la base de donnees"], 20, 3),
    ("Un site affiche directement dans la page le contenu du parametre ?name= sans l'echapper. Quel risque cela introduit-il ?",
     ["Deni de service", "Cross-Site Scripting (XSS) reflechi", "Injection SQL", "Path Traversal"], 20, 2),
    ("Quel caractere shell permet d'enchainer deux commandes dans une injection de commande ?",
     ["#", "%", ";", "@"], 15, 3),
    ("Pourquoi est-il dangereux de permettre l'upload d'un fichier sans verifier son contenu ?",
     ["Cela ralentit uniquement le serveur", "Le fichier peut contenir du code execute par le serveur",
      "Cela ne pose aucun risque si le fichier est petit", "Cela sature uniquement la bande passante"], 20, 2),
    ("Que signifie l'acronyme SAST ?",
     ["Secure Access Security Token", "Static Application Security Testing",
      "System Authentication Security Test", "Software Access Scan Tool"], 15, 2),
    ("Dans ce TP, quel outil a ete utilise pour l'analyse statique du code (SAST) ?",
     ["Trivy", "Dependabot", "CodeQL", "CTFd"], 15, 3),
    ("Quel outil a scanne l'image Docker pour y trouver des vulnerabilites connues ?",
     ["CodeQL", "Trivy", "Dependabot", "GitHub Actions"], 15, 2),
    ("Quel outil ouvre automatiquement des pull requests pour mettre a jour des dependances vulnerables ?",
     ["Trivy", "CodeQL", "Dependabot", "CTFd"], 15, 3),
    ("Dans une pipeline CI/CD, pourquoi est-il utile de faire echouer le build sur une vulnerabilite critique ?",
     ["Pour ralentir les developpeurs", "Pour empecher le deploiement d'une image ou d'un code dangereux",
      "Pour economiser des ressources serveur", "Ce n'est jamais utile"], 20, 2),
    ("Qu'est-ce que le principe DevSecOps ?",
     ["Confier toute la securite a une equipe externe", "Faire la securite uniquement avant la mise en production",
      "Integrer la securite en continu, tout au long du cycle de developpement",
      "Un outil specifique de scan de vulnerabilites"], 20, 3),
    ("Un mot de passe ou une cle d'API ecrite en dur dans le code source est un risque parce que :",
     ["Cela ralentit l'execution du programme",
      "Toute personne ayant acces au code (depot, historique git...) peut la recuperer",
      "Cela empeche les tests automatiques", "Ce n'est pas un risque si le depot est prive"], 20, 2),
    ("Que recommande-t-on de faire face a une commande systeme construite avec une entree utilisateur ?",
     ["Echapper uniquement les espaces", "Utiliser shell=True pour plus de flexibilite",
      "Appeler le programme avec des arguments separes, sans passer par un shell",
      "Convertir l'entree en majuscules"], 20, 3),
    ("Pourquoi est-il risque d'utiliser une image Docker de base tres ancienne (ex : node:14) ?",
     ["Elle consomme plus de memoire",
      "Elle contient des vulnerabilites connues, non corrigees, dans l'OS et les paquets systemes",
      "Elle est incompatible avec Docker Compose", "Elle ne peut pas etre publiee sur un registre"], 20, 2),
    ("Dans un mini CTF, a quoi correspond le \"flag\" ?",
     ["Un drapeau decoratif affiche sur la plateforme",
      "Une chaine secrete prouvant qu'un challenge a ete resolu avec succes",
      "Le nom du joueur gagnant", "Un type de vulnerabilite"], 15, 2),
    ("Quelle est la difference principale entre SAST et DAST ?",
     ["Aucune, ce sont des synonymes",
      "SAST analyse le code source sans l'executer ; DAST teste l'application en fonctionnement",
      "SAST est plus rapide mais moins precis", "DAST ne s'applique qu'aux applications mobiles"], 20, 2),
    ("Un correctif Dependabot propose de passer d'une version majeure a une autre (ex : Express 4 -> 5). Que faut-il faire avant de fusionner ?",
     ["Fusionner immediatement, Dependabot ne se trompe jamais",
      "Verifier la compatibilite et faire tourner les tests avant de fusionner",
      "Ignorer la pull request", "Supprimer la dependance"], 20, 2),
]

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Sheet1"

headers = ["Question", "Answer 1", "Answer 2", "Answer 3", "Answer 4", "Time limit (sec)", "Correct answer(s)"]
ws.append(headers)
for cell in ws[1]:
    cell.font = Font(bold=True)

for q, answers, time_limit, correct in questions:
    row = [q] + answers + [time_limit, correct]
    ws.append(row)

widths = [60, 24, 24, 24, 24, 14, 14]
for i, w in enumerate(widths, start=1):
    ws.column_dimensions[chr(64 + i)].width = w

wb.save("quiz-kahoot.xlsx")
print("quiz-kahoot.xlsx genere,", len(questions), "questions")
