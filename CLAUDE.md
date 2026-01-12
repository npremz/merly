# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AstroBoiler is an Astro 5 static site with Keystatic CMS for content management. It uses Markdoc for content with embedded components. React est requis par Keystatic CMS, mais pour les composants interactifs personnalisés, préférer Preact (plus léger, ~3KB vs ~40KB).

## Development Commands

```bash
npm run dev      # Start dev server at localhost:4321
npm run build    # Build production site to ./dist/
npm run preview  # Preview production build locally
```

## Architecture

**Integrations:**
- **React** - Requis par Keystatic CMS uniquement
- **Preact** - À utiliser pour les composants interactifs personnalisés (plus léger que React)
- **Markdoc** - Markdown content avec composants embarqués
- **Keystatic** - Local file-based CMS with admin UI at `/keystatic`
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

**Content System:**
- Keystatic stores content as local files (no cloud backend)
- Singletons : `siteSettings`, `navigation`, `footer`
- Collections : `posts`, `pages`, `testimonials`

**SEO Component (`src/components/SEO.astro`):**
- Centralized SEO meta tags for all pages
- Reads defaults from Keystatic `siteSettings` singleton
- Props override defaults per-page (title, description, ogImage, robots, etc.)
- Includes Open Graph, Twitter Cards, favicon links, and theme-color

**TypeScript:**
- Strict mode enabled via `astro/tsconfigs/strict`
- JSX configuré pour Preact/React dans les fichiers .astro

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

## Keystatic Configuration

**Setup :**
- `keystatic.config.ts` proprement structuré
- Collections définies (pages, posts, etc.)
- Singletons pour settings globaux (site info, navigation, footer)
- Slugs auto-générés et validés

**Champs types obligatoires :**
- Titre (text)
- Slug (slug)
- Description/excerpt (text, multiline)
- Body (markdoc avec composants custom)
- Featured image avec alt
- SEO overrides (title, description, noindex)
- Date de publication
- Auteur (relation ou select)

**Content components (blocks) disponibles :**
- CTA blocks
- Image avec caption
- Vidéo embed
- Citation/Testimonial
- FAQ accordion
- Galerie

## Key Directories

- `src/pages/` - File-based routing (each file becomes a route)
- `src/components/` - Reusable Astro/Preact components (SEO.astro, etc.)
- `src/content/posts/` - Keystatic posts collection
- `src/content/pages/` - Keystatic pages collection
- `src/content/settings/` - Keystatic singletons (site settings)
- `public/` - Static assets served at root
- `public/images/og/` - Open Graph images (1200x630px)
- `public/images/posts/` - Images à la une des articles
- `public/images/pages/` - Images à la une des pages
- `public/images/content/` - Images dans le contenu Markdoc
- `public/images/gallery/` - Images des galeries
- `public/images/testimonials/` - Avatars des témoignages
- `dist/` - Build output (gitignored)
