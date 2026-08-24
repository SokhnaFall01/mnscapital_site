# Déploiement sur votre serveur de test (Docker + sslip.io)

Ce guide explique comment mettre le site en ligne sur un serveur qui héberge
**déjà d'autres sites**, en y accédant via un nom d'hôte **sslip.io**, sans
acheter ni configurer de domaine.

## Le principe (important)

- Votre application tourne dans un **conteneur Docker**, sur un port interne (3000).
- Un **reverse proxy** (Traefik, le plus courant en Docker) reçoit toutes les
  requêtes et les **aiguille selon le nom d'hôte** demandé.
- **sslip.io** fournit gratuitement un nom d'hôte qui pointe vers l'IP de votre
  serveur, automatiquement : par exemple, si l'IP est `203.0.113.45`, alors
  **`mnscapital.203.0.113.45.sslip.io`** pointe déjà vers votre serveur.
- Traefik voit ce nom d'hôte et l'envoie vers le conteneur MNS CAPITAL. Vos
  autres sites gardent leurs propres noms d'hôte : **aucun conflit**.

```
Visiteur → mnscapital.203.0.113.45.sslip.io
                 │
             (Traefik, port 80/443)
             ├── mnscapital.….sslip.io  → conteneur MNS CAPITAL (:3000)
             ├── site-A.exemple.com     → conteneur site A
             └── site-B.exemple.com     → conteneur site B
```

---

## Étape 1 — Identifier votre reverse proxy et son réseau

Sur le serveur, connecté en SSH :

```bash
docker ps                 # cherchez un conteneur « traefik » (ou caddy, nginx-proxy)
docker network ls         # notez le réseau utilisé par le proxy (souvent : proxy, traefik, web)
```

Repérez le **nom du réseau Docker** partagé par le proxy et les autres sites.
On l'appelle ici `proxy` — **remplacez-le partout** si le vôtre porte un autre nom.

> Si vous ne voyez **pas** de Traefik, allez à la section
> « Variantes » plus bas.

---

## Étape 2 — Récupérer le projet sur le serveur

```bash
git clone https://github.com/SokhnaFall01/mnscapital_site.git
cd mnscapital_site
git checkout claude/mns-capital-color-rebrand-rn9nfe
```

---

## Étape 3 — Créer le fichier .env (identifiants)

```bash
cp .env.example .env
nano .env
```

Renseignez :
- `ADMIN_PASSWORD` : le mot de passe de l'espace `/admin`.
- `SESSION_SECRET` : générez une valeur avec `openssl rand -hex 32` et collez-la.

---

## Étape 4 — Adapter `docker-compose.yml`

Ouvrez `docker-compose.yml` et modifiez **deux** choses :

1. **Le nom d'hôte** — remplacez `VOTRE-IP` par l'IP publique du serveur
   (avec des points). Exemple :
   ```
   - "traefik.http.routers.mnscapital.rule=Host(`mnscapital.203.0.113.45.sslip.io`)"
   ```
   (Vous pouvez trouver l'IP avec : `curl -s ifconfig.me`)

2. **Le nom du réseau** — si votre réseau Traefik ne s'appelle pas `proxy`,
   remplacez les 3 occurrences de `proxy` (label `traefik.docker.network`,
   section `networks:` du service, et le bloc `networks:` en bas).

---

## Étape 5 — Construire et lancer

```bash
docker compose up -d --build
```

Vérifier que le conteneur tourne :

```bash
docker compose ps
docker compose logs -f      # Ctrl+C pour quitter
```

Le site est alors accessible à :
- **Site** : `http://mnscapital.VOTRE-IP.sslip.io`
- **Admin** : `http://mnscapital.VOTRE-IP.sslip.io/admin`

---

## Étape 6 — HTTPS (optionnel mais recommandé)

sslip.io est compatible avec Let's Encrypt. Si votre Traefik possède déjà un
**certresolver** (souvent nommé `letsencrypt`), décommentez le bloc HTTPS dans
`docker-compose.yml` et remplacez `letsencrypt` par le nom de votre resolver,
puis relancez `docker compose up -d`. L'accès se fera alors en `https://`.

---

## Persistance des données (déjà gérée)

Le `docker-compose.yml` monte deux volumes pour que **rien ne soit perdu** au
redémarrage ou à la reconstruction du conteneur :
- `content.json` → tout le texte du site (modifié via l'admin).
- `public/assets/img/` → le logo, les photos et **les images téléversées**.

Ces fichiers vivent sur le disque du serveur, à côté du projet.

---

## Mettre à jour le site plus tard (nouvelle version du code)

```bash
cd mnscapital_site
git pull
docker compose up -d --build
```

Vos contenus (`content.json`) et images téléversées sont conservés.

---

## Variantes (si vous n'utilisez pas Traefik)

**a) nginx-proxy (jwilder) :** au lieu des labels Traefik, ajoutez au service :
```yaml
    environment:
      - VIRTUAL_HOST=mnscapital.VOTRE-IP.sslip.io
      - VIRTUAL_PORT=3000
```
et rattachez le conteneur au réseau de nginx-proxy.

**b) Caddy (caddy-docker-proxy) :** remplacez les labels par :
```yaml
    labels:
      caddy: mnscapital.VOTRE-IP.sslip.io
      caddy.reverse_proxy: "{{upstreams 3000}}"
```

**c) Pas de proxy Docker (Nginx/Apache classique sur l'hôte) :** publiez un
port et proxifiez-le. Dans `docker-compose.yml`, retirez les `labels`/`networks`
et ajoutez :
```yaml
    ports:
      - "127.0.0.1:3001:3000"
```
Puis créez un vhost qui proxifie `mnscapital.VOTRE-IP.sslip.io` vers
`http://127.0.0.1:3001`. (Je peux vous fournir ce vhost Nginx ou Apache si besoin.)

---

## Rappels de sécurité

- **Changez `ADMIN_PASSWORD`** (ne laissez jamais la valeur par défaut).
- Renseignez un **`SESSION_SECRET`** long et aléatoire.
- Activez **HTTPS** dès que possible (surtout pour l'accès à `/admin`).
