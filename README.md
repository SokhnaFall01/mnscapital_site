# MNS CAPITAL — Site vitrine

Site vitrine statique (HTML / CSS / JS, sans étape de build) pour **MNS CAPITAL**,
cabinet indépendant de conseil basé à **Dakar** : ingénierie financière,
intermédiation stratégique, finance digitale et stratégie au service de l'Afrique.

Devise : **STRUCTURER. FINANCER. TRANSFORMER.**

Le site reprend le texte et les images fournis (document maquette) et applique la
**charte de couleurs bleu marine / doré** issue du logo.

## Aperçu

Ouvrez `index.html` dans un navigateur — aucun serveur ni compilation nécessaire.

```
open index.html          # macOS
xdg-open index.html      # Linux
```

## Pages

| Fichier | Rubrique |
|---------|----------|
| `index.html` | À propos — Le Cabinet (histoire, vision, mission, engagements, valeurs, promesse) |
| `services.html` | Nos services (offre intégrée, 4 expertises, approche, clients) |
| `expertise.html` | Notre expertise (4 expertises, différence, parcours en 6 étapes) |
| `actualites.html` | Perspectives / Actualités |
| `carrieres.html` | Carrières |
| `contact.html` | Contact (formulaire) |

## Structure des fichiers

```
index.html, services.html, expertise.html,
actualites.html, carrieres.html, contact.html   Les 6 pages
assets/
  css/styles.css      Feuille de styles + variables de couleurs
  js/main.js          Navigation mobile, animations, formulaires
  img/
    logo.png                    Logo MNS CAPITAL
    reunion-conseil.jpg         Hero « À propos »
    presentation-strategie.jpg  Section « Notre histoire »
    finance-digitale.jpg        Section « Notre différence »
    poignee-main.jpg            Section « Carrières »
README.md
```

## Palette de marque

Toutes les couleurs sont centralisées dans des variables CSS en haut de
`assets/css/styles.css` (`:root`). Pour ajuster la charte, modifiez ces variables.

### Bleus (marine — tirés du logo)
| Rôle | Variable | Hex |
|------|----------|-----|
| Bleu marine principal | `--navy` | `#0E2A4E` |
| Bleu marine profond (hero, footer) | `--navy-deep` | `#081B33` |
| Bleu marine doux (dégradés) | `--navy-soft` | `#16385F` |

### Dorés (tirés de la flèche du logo)
| Rôle | Variable | Hex |
|------|----------|-----|
| Doré principal | `--gold` | `#E3A82B` |
| Doré clair (accents, dégradés) | `--gold-light` | `#F3C95C` |
| Doré foncé (kicker, survols) | `--gold-dark` | `#B07E1E` |

### Neutres
| Rôle | Variable | Hex |
|------|----------|-----|
| Blanc (fonds) | `--white` | `#FFFFFF` |
| Gris très clair (sections « mist ») | `--mist` | `#F5F7F9` |
| Gris bordures / lignes | `--line` | `#E3E8ED` |
| Gris argenté (texte secondaire) | `--silver` | `#98A3AE` |
| Encre / texte principal | `--ink` | `#14212F` |

## À finaliser

Quelques éléments restent à compléter avec vos informations définitives :

1. **Coordonnées** (page `contact.html`) — e-mail et téléphone officiels du cabinet
   (actuellement marqués « à renseigner »).
2. **Mentions légales / Confidentialité** — pages à créer (liens présents dans le pied de page).
3. **Formulaires** — les formulaires de contact et de newsletter sont des démos
   côté client ; branchez-les sur votre service d'envoi (Formspree, backend, etc.).
4. **Réseaux sociaux** — à ajouter si souhaité.
