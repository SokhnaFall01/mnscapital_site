# MNS CAPITAL — Site + Espace administrateur

Site vitrine de **MNS CAPITAL** (cabinet de conseil basé à Dakar) avec un
**espace administrateur** permettant de modifier tout le contenu du site
(textes, listes, images) sans toucher au code.

Application **Node.js / Express** : les pages sont générées à partir d'un
fichier de contenu unique (`content.json`), modifiable depuis `/admin`.

## Démarrage rapide (local)

```bash
npm install
npm start
```

- Site : http://localhost:3000
- Administration : http://localhost:3000/admin

> **Mot de passe par défaut : `mnscapital2026`** — à changer impérativement (voir ci-dessous).

## Configuration (variables d'environnement)

| Variable | Rôle | Défaut |
|----------|------|--------|
| `PORT` | Port d'écoute du serveur | `3000` |
| `ADMIN_PASSWORD` | Mot de passe de l'espace admin | `mnscapital2026` |
| `SESSION_SECRET` | Clé de session (chaîne aléatoire longue) | générée au démarrage |

Exemple :

```bash
PORT=8080 ADMIN_PASSWORD="VotreMotDePasseFort" SESSION_SECRET="chaine-aleatoire-longue" npm start
```

Sur un hébergeur (Render, Railway, VPS…), définissez ces variables dans le
panneau de configuration du service. **Fixez toujours `ADMIN_PASSWORD` et
`SESSION_SECRET`** en production.

## L'espace administrateur

1. Aller sur `/admin`, saisir le mot de passe.
2. Choisir une rubrique dans le menu de gauche : **Général, Accueil,
   Expertises, Services, Expertise, Actualités, Carrières, Contact**.
3. Modifier les textes, ajouter/supprimer des éléments de liste
   (engagements, valeurs, expertises, offres d'emploi…), remplacer des images
   via **« Changer l'image »**.
4. Cliquer sur **« Enregistrer les modifications »** — les changements sont
   écrits dans `content.json` et **visibles immédiatement sur le site**.

À chaque enregistrement, une sauvegarde `content.json.bak` de la version
précédente est créée automatiquement.

## Structure du projet

```
server.js            Serveur Express (pages publiques + API admin)
content.json         Contenu éditable de tout le site (source unique)
package.json
views/               Gabarits EJS
  partials/          En-tête et pied de page partagés
  home, services, expertise, actualites, carrieres, contact
  admin/             login + dashboard (éditeur)
public/              Fichiers statiques servis tels quels
  assets/css/        styles.css (site) + admin.css (admin)
  assets/js/         main.js (site) + admin.js (éditeur)
  assets/img/        logo + photos (les images téléversées arrivent ici)
```

## Palette de marque

Centralisée en variables CSS (`:root`) dans `public/assets/css/styles.css`.

**Bleus (marine)** : `--navy #0E2A4E` · `--navy-deep #081B33` · `--navy-soft #16385F`
**Dorés** : `--gold #E3A82B` · `--gold-light #F3C95C` · `--gold-dark #B07E1E`
**Neutres** : `--white #FFFFFF` · `--mist #F5F7F9` · `--line #E3E8ED` · `--silver #98A3AE` · `--ink #14212F`

## Déploiement (résumé)

1. Héberger sur un service qui exécute Node.js (Render, Railway, un VPS, etc.).
2. Commande de démarrage : `npm start` (Node ≥ 18).
3. Définir les variables `ADMIN_PASSWORD` et `SESSION_SECRET`.
4. **Persistance des images et du contenu** : `content.json` et les images
   téléversées dans `public/assets/img/` sont écrits sur le disque du serveur.
   Sur un hébergement à disque éphémère, prévoyez un **disque persistant**
   (volume) pour conserver les modifications entre les redémarrages.

## À finaliser

1. **Mot de passe admin** : changer `ADMIN_PASSWORD` en production.
2. **Coordonnées** : renseigner l'e-mail et le téléphone du cabinet
   (rubrique Contact de l'admin).
3. **Formulaire de contact** : les messages sont pour l'instant journalisés
   côté serveur (console). Brancher un envoi d'e-mail (ex. Nodemailer) si besoin.
4. **Mentions légales / Confidentialité** : pages à créer (liens dans le pied de page).
