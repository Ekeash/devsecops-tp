"""
Challenge CTF n.1 - Injection SQL simple
Usage pedagogique uniquement, container isole, usage local.

Scenario joueur :
  Un petit espace "intranet" avec une page de connexion. L'administrateur
  a laisse un message confidentiel accessible uniquement apres connexion
  en tant qu'admin. Le formulaire est vulnerable a l'injection SQL.
"""
import os
import sqlite3

from flask import Flask, g, redirect, render_template, request

app = Flask(__name__)
FLAG = os.environ.get("FLAG", "FLAG{demo_sqli}")
DB_PATH = "/tmp/users.db"


def get_db():
    db = getattr(g, "_database", None)
    if db is None:
        db = g._database = sqlite3.connect(DB_PATH)
    return db


def init_db():
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, role TEXT)"
    )
    conn.execute(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        ("bob", "bobpassword123", "user"),
    )
    conn.execute(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        ("admin", "S3cr3t_Adm1n_2026!", "admin"),
    )
    conn.commit()
    conn.close()


@app.route("/", methods=["GET"])
def home():
    return render_template("login.html", error=None)


@app.route("/login", methods=["POST"])
def login():
    username = request.form.get("username", "")
    password = request.form.get("password", "")

    # VULNERABILITE : la requete est construite par concatenation de
    # chaines, directement avec les valeurs envoyees par l'utilisateur.
    # Une entree comme  admin' --  ou  ' OR '1'='1  change le sens de
    # la requete SQL executee par le serveur.
    query = "SELECT username, role FROM users WHERE username = '{}' AND password = '{}'".format(
        username, password
    )

    db = get_db()
    try:
        cur = db.execute(query)
        row = cur.fetchone()
    except sqlite3.Error as exc:
        return render_template("login.html", error="Erreur SQL : {}".format(exc))

    if row is None:
        return render_template("login.html", error="Identifiants incorrects.")

    user, role = row
    if role == "admin":
        return render_template("success.html", user=user, flag=FLAG)
    return render_template("success.html", user=user, flag=None)


@app.route("/reset", methods=["GET"])
def reset():
    # Permet de remettre la base dans son etat initial pendant les ateliers.
    init_db()
    return redirect("/")


if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=5000)
