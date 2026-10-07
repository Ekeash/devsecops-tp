"""
Challenge CTF n.3 - Execution de commande shell via vulnerabilite
Usage pedagogique uniquement, container isole, usage local.

Scenario joueur :
  Un petit outil reseau interne permet de tester si une machine repond
  au ping. Le champ "hote" est transmis directement a la commande
  systeme, sans aucune validation.
"""
import os
import subprocess

from flask import Flask, render_template, request

app = Flask(__name__)
FLAG = os.environ.get("FLAG", "FLAG{demo_cmdi}")

# Le flag est aussi depose dans un fichier, comme le ferait une vraie
# donnee sensible presente sur un serveur mal configure.
with open("/flag.txt", "w") as f:
    f.write(FLAG + "\n")


@app.route("/", methods=["GET"])
def home():
    return render_template("index.html", output=None, host="")


@app.route("/ping", methods=["POST"])
def ping():
    host = request.form.get("host", "")

    # VULNERABILITE : la valeur fournie par l'utilisateur est inseree
    # directement dans une commande shell (shell=True), sans validation
    # ni liste blanche de caracteres. Des separateurs comme  ; | &&
    # permettent d'enchainer une commande arbitraire.
    command = "ping -c 1 " + host
    try:
        result = subprocess.run(
            command, shell=True, capture_output=True, text=True, timeout=5
        )
        output = result.stdout + result.stderr
    except subprocess.TimeoutExpired:
        output = "Delai depasse."

    return render_template("index.html", output=output, host=host)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
