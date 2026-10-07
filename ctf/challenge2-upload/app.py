"""
Challenge CTF n.2 - Upload de fichier malveillant
Usage pedagogique uniquement, container isole, usage local.

Scenario joueur :
  Une petite plateforme interne permet d'ajouter des "greffons" (plugins)
  Python pour etendre le tableau de bord. N'importe qui peut deposer un
  fichier et demander son execution, sans aucune verification de contenu.
"""
import os
import uuid

from flask import Flask, render_template, request

app = Flask(__name__)
FLAG = os.environ.get("FLAG", "FLAG{demo_upload}")
PLUGIN_DIR = "/app/plugins"
os.makedirs(PLUGIN_DIR, exist_ok=True)


@app.route("/", methods=["GET"])
def home():
    plugins = sorted(os.listdir(PLUGIN_DIR))
    return render_template("index.html", plugins=plugins, output=None)


@app.route("/upload", methods=["POST"])
def upload():
    file = request.files.get("plugin")
    if not file or file.filename == "":
        return render_template("index.html", plugins=os.listdir(PLUGIN_DIR), output="Aucun fichier recu.")

    # VULNERABILITE : aucune verification du type, de l'extension ou du
    # contenu du fichier avant de l'enregistrer dans le dossier des
    # greffons. Le nom d'origine est conserve tel quel.
    dest = os.path.join(PLUGIN_DIR, file.filename)
    file.save(dest)
    return render_template("index.html", plugins=sorted(os.listdir(PLUGIN_DIR)), output="Greffon '{}' depose.".format(file.filename))


@app.route("/run", methods=["POST"])
def run_plugin():
    name = request.form.get("plugin", "")
    path = os.path.join(PLUGIN_DIR, name)
    plugins = sorted(os.listdir(PLUGIN_DIR))

    if not os.path.isfile(path):
        return render_template("index.html", plugins=plugins, output="Greffon introuvable.")

    # VULNERABILITE : le contenu du fichier depose par l'utilisateur est
    # execute directement cote serveur, sans sandbox ni analyse (systeme
    # de "greffons" non securise -> execution de code arbitraire).
    captured = {}
    try:
        source = open(path, "r", encoding="utf-8", errors="replace").read()
        exec(compile(source, name, "exec"), {"FLAG": FLAG, "__name__": "__plugin__"}, captured)
        result = captured.get("output", "Le greffon s'est execute sans produire de sortie ('output').")
    except Exception as exc:  # pedagogique : on affiche l'erreur pour guider
        result = "Erreur a l'execution du greffon : {}".format(exc)

    return render_template("index.html", plugins=plugins, output=result)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
