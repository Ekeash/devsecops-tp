const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, ImageRun, HeadingLevel, AlignmentType,
  LevelFormat, PageBreak, Footer, PageNumber,
} = require('docx');

// Rapport volontairement simple : pas de page de garde design, pas de
// sommaire auto, pas de tableaux colores, texte direct et concis.

const p = (text) => new Paragraph({ spacing: { after: 160 }, children: [new TextRun(text)] });
const h1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 120 }, children: [new TextRun(t)] });
const h2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 }, children: [new TextRun(t)] });
const bullet = (t) => new Paragraph({ numbering: { reference: 'bul', level: 0 }, spacing: { after: 80 }, children: [new TextRun(t)] });

function img(file, w, h, caption) {
  const ext = file.endsWith('.png') ? 'png' : 'jpg';
  return [
    new Paragraph({
      spacing: { before: 100, after: 40 },
      children: [new ImageRun({ type: ext, data: fs.readFileSync('img/' + file), transformation: { width: w, height: h } })],
    }),
    new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text: caption, italics: true, size: 18 })] }),
  ];
}

const children = [
  new Paragraph({ children: [new TextRun({ text: 'TP - Pratiques proactives de securite web', bold: true, size: 32 })] }),
  new Paragraph({ spacing: { after: 60 }, children: [new TextRun('Nom(s) : Abisheake Kunasekaran')] }),
  new Paragraph({ spacing: { after: 60 }, children: [new TextRun('Depot GitHub : https://github.com/Ekeash/devsecops-tp')] }),
  new Paragraph({ spacing: { after: 300 }, children: [new TextRun('Octobre 2026')] }),

  h1('1. Mise en place de l’environnement GitHub'),
  p('On a cree un depot GitHub public, devsecops-tp. Dedans il y a une petite appli web en Node.js/Express (app.js) qui contient plusieurs failles mises expres, comme demande dans le sujet : injection SQL, injection de commande, XSS, upload de fichier sans controle, un secret ecrit en dur dans le code, des dependances vieilles (express, lodash, minimist, multer) et une image Docker basee sur node:14 qui est ancienne.'),
  p('On a suivi le quickstart GitHub Actions. Un workflow CI (.github/workflows/ci.yml) se lance a chaque push et fait juste npm install + npm test. On voit bien dans l’onglet Actions que ca se declenche tout seul a chaque push.'),
  ...img('02_actions.png', 420, 300, 'Onglet Actions du depot : les workflows se lancent automatiquement.'),

  h1('2. Les outils de securite automatises'),
  h2('CodeQL (analyse du code)'),
  p('On a ajoute un workflow codeql.yml avec le template officiel GitHub pour scanner le code en JavaScript. Il tourne a chaque push. Resultat : 6 alertes trouvees dans app.js, dont une critique (injection de commande sur /ping), une injection SQL, deux XSS reflechis et deux "missing rate limiting".'),
  ...img('03_codescanning.jpg', 380, 374, 'Les 6 alertes CodeQL dans l’onglet Securite.'),
  ...img('07_alerte_codeql.jpg', 380, 352, 'Detail de l’alerte la plus grave (injection de commande).'),
  p('Remarque : CodeQL n’a pas repere le secret en dur ni l’upload sans controle, qu’on avait pourtant mis volontairement. Ca montre qu’un seul outil ne suffit pas.'),

  h2('Dependabot (dependances)'),
  p('Dependabot est active sur le depot, avec un fichier .github/dependabot.yml qui verifie chaque semaine les dependances npm, l’image Docker et les actions GitHub. Resultat : 21 alertes ouvertes (1 critique sur minimist, 13 elevees sur lodash/multer, le reste moyen/faible), et 9 pull requests ouvertes automatiquement pour mettre a jour ces paquets (dont le passage de node:14 a une version recente).'),
  ...img('04_dependabot.jpg', 380, 374, 'Les 21 alertes Dependabot.'),

  h2('Trivy (image Docker)'),
  p('Le workflow trivy.yml construit l’image Docker puis la scanne avec Trivy. Il y a deux etapes : une qui affiche juste le rapport (HIGH+CRITICAL), et une deuxieme qui fait echouer le pipeline s’il y a une CRITICAL. Resultat : le pipeline echoue bien (exit code 1), ce qui est normal puisque node:14 tourne sur une base Debian 10 qui n’est plus supportee. Au total Trivy trouve environ 624 vulnerabilites HIGH/CRITICAL (dont 25 critiques), surtout sur le systeme.'),
  ...img('06_trivy_run.jpg', 380, 352, 'Le workflow Trivy en echec sur le premier commit.'),
  p('Pour corriger ca il faudrait fusionner les PR Dependabot et surtout changer l’image de base (par exemple node:22-alpine), ce qu’on n’a pas encore fait.'),

  h1('3. Ce qu’on en pense (analyse critique)'),
  p('Ce qui marche bien : on a un retour tres rapide, sans rien lancer a la main, avec la ligne de code ou le paquet concerne direct. Dependabot va meme plus loin en proposant la correction toute faite. Et le fait que Trivy bloque le pipeline sur une faille critique, c’est un vrai garde-fou avant de deployer.'),
  p('Les limites qu’on a vues : CodeQL ne detecte pas tout (secret en dur, upload non filtre manques). Il y a aussi beaucoup de bruit (624 vulnerabilites Trivy, dur a traiter une par une). Et les mises a jour automatiques de Dependabot peuvent casser l’appli si c’est un changement de version majeure (express 4 vers 5 par exemple), donc il faut quand meme des tests avant de fusionner.'),

  h1('4. Recommandations DevSecOps'),
  bullet('Automatiser les controles de securite a chaque push, pas juste avant la mise en prod.'),
  bullet('Bloquer le pipeline sur les failles critiques, mais pas sur tout, sinon plus personne ne peut avancer.'),
  bullet('Utiliser plusieurs outils en meme temps (SAST + dependances + image Docker), un seul ne suffit pas.'),
  bullet('Traiter les alertes regulierement, sinon elles s’accumulent et perdent leur utilite.'),
  bullet('Mettre a jour les dependances souvent et par petites etapes, avec des tests pour verifier que ca casse rien.'),
  bullet('Former les devs, car c’est eux qui corrigent au final, pas l’outil.'),

  h1('5. Sensibilisation par la pratique'),
  h2('Mini CTF (3 challenges)'),
  p('On a fait 3 petites applis vulnerables, chacune dans son propre conteneur Docker, en local uniquement :'),
  bullet('Challenge 1 : injection SQL dans un formulaire de connexion (entrer admin\' -- comme identifiant pour se connecter sans mot de passe).'),
  bullet('Challenge 2 : upload de fichier malveillant, un systeme de "greffons" qui execute n’importe quel fichier Python depose, sans verification.'),
  bullet('Challenge 3 : injection de commande dans un outil de ping (127.0.0.1; cat /flag.txt).'),
  p('On a teste les 3 soi-meme pour verifier que chaque faille marche et que le flag sort bien. Chaque challenge a une consigne pour les joueurs et un corrige a part pour le formateur (dans ctf/docs/).'),

  h2('Plateforme CTFd'),
  p('On a installe CTFd en local avec Docker Compose (version officielle), fait l’installation de base, puis cree les 3 challenges dedans avec leur enonce et leur flag.'),
  ...img('09_ctfd_admin_challenges.jpg', 380, 285, 'Les 3 challenges crees dans l’administration CTFd.'),
  ...img('10_ctfd_player_challenges.jpg', 380, 289, 'Vue des challenges cote joueur.'),
  p('On a verifie que ca marche vraiment en soumettant un flag : CTFd l’a valide comme correct.'),
  ...img('11_ctfd_flag_correct.jpg', 380, 285, 'Flag soumis et valide par CTFd.'),

  h2('Quiz'),
  p('On a prepare 17 questions sur les vulnerabilites web et les outils vus dans ce TP (SQLi, XSS, injection de commande, upload, CodeQL, Dependabot, Trivy, DevSecOps...). Le quiz est en ligne sur Kahoot :'),
  p('https://create.kahoot.it/share/quizz/15b795de-527e-4f33-b931-352d39cace20'),

  h1('6. Correction des failles'),
  p('On a ensuite corrige les failles trouvees plus haut :'),
  bullet('Injection SQL : la requete sur /user utilise maintenant une requete parametree (plus de concatenation).'),
  bullet('Injection de commande : /ping utilise execFile (pas de shell) et valide l’adresse avant de l’utiliser.'),
  bullet('XSS : les parametres affiches dans la page sont echappes avant insertion dans le HTML.'),
  bullet('Upload : extension limitee a une liste blanche (images, pdf, txt) et taille max 2 Mo.'),
  bullet('Secret en dur : la cle est maintenant lue depuis une variable d’environnement.'),
  bullet('Dependances : express, lodash, minimist, multer et sqlite3 mis a jour (npm audit : 0 vulnerabilite, contre 21 alertes avant).'),
  bullet('Image Docker : node:14 remplace par node:22-alpine.'),
  p('Apres avoir pousse ces corrections, les pipelines GitHub Actions sont repasses au vert : CodeQL ne trouve plus que 2 alertes mineures ("missing rate limiting", pas corrigees, jugees moins prioritaires), et Trivy passe de 25 vulnerabilites critiques a 0 critique (il reste 11 HIGH, lies aux paquets systeme d’Alpine, acceptable pour ce TP). Le pipeline Trivy, qui echouait avant, passe maintenant.'),

  new Paragraph({ children: [new PageBreak()] }),
  h1('Annexe - liens utiles'),
  bullet('Depot : https://github.com/Ekeash/devsecops-tp'),
  bullet('Quickstart Actions : https://docs.github.com/en/actions/get-started/quickstart'),
  bullet('CodeQL : https://github.com/github/codeql-action'),
  bullet('Trivy Action : https://github.com/aquasecurity/trivy-action'),
  bullet('CTFd : https://github.com/CTFd/CTFd'),
  bullet('Quiz Kahoot : https://create.kahoot.it/share/quizz/15b795de-527e-4f33-b931-352d39cace20'),
];

const doc = new Document({
  creator: 'Etudiant',
  title: 'TP Pratiques proactives de securite web',
  numbering: { config: [{ reference: 'bul', levels: [{ level: 0, format: LevelFormat.BULLET, text: '-', alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 500, hanging: 300 } } } }] }] },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1200, bottom: 1200, left: 1300, right: 1300 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ children: ['Page ', PageNumber.CURRENT] })] })] }) },
    children,
  }],
});

Packer.toBuffer(doc).then((buf) => { fs.writeFileSync('Rapport_TP_DevSecOps.docx', buf); console.log('ok'); });
