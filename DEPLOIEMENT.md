# Déploiement sur votre serveur (Docker + Caddy + sslip.io)

Guide adapté à **votre serveur de test** :
- Reverse proxy : **Caddy** (`radia-glam-caddy-1`, image `caddy:2-alpine`)
- Réseau Docker : **`radia-glam_default`**
- Nom d'hôte d'accès : **`mnscapital.167.233.231.68.sslip.io`**

Le principe : l'application MNS CAPITAL tourne dans un conteneur, rejoint le
réseau de votre Caddy, et **Caddy route le nom d'hôte sslip.io vers elle**.
Vos autres sites (stack `radia-glam`) ne sont pas touchés. **Caddy gère le
HTTPS automatiquement** (certificat Let's Encrypt, sans configuration).

---

## Étape 1 — Récupérer le projet

```bash
cd ~
git clone https://github.com/SokhnaFall01/mnscapital_site.git
cd mnscapital_site
git checkout claude/mns-capital-color-rebrand-rn9nfe
```

## Étape 2 — Créer le fichier .env (identifiants)

```bash
cp .env.example .env
nano .env
```
- `ADMIN_PASSWORD` : mot de passe de l'espace `/admin`.
- `SESSION_SECRET` : générez-le avec `openssl rand -hex 32` et collez-le.

## Étape 3 — Démarrer le conteneur

```bash
docker compose up -d --build
docker compose ps        # doit afficher « mnscapital » en cours d'exécution
```

Le `docker-compose.yml` est déjà réglé pour rejoindre le réseau
`radia-glam_default`. À ce stade, le conteneur tourne mais n'est pas encore
routé : il reste l'étape Caddy.

## Étape 4 — Router le nom d'hôte dans Caddy

1. **Trouver le Caddyfile** utilisé par votre conteneur Caddy :
   ```bash
   docker inspect radia-glam-caddy-1 --format '{{json .Mounts}}' | tr ',' '\n'
   ```
   Repérez la ligne du **Caddyfile** (source côté hôte), par ex.
   `/root/radia-glam/Caddyfile` ou `/root/radia-glam/caddy/Caddyfile`.

2. **Ajouter le bloc** suivant à la fin de ce Caddyfile
   (contenu identique à `deploy/Caddyfile-snippet.conf`) :
   ```
   mnscapital.167.233.231.68.sslip.io {
       reverse_proxy mnscapital:3000
   }
   ```

3. **Recharger Caddy** (sans coupure) :
   ```bash
   docker exec radia-glam-caddy-1 caddy reload --config /etc/caddy/Caddyfile
   ```
   > Si le Caddyfile est monté à un autre emplacement dans le conteneur,
   > adaptez le chemin ; en dernier recours : `docker restart radia-glam-caddy-1`.

## Étape 5 — Vérifier

- Site : **https://mnscapital.167.233.231.68.sslip.io**
- Admin : **https://mnscapital.167.233.231.68.sslip.io/admin**

Le premier accès peut prendre quelques secondes (Caddy obtient le certificat).

Diagnostic si besoin :
```bash
docker compose logs -f            # logs de l'app MNS CAPITAL
docker logs radia-glam-caddy-1    # logs de Caddy (obtention du certificat)
```

---

## Mettre à jour le site plus tard

```bash
cd ~/mnscapital_site
git pull
docker compose up -d --build
```
Vos contenus (`content.json`) et images téléversées sont conservés (volumes).

## Persistance (déjà gérée)

Le `docker-compose.yml` monte deux volumes pour ne rien perdre au redémarrage :
- `content.json` → tout le texte du site (modifié via l'admin) ;
- `public/assets/img/` → logo, photos et **images téléversées**.

## Rappels de sécurité

- **Changez `ADMIN_PASSWORD`** (jamais la valeur par défaut).
- Renseignez un **`SESSION_SECRET`** long et aléatoire.
- Le HTTPS est automatique via Caddy — parfait pour protéger l'accès à `/admin`.

---

## Notes

- **IPv6** : `ifconfig.me` a renvoyé une adresse IPv6 car la requête est
  passée en IPv6. Le nom d'hôte utilise votre **IPv4 `167.233.231.68`**, ce qui
  est correct. (sslip.io accepte aussi l'IPv6 sous la forme
  `mnscapital.2a01-4f8-c015-3814--1.sslip.io` si un jour vous préférez l'IPv6.)
- **Changer de nom d'hôte** (autre IP, ou vrai domaine plus tard) : il suffit de
  modifier le nom d'hôte dans le Caddyfile et de recharger Caddy. Le conteneur
  ne change pas.
