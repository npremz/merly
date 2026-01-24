# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Merly is an Astro 5 static site for an investment fund. Pour les composants interactifs personnalisés, préférer Preact (plus léger, ~3KB vs ~40KB).

## Development Commands

```bash
npm run dev      # Start dev server at localhost:5103
npm run build    # Build production site to ./dist/
npm run preview  # Preview production build locally
```

## Architecture

**Integrations:**
- **Preact** - À utiliser pour les composants interactifs personnalisés (léger)
- **Sitemap** - Auto-generated at `/sitemap-index.xml` on build

**SEO Technique:**
- `robots.txt` dynamique (`src/pages/robots.txt.ts`) - utilise `site` de astro.config.mjs
- Sitemap auto-généré par `@astrojs/sitemap`
- URL du site à configurer dans `astro.config.mjs` (propriété `site`)

**Performance (astro.config.mjs) :**
- `prefetch: true` - Préchargement des liens au hover
- `compressHTML: true` - Compression HTML en production
- ViewTransitions : ajouter `<ViewTransitions />` dans le `<head>` des layouts

```astro
---
import { ViewTransitions } from 'astro:transitions';
---
<head>
  <ViewTransitions />
</head>
```

**TypeScript:**
- Strict mode enabled via `astro/tsconfigs/strict`

## Optimisation Images

Utiliser `<Image />` d'Astro pour l'optimisation automatique :

```astro
---
import { Image } from 'astro:assets';
import monImage from '../assets/image.jpg';
---
<Image src={monImage} alt="Description" />
```

**Règles obligatoires :**
- Formats modernes : WebP/AVIF avec fallback (géré auto par Astro)
- Attributs `width` et `height` explicites (évite CLS)
- `decoding="async"` sur toutes les images

**Images above the fold (LCP) :**
- `loading="eager"` + `fetchpriority="high"`
- Précharger dans `<head>` : `<link rel="preload" as="image" href="..." />`

**Images below the fold :**
- `loading="lazy"`

**Images responsives :**
- Utiliser l'attribut `sizes` pour définir les tailles selon viewport

## Performance CSS & Fonts

**CSS :**
- CSS critique inliné automatiquement (géré par Astro)
- Pas de CSS inutilisé (audit régulier)
- Variables CSS pour theming
- `@media (prefers-reduced-motion)` respecté
- `@media (prefers-color-scheme)` si dark mode

**Fonts :**
- Fonts hébergées localement (pas Google Fonts CDN)
- Format `.woff2` uniquement
- `font-display: swap` (ou `optional`)
- Preload des fonts critiques :
  ```html
  <link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
  ```
- Subset des fonts (uniquement caractères utilisés)
- Fallback font stack bien défini (évite FOUT)
- Limiter à 2-3 fonts maximum
- `size-adjust` pour réduire le CLS

## Optimisation JS

- Minimum de JS côté client (Astro Islands)
- `client:visible` / `client:idle` pour composants interactifs
- Pas de frameworks lourds inutiles
- `defer` sur scripts non-critiques
- Third-party scripts chargés après interaction (Partytown optionnel)

```astro
<!-- Composant hydraté quand visible -->
<MonComposant client:visible />

<!-- Composant hydraté quand le navigateur est idle -->
<MonComposant client:idle />
```

## Core Web Vitals

**LCP (Largest Contentful Paint < 2.5s) :**
- Preload de l'image LCP
- Image LCP optimisée et dimensionnée
- Pas de lazy loading sur LCP (`loading="eager"`)
- Server-side rendering ou static

**FID/INP (Interaction to Next Paint < 200ms) :**
- Minimal JS blocking
- Event handlers optimisés
- Pas de long tasks (>50ms)

**CLS (Cumulative Layout Shift < 0.1) :**
- Dimensions explicites sur images/videos/iframes
- Fonts avec fallback et `size-adjust`
- Pas d'injection de contenu au-dessus du fold
- Skeleton loaders si contenu dynamique

## Accessibilité (a11y)

**Fondamentaux :**
- Contraste suffisant (WCAG AA minimum : 4.5:1)
- Focus visible sur tous les éléments interactifs
- `:focus-visible` pour focus clavier uniquement
- Taille de tap minimum 44x44px sur mobile
- Textes lisibles (16px minimum pour body)

**Navigation :**
- Skip to main content link
- Navigation au clavier complète
- `aria-current="page"` sur lien actif
- Menu mobile accessible (focus trap, escape to close)

**Formulaires :**
- `<label>` associé à chaque input
- Messages d'erreur explicites et liés (`aria-describedby`)
- `autocomplete` sur champs appropriés
- États visuels clairs (focus, error, success)

**Médias :**
- `alt` descriptif sur toutes les images (vide si décoratif)
- Sous-titres sur vidéos
- Contrôles accessibles sur lecteurs média

**ARIA (avec parcimonie) :**
- `aria-label` où le texte visible manque
- `aria-expanded` sur toggles
- `aria-hidden="true"` sur icônes décoratives
- Roles landmarks appropriés

## Key Directories

- `src/pages/` - File-based routing (each file becomes a route)
- `src/components/` - Reusable Astro/Preact components
- `src/layouts/` - Page layouts
- `src/assets/` - Images and fonts (processed by Astro)
- `public/` - Static assets served at root
- `dist/` - Build output (gitignored)
