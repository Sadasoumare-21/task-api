# TaskFlow API — Documentation Backend & Guide Postman

Ce dépôt contient le backend NestJS de l'application **TaskFlow** (Gestionnaire de tâches sécurisé et widgets météo).

L'application utilise **TypeScript**, **NestJS**, et **TypeORM** pour communiquer avec une base de données **MySQL**. L'authentification est gérée par des jetons **JWT** et utilise le hachage de mot de passe avec **bcrypt**.

---

## 🚀 Démarrage Rapide (Backend)

### 1. Configuration de la base de données
Assure-toi que ton serveur MySQL est démarré et crée une base de données vide nommée :
```sql
CREATE DATABASE `task-db`;
```
*(Les paramètres de connexion par défaut sont définis dans [app.module.ts](file:///c:/Users/HP/Desktop/COURS/Les%20projets/ProjetDevFront-End/To-Do/backend%20task-api/src/app.module.ts) : hôte `localhost`, port `3306`, utilisateur `root`, sans mot de passe. Modifie-les dans ce fichier si nécessaire).*

### 2. Installation des dépendances
Positionne-toi dans le dossier du backend et installe les modules :
```bash
cd "backend task-api"
npm install
```

### 3. Lancer l'application en mode développement
```bash
npm run start:dev
```
L'API sera disponible sur : **`http://localhost:3000`**  
La documentation interactive Swagger est accessible sur : **`http://localhost:3000/api/docs`** (si Swagger est activé).

---

## 🔒 Concepts de Sécurité implémentés

1. **Identification par Email unique** : Pas de champ `name` en base de données. L'authentification et l'inscription s'effectuent uniquement à l'aide de l'e-mail et du mot de passe.
2. **Hachage Fort** : Les mots de passe sont salés et hachés via `bcrypt` avant stockage.
3. **Protection des routes (JWT Guard)** : Un garde d'authentification (`JwtAuthGuard`) extrait et valide le jeton JWT envoyé dans l'en-tête HTTP `Authorization: Bearer <token>`.
4. **Contrôle d'accès strict (Anti-BOLA/IDOR)** : Lors des opérations d'écriture ou de lecture sur une tâche, le backend utilise l'identifiant extrait du jeton JWT (`req.user.id`). Un utilisateur connecté ne peut **JAMAIS** lire, modifier ou supprimer la tâche d'un autre utilisateur.

---

## 📬 Collection de Routes pour Test Postman

Pour tester les routes protégées sur Postman, tu dois d'abord effectuer une requête de connexion/inscription, copier la valeur d' `access_token` retournée, puis l'ajouter dans l'onglet **Authorization** de tes requêtes (choisir le type **Bearer Token**).

### 1. Authentification (Auth)

#### 🔹 Inscription (Register)
*   **Méthode** : `POST`
*   **URL** : `http://localhost:3000/auth/register`
*   **Headers** : `Content-Type: application/json`
*   **Body (JSON)** :
    ```json
    {
      "email": "test@example.com",
      "password": "MonSuperMotDePasse123"
    }
    ```

#### 🔹 Connexion (Login)
*   **Méthode** : `POST`
*   **URL** : `http://localhost:3000/auth/login`
*   **Headers** : `Content-Type: application/json`
*   **Body (JSON)** :
    ```json
    {
      "email": "test@example.com",
      "password": "MonSuperMotDePasse123"
    }
    ```
*   **Réponse attendue** :
    ```json
    {
      "access_token": "eyJhbGciOi...",
      "user": {
        "id": 1,
        "email": "test@example.com",
        "role": "USER"
      }
    }
    ```

---

### 2. Gestion des Tâches (Tasks)
⚠️ *Toutes ces routes requièrent l'en-tête `Authorization: Bearer <JWT_TOKEN>`.*

#### 🔹 Récupérer ses tâches (Find All)
Retourne uniquement les tâches appartenant à l'utilisateur connecté.
*   **Méthode** : `GET`
*   **URL** : `http://localhost:3000/tasks`

#### 🔹 Créer une tâche (Create)
*   **Méthode** : `POST`
*   **URL** : `http://localhost:3000/tasks`
*   **Headers** : `Content-Type: application/json`
*   **Body (JSON)** :
    ```json
    {
      "title": "Acheter du pain",
      "description": "Prendre une baguette bien cuite",
      "categoryId": 1
    }
    ```
    *(Le champ `categoryId` est optionnel. S'il est fourni, la tâche est automatiquement liée à la catégorie).*

#### 🔹 Récupérer une tâche spécifique (Find One)
Vérifie que la tâche demandée appartient bien à l'utilisateur connecté.
*   **Méthode** : `GET`
*   **URL** : `http://localhost:3000/tasks/:id` *(remplacer :id par l'ID numérique de la tâche, ex: 15)*

#### 🔹 Modifier une tâche (Update)
Vérifie la propriété de la tâche avant modification.
*   **Méthode** : `PATCH`
*   **URL** : `http://localhost:3000/tasks/:id`
*   **Headers** : `Content-Type: application/json`
*   **Body (JSON)** :
    ```json
    {
      "title": "Acheter du pain complet",
      "status": "COMPLETED",
      "categoryId": 2
    }
    ```
    *(Tous les champs du DTO sont optionnels. Le statut accepte `PENDING` ou `COMPLETED`)*

#### 🔹 Supprimer une tâche (Delete)
Vérifie la propriété de la tâche avant suppression.
*   **Méthode** : `DELETE`
*   **URL** : `http://localhost:3000/tasks/:id`

---

### 3. Gestion des Catégories (Categories)

#### 🔹 Récupérer toutes les catégories
*   **Méthode** : `GET`
*   **URL** : `http://localhost:3000/categories`

#### 🔹 Créer une catégorie
*   **Méthode** : `POST`
*   **URL** : `http://localhost:3000/categories`
*   **Headers** : `Content-Type: application/json`
*   **Body (JSON)** :
    ```json
    {
      "name": "Travail"
    }
    ```

#### 🔹 Récupérer une catégorie par son ID (avec ses tâches)
*   **Méthode** : `GET`
*   **URL** : `http://localhost:3000/categories/:id`

#### 🔹 Supprimer une catégorie
⚠️ *Requiert le jeton d'un utilisateur possédant le rôle `ADMIN`*.
*   **Méthode** : `DELETE`
*   **URL** : `http://localhost:3000/categories/:id`

---

### 4. Météo (Weather)
⚠️ *Ces routes requièrent l'en-tête `Authorization: Bearer <JWT_TOKEN>`.*

#### 🔹 Météo actuelle pour une ville
*   **Méthode** : `GET`
*   **URL** : `http://localhost:3000/weather?city=Dakar`

#### 🔹 Prévisions météo sur 5 jours pour une ville
*   **Méthode** : `GET`
*   **URL** : `http://localhost:3000/weather/forecast?city=Dakar`

#### 🔹 Météo historique simplifiée (Dakar uniquement)
*   **Méthode** : `GET`
*   **URL** : `http://localhost:3000/weather/dakar`