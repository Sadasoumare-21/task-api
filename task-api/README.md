1. L'Authentification JWT et l'Autorisation (RBAC) 🔴 Priorité Absolue
C'est le gros morceau obligatoire pour sécuriser ton API.

Créer un module Auth indépendant.

Installer bcrypt pour hacher les mots de passe lors de l'inscription et les comparer lors de la connexion (/auth/login).

Installer @nestjs/jwt et passport-jwt pour générer un jeton sécurisé.

Créer les Guards :

JwtAuthGuard : Bloque les utilisateurs non connectés et extrait l'utilisateur du token pour l'injecter dans la requête (ce qui te permettra de l'associer automatiquement à ses tâches sans passer l'ID en dur dans le body).

RolesGuard : Vérifie si l'utilisateur possède le rôle requis (ADMIN ou USER) pour accéder à certaines routes (ex: seul un Admin peut supprimer une catégorie).





2. Consommer une API Externe 🟠 Obligatoire
Le sujet demande d'intégrer au moins une API externe gratuite.

Ce qu'il faut faire : Installer @nestjs/axios et créer un petit module (par exemple WeatherModule) qui appelle une API comme Open Weather.

Lien avec ton projet : Tu peux exposer un endpoint /weather que ton frontend appellera pour afficher la météo locale directement sur le tableau de bord de gestion des tâches.




3. Connexion et Intégration avec ton Frontend 🟢 Crucial pour la démo
Activer le CORS dans ton fichier main.ts backend (app.enableCors()) pour permettre à ton application Frontend (React/Tailwind) de communiquer avec ton API NestJS sans blocage de sécurité.

Remplacer tes appels d'API fictifs (ou ton stockage local) du Frontend par de vraies requêtes HTTP (fetch ou axios) pointant vers ton backend NestJS.




4. Git Flow, Documentation et Rigueur 🔵 Pour maximiser les points
Swagger (OpenAPI) : Documenter tes endpoints en ajoutant le module Swagger dans main.ts pour générer une page de test automatique. M. SOUMARE appréciera grandement cette rigueur professionnelle.

Git Flow : Assure-toi d'avoir bien publié ton code sur un dépôt GitHub public, avec un historique de commits clairs.




5. Les Bonus (Points supplémentaires) ⚡ Think Outside the Box!
Si tu veux aller plus loin et impressionner le jury lors de la présentation en présentiel, tu peux choisir un ou deux bonus accessibles :

Dockerisation : Créer un fichier Dockerfile et un docker-compose.yml pour lancer ton API et ta base de données d'un seul coup.

Déploiement Cloud : Mettre ton API en ligne sur un serveur gratuit (Render, Railway) pour faire ta démonstration directement sur le web.