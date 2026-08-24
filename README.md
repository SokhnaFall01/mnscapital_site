# MNS Capital Africa — Site vitrine

Site vitrine statique (HTML / CSS / JS, sans dépendance de build) pour
**MNS Capital Africa**, un cabinet de conseil financier dédié à l'Afrique.

Ce dépôt reprend la structure d'un site vitrine de conseil financier
(en-tête fixe, hero, à propos, services, approche, secteurs, équipe,
contact, pied de page) et applique **la nouvelle palette de marque bleu
marine / doré** issue du logo.

## Aperçu

Ouvrez simplement `index.html` dans un navigateur — aucun serveur ni
compilation n'est nécessaire.

```
open index.html          # macOS
xdg-open index.html      # Linux
```

## Structure

```
index.html            Page principale (toutes les sections)
assets/
  css/styles.css      Feuille de styles + variables de couleurs
  js/main.js          Navigation mobile, animations, formulaire
  img/                (vide) — déposez ici vos images définitives
README.md
```

## Palette de marque

Toutes les couleurs sont centralisées dans des variables CSS en haut de
`assets/css/styles.css` (`:root`). Pour ajuster la charte, il suffit de
modifier ces variables.

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

## Personnalisation du contenu

> **Note importante.** Le site source
> (`mns-capital-africa.skywork.website`) n'était pas accessible depuis
> l'environnement de génération (accès réseau sortant bloqué par la
> politique de sécurité). Les textes et visuels de ce dépôt ont donc été
> rédigés à partir des **informations publiques** de l'entreprise
> (services de conseil d'entreprise, levée de capitaux et entrée sur les
> marchés ; réseau panafricain et places financières mondiales ;
> contact `info@mncapital-africa.com`). Ils reprennent fidèlement la mise
> en page et la nouvelle palette demandées, mais **doivent être remplacés
> par vos textes et images définitifs** pour obtenir un clone exact.

À remplacer :

1. **Textes** — chaque section dans `index.html` (hero, à propos, services,
   équipe, etc.). Les libellés sont clairement identifiés.
2. **Images** — déposez vos visuels dans `assets/img/` puis remplacez les
   blocs SVG de remplacement (logo, photo « à propos », photos d'équipe).
3. **Logo** — le logo est un SVG en ligne aux couleurs de la marque ; vous
   pouvez le remplacer par votre fichier officiel.
4. **Coordonnées** — e-mail, téléphone et réseaux sociaux dans la section
   contact et le pied de page.
5. **Formulaire** — le formulaire est une démo côté client ; branchez-le
   sur votre service d'envoi (Formspree, backend, etc.).
