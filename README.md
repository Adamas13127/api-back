## Shop Admin API – Projet d’API REST complète

API NestJS déployée, consommée par un front React, avec authentification JWT, gestion des rôles et base PostgreSQL (NeonDB).

Projet réalisé dans le cadre du devoir **“Maîtrise d’une API REST”**, avec une architecture moderne et sécurisée :

- API NestJS versionnée `/api/v1`
- Authentification JWT + Refresh Token
- Rôles : `user` et `admin`
- Base de données PostgreSQL hébergée sur NeonDB
- Documentation Swagger
- Frontend React (Vite) déployé sur Vercel
- CORS restreint au frontend

---

## Déploiements

### Backend API (NestJS)

- Base URL API : `https://api-back-umber.vercel.app/api/v1`

### Swagger – Documentation API

- Documentation : `https://api-back-umber.vercel.app/api/docs`

### Frontend Admin (React – Vercel)

- URL : `https://api-front-k1nhgt6pj-semmaches-projects.vercel.app`

---

## Comptes de test

Un compte administrateur est déjà présent en base :

- Email : `admin1@test.com`
- Mot de passe : `Admin!123`
- Rôle : `admin`

---

## Architecture

Schéma simplifié :

```text
[ Frontend React (Vercel) ]
             |
             v  HTTP (JWT Bearer)
[ API NestJS (Vercel) ]
             |
             v
[ PostgreSQL – NeonDB ]
```

Principales technologies :

- Framework backend : NestJS
- ORM : TypeORM
- Base de données : PostgreSQL (NeonDB)
- Hash des mots de passe : bcrypt
- Tokens : JWT Access + Refresh

---

## Fonctionnalités principales

### Ressource Product

**Routes publiques :**

- `GET /api/v1/products`  
  Liste de tous les produits.

- `GET /api/v1/products/:id`  
  Détail d’un produit par son identifiant.

**Routes administrateur (JWT + rôle `admin`) :**

- `POST /api/v1/products`  
  Création d’un produit.

- `PATCH /api/v1/products/:id`  
  Mise à jour partielle d’un produit.

- `DELETE /api/v1/products/:id`  
  Suppression d’un produit.

---

## Authentification et sécurité

### Endpoints d’authentification

- `POST /api/v1/auth/register`  
  Inscription d’un utilisateur + génération du couple de tokens.

- `POST /api/v1/auth/login`  
  Connexion (retourne `accessToken`, `refreshToken`, `user`).

- `POST /api/v1/auth/refresh`  
  Renouvelle l’`accessToken` à partir d’un `refreshToken` valide.

- `GET /api/v1/auth/profile`  
  Retourne le profil de l’utilisateur courant.  
  Route protégée par `JwtAuthGuard` (JWT Bearer obligatoire).

### Durée de vie des tokens

- `accessToken` : 1 heure
- `refreshToken` : 7 jours

Le `refreshToken` est stocké en base de données dans la table `user` pour pouvoir être invalidé.

### Rôles et autorisation

- Rôles gérés : `user`, `admin`
- Décorateur `@Roles('admin')` + `RolesGuard` pour limiter certaines routes (produits) aux administrateurs.

---

## CORS et rate limiting

### CORS

Dans `main.ts`, CORS est configuré pour autoriser uniquement le frontend déployé sur Vercel :

```ts
app.enableCors({
  origin: ['https://api-front-k1nhgt6pj-semmaches-projects.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-app-version'],
  exposedHeaders: ['Content-Length', 'X-Knowledge-Base'],
});
```

### Rate limiting

Un rate limiting global est appliqué via `ThrottlerModule` dans `AppModule` :

- 10 requêtes maximum par IP sur une fenêtre de 10 secondes.

---

## Base de données et configuration

### Base de données

- Type : PostgreSQL
- Hébergeur : NeonDB (PostgreSQL cloud)
- Accès via TypeORM (configuration dynamique dans `AppModule` et fichier `src/config/typeorm.ts` pour les migrations CLI).

### Exemple de fichier `.env` (non versionné)

```env
# Application
PORT=3000

# Base de données (NeonDB)
DB_HOST=ep-long-firefly-agzi2x89-pooler.c-2.eu-central-1.aws.neon.tech
DB_PORT=5432
DB_USER=neondb_owner
DB_PASS=<mot_de_passe_neon>
DB_NAME=neondb

# JWT (à personnaliser)
JWT_SECRET=<chaine_secrete_pour_access_token>
JWT_REFRESH_SECRET=<chaine_secrete_pour_refresh_token>
```

Le fichier `.env` n’est pas commité dans le dépôt pour éviter toute fuite d’informations sensibles.

---

## Lancement en local

### Prérequis

- Node.js (version récente, 18+ recommandé)
- PostgreSQL accessible (local ou NeonDB)
- npm

### Installation

Depuis le dossier `api-back` :

```bash
npm install
```

### Démarrage

```bash
npm run start:dev
```

Par défaut :

- API : `http://localhost:3000/api/v1`
- Swagger : `http://localhost:3000/api/docs`

---

## Documentation Swagger

Swagger est entièrement configuré dans `main.ts` et exposé sur :

- `https://api-back-umber.vercel.app/api/docs` (prod)
- `http://localhost:3000/api/docs` (local)

Swagger permet notamment de :

- Visualiser tous les endpoints de l’API (`auth`, `products`, etc.).
- Voir les schémas des DTO (entrées/sorties).
- Tester les routes directement (login, refresh, CRUD produits).
- Utiliser le bouton “Authorize” pour ajouter le token Bearer et tester les routes protégées.

---

## Frontend (React – Vite – Vercel)

Le frontend d’administration se trouve dans le dossier `api-front` du projet et est déployé sur Vercel :

- URL : `https://api-front-k1nhgt6pj-semmaches-projects.vercel.app`

Principales caractéristiques :

- Formulaire de login avec email / mot de passe.
- Stockage de `accessToken`, `refreshToken` et `user` dans `localStorage`.
- Client Axios dédié (`src/api/client.ts`) qui :
  - Ajoute automatiquement `Authorization: Bearer <accessToken>` à chaque requête.
  - Intercepte les réponses `401` et appelle `/auth/refresh` si possible.
- Pages :
  - Connexion
  - Liste des produits (lecture publique)
  - Gestion produits (actions admin)
  - Profil utilisateur (lecture via `/auth/profile`)

---

## Résumé pour Vincent

- API REST complète et versionnée `/api/v1`.
- CRUD complet sur la ressource `Product`.
- Authentification JWT + Refresh Token, rôles `user` / `admin`.
- Base PostgreSQL cloud (NeonDB) via TypeORM.
- Déploiement réel backend + frontend.
- Documentation Swagger détaillée et accessible.
- Séparation claire des routes publiques et protégées.
- Mesures de sécurité : hash bcrypt, JWT, CORS restreint, rate limiting.

---

## Auteur

Projet scolaire réalisé par Semmache Yannis – 2025  
GitHub : `https://github.com/Adamas13127`
