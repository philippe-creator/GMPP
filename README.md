# GMPP Suite - Système de Gestion de Maintenance Préventive

## 📋 Table des Matières

- [Présentation](#présentation)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Installation](#installation)
- [Démarrage](#démarrage)
- [Rôles et Permissions](#rôles-et-permissions)
- [API Documentation](#api-documentation)
- [Structure du Projet](#structure-du-projet)
- [Développement](#développement)

---

## Présentation

**GMPP Suite** est une application ERP de gestion de maintenance préventive complète, conçue pour optimiser la gestion du parc machines, planifier les interventions, suivre les consommables et analyser les performances de maintenance.

L'application permet aux équipes de maintenance de:
- Gérer le parc de machines avec suivi des heures de fonctionnement
- Planifier et exécuter des interventions de maintenance préventive
- Assigner des techniciens aux tâches et suivre leur progression
- Gérer les stocks de consommables et alertes de réapprovisionnement
- Générer des rapports d'analyse et d'export de données
- Auditer toutes les actions dans le système

---

## Fonctionnalités

### 🏭 Gestion du Parc Machines

Le module de gestion des machines permet de maintenir un inventaire complet de tout le parc matériel de l'entreprise.

**Informations gérées:**
- **Nom de la machine**: Identification unique
- **Type**: HYDRAULIQUE, PNEUMATIQUE, USINAGE, MANUTENTION, ELECTRIQUE, AUTRE
- **Marque et Modèle**: Informations constructeur
- **Numéro de série**: Identification unique du constructeur
- **Année de fabrication**: Pour suivi de l'âge du parc
- **Date de mise en service**: Historique d'utilisation
- **Localisation**: Emplacement physique (atelier, ligne de production, salle des machines)
- **Statut**: EN_SERVICE, EN_PANNE, MAINTENANCE, HORS_SERVICE
- **Heures de fonctionnement**: Compteur cumulatif pour suivi de l'usure

**Opérations disponibles:**
- Créer une nouvelle machine (ADMIN, RESPONSABLE_MAINTENANCE)
- Modifier les informations d'une machine (ADMIN, RESPONSABLE_MAINTENANCE)
- Changer le statut (en service, en panne, maintenance) (ADMIN, RESPONSABLE_MAINTENANCE)
- Ajouter des heures de fonctionnement (ADMIN, RESPONSABLE_MAINTENANCE, CHEF_EQUIPE)
- Supprimer une machine (ADMIN uniquement)
- Filtrer par type, statut, localisation

### 🔧 Points de Maintenance

Les points de maintenance définissent les opérations préventives planifiées pour chaque machine.

**Types d'opérations:**
- **GRAISSAGE**: Lubrification des pièces mobiles
- **INSPECTION**: Vérification visuelle et fonctionnelle
- **NETTOYAGE**: Nettoyage des filtres et composants
- **CALIBRATION**: Ajustement des paramètres de précision
- **REMPLACEMENT**: Changement de pièces usées

**Fréquences de maintenance:**
- HEBDOMADAIRE: Opérations à réaliser chaque semaine
- MENSUELLE: Opérations mensuelles
- TRIMESTRIELLE: Opérations trimestrielles
- SEMESTRIELLE: Opérations semestrielles
- ANNUELLE: Opérations annuelles

**Informations par point de maintenance:**
- Machine associée
- Type d'opération
- Description détaillée
- Localisation précise sur la machine
- Consommable requis (type et quantité)
- Fréquence de répétition
- Date planifiée suivante
- Durée estimée (en minutes)
- Statut (à faire, en retard, exécuté)

**Alertes automatiques:**
- Points de maintenance en retard (date dépassée)
- Points à venir dans les 7 jours

### 📋 Gestion des Interventions

Les interventions sont les exécutions concrètes des opérations de maintenance.

**Cycle de vie d'une intervention:**

1. **PLANIFIEE**: Intervention créée et planifiée
   - Date et heure planifiées
   - Technicien assigné (optionnel)
   - Machine et point de maintenance associés
   - Observations préliminaires
   - Marquage d'urgence possible

2. **EN_COURS**: Intervention démarrée
   - Heure de début enregistrée automatiquement
   - Technicien en cours d'exécution

3. **EN_PAUSE**: Intervention temporairement suspendue
   - Permet de reprendre plus tard
   - Le temps de pause n'est pas comptabilisé

4. **TERMINEE**: Intervention complétée par le technicien
   - Heure de fin enregistrée
   - Durée réelle calculée automatiquement
   - Constat enregistré (NORMAL, USURE_DETECTEE, ANOMALIE_TROUVEE, REPARATION_REQUISE)
   - Observations détaillées
   - Rapport de correction
   - Signature du technicien

5. **VALIDEE**: Intervention approuvée par le superviseur
   - Validation par RESPONSABLE_MAINTENANCE ou ADMIN
   - Nom du validateur enregistré
   - Intervention définitivement clôturée

6. **EN_RETARD**: Intervention non commencée après la date planifiée
   - Alertes visuelles dans l'interface
   - Priorité augmentée

7. **ANNULEE**: Intervention supprimée
   - Par RESPONSABLE_MAINTENANCE ou ADMIN uniquement
   - Motif d'annulation recommandé

**Permissions par rôle:**
- **ADMIN**: Toutes les opérations
- **RESPONSABLE_MAINTENANCE**: Création, modification, validation, annulation
- **CHEF_EQUIPE**: Création, modification, assignation, démarrage, pause, terminaison
- **TECHNICIEN**: Démarrer, pause, terminer ses propres interventions assignées

### 👥 Gestion des Utilisateurs

Le système gère les comptes utilisateurs avec 4 rôles hiérarchiques.

**Rôles:**
- **ADMIN**: Accès total au système, gestion des utilisateurs
- **RESPONSABLE_MAINTENANCE**: Gestion des opérations de maintenance
- **CHEF_EQUIPE**: Supervision d'équipe et assignation des tâches
- **TECHNICIEN**: Exécution des tâches assignées

**Informations utilisateur:**
- Nom complet
- Email (identifiant de connexion)
- Mot de passe
- Code employé unique
- Rôle
- Spécialités (compétences techniques)
- Certifications (habilitations, formations)
- Téléphone
- Département
- Statut (actif/inactif)

**Opérations:**
- Créer un nouvel utilisateur (ADMIN uniquement)
- Modifier les informations (ADMIN uniquement)
- Activer/Désactiver un compte (ADMIN uniquement)
- Lister tous les utilisateurs (ADMIN, RESPONSABLE_MAINTENANCE, CHEF_EQUIPE)
- Filtrer par rôle
- Rechercher par nom ou email

### 📦 Gestion des Consommables

Le module consommables gère le stock de pièces, lubrifiants, filtres et autres fournitures nécessaires à la maintenance.

**Informations par consommable:**
- **Nom**: Désignation du produit
- **Référence**: Code unique fournisseur ou interne
- **Catégorie**: Lubrifiants, Filtres, Joints, Pièces mécaniques, Outillage, etc.
- **Unité**: kg, L, pièce, mètre, boîte, etc.
- **Stock actuel**: Quantité disponible en temps réel
- **Stock minimum**: Seuil d'alerte pour réapprovisionnement
- **Prix unitaire**: Coût par unité
- **Fournisseur**: Nom du fournisseur principal
- **Localisation**: Emplacement de stockage (rayon, étagère, zone)

**Alertes automatiques:**
- Liste des consommables en stock bas (stock actuel < stock minimum)
- Badge visuel rouge dans l'interface
- Priorité pour les commandes de réapprovisionnement

**Opérations sur le stock:**

1. **Ajout de stock** (ADMIN, RESPONSABLE_MAINTENANCE)
   - Réception d'une commande fournisseur
   - Entrée en stock après inventaire
   - Quantité ajoutée au stock actuel

2. **Déduction de stock** (tous les rôles)
   - Utilisation lors d'une intervention
   - Saisie manuelle de consommation
   - Quantité déduite du stock actuel
   - Historique conservé

3. **Création de consommable** (ADMIN, RESPONSABLE_MAINTENANCE)
   - Ajout d'un nouveau produit au catalogue
   - Définition des caractéristiques
   - Initialisation du stock

4. **Modification** (ADMIN, RESPONSABLE_MAINTENANCE)
   - Mise à jour des informations
   - Modification du stock minimum
   - Changement de fournisseur

5. **Suppression** (ADMIN uniquement)
   - Retrait du catalogue
   - Seulement si non utilisé

**Intégration avec les points de maintenance:**
- Chaque point de maintenance peut spécifier un consommable requis
- Type et quantité prédéfinis
- Facilite la planification des besoins

**Intégration avec les interventions:**
- Possibilité de déduire automatiquement les consommables utilisés
- Suivi de la consommation par intervention
- Analyse des coûts de maintenance

**Utilisation pratique:**
1. Consulter la liste des consommables
2. Identifier les stocks bas via l'alerte
3. Commander les fournitures nécessaires
4. Réceptionner et ajouter au stock
5. Les techniciens déduisent lors des interventions
6. Surveillance continue des niveaux

### 📊 Dashboard et Rapports
- Tableau de bord global avec KPIs
- Dashboard spécifique pour techniciens
- Graphiques de performance mensuelle
- Répartition des statuts d'interventions
- Performance par technicien
- Classement des machines par nombre d'interventions
- Exports PDF et CSV des rapports

### 🔐 Sécurité et Audit
- Authentification JWT
- Contrôle d'accès basé sur les rôles (RBAC)
- Journalisation de toutes les actions (Audit Log)
- Historique par entité

### 🔔 Notifications
- Système de notifications pour les utilisateurs
- Marquage lu/non lu
- Compteur de notifications non lues

### 📁 Gestion de Fichiers
- Upload de documents et photos
- Stockage sécurisé
- Téléchargement et affichage inline

---

## Guide d'Utilisation

### Comment utiliser GMPP Suite au quotidien

#### Pour un Administrateur (ADMIN)

**1. Gestion des utilisateurs**
- Connectez-vous avec admin@gmpp.local
- Allez dans "Utilisateurs"
- Cliquez sur "Nouvel utilisateur" pour créer un compte
- Remplissez: nom, email, mot de passe, code employé, rôle
- Définissez les spécialités et certifications
- Activez ou désactivez les comptes selon les besoins

**2. Supervision globale**
- Consultez le Dashboard pour voir les KPIs
- Vérifiez les interventions en retard
- Consultez les rapports et exports pour l'analyse
- Accédez aux logs d'audit pour tracer les actions

**3. Gestion du parc**
- Créez de nouvelles machines lors d'acquisitions
- Mettez à jour les informations techniques
- Changez le statut des machines en cas de panne
- Supprimez les machines hors service

#### Pour un Responsable Maintenance

**1. Planification des maintenances**
- Créez des points de maintenance pour chaque machine
- Définissez les opérations, fréquences et consommables requis
- Planifiez les dates de maintenance
- Surveillez les alertes de points en retard

**2. Gestion des interventions**
- Créez les interventions préventives
- Assignez les techniciens selon leurs spécialités
- Validez les interventions terminées
- Annulez les interventions non nécessaires
- Marquez les interventions urgentes

**3. Gestion des stocks**
- Consultez régulièrement les stocks bas
- Créez de nouveaux consommables au catalogue
- Ajoutez du stock après réception des commandes
- Modifiez les stocks minimum selon la consommation

**4. Analyse et rapports**
- Générez des rapports PDF/CSV
- Analysez la performance des techniciens
- Identifiez les machines problématiques
- Suivez les tendances de maintenance

#### Pour un Chef d'Équipe

**1. Assignation des tâches**
- Consultez le planning des interventions
- Créez des interventions pour les besoins immédiats
- Assignez les techniciens selon leurs disponibilités
- Modifiez les interventions si nécessaire

**2. Suivi de l'équipe**
- Consultez l'avancement des interventions
- Vérifiez les interventions en cours
- Ajoutez les heures de fonctionnement aux machines
- Déduisez les consommables utilisés

**3. Communication**
- Informez les techniciens des priorités
- Signalez les problèmes au responsable maintenance
- Coordonnez les interventions d'urgence

#### Pour un Technicien

**1. Consultation de ses tâches**
- Connectez-vous avec votre compte
- Voir vos interventions assignées
- Consultez les détails (machine, opération, consommables)

**2. Exécution des interventions**
- Cliquez sur "Démarrer" quand vous commencez
- Mettez en pause si nécessaire
- Cliquez sur "Terminer" quand vous avez fini
- Remplissez le rapport: observations, constat, correction
- Signez l'intervention

**3. Gestion des consommables**
- Consultez les consommables disponibles
- Déduisez les quantités utilisées
- Signalez les stocks bas

**4. Dashboard personnel**
- Consultez vos statistiques
- Voyez vos interventions à venir
- Suivez votre performance

### Flux de travail typique

**Flux pour une maintenance préventive:**

1. Le Responsable Maintenance crée un point de maintenance sur une machine
2. Le système planifie automatiquement la prochaine date
3. Une intervention est créée et assignée à un technicien
4. Le technicien reçoit la notification
5. Le jour J, le technicien démarre l'intervention
6. Il utilise les consommables nécessaires et les déduit du stock
7. Il termine l'intervention avec son rapport
8. Le Responsable Maintenance valide l'intervention
9. Le point de maintenance est reprogrammé pour la prochaine date

**Flux pour une maintenance corrective:**

1. Une machine tombe en panne
2. Le Chef d'Équipe crée une intervention urgente
3. Il assigne un technicien disponible
4. Le technicien démarre immédiatement
5. Il diagnostique et répare
6. Il signale si une anomalie a été trouvée
7. Il termine avec son rapport détaillé
8. Le Responsable valide et analyse les causes

---

## Architecture

L'application suit une architecture **microservices** avec:

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.x
- **Langage**: Java 17+
- **Base de données**: PostgreSQL 16
- **Sécurité**: Spring Security avec JWT
- **Documentation**: OpenAPI/Swagger

### Frontend (React)
- **Framework**: React 18
- **Routing**: React Router
- **HTTP Client**: Axios
- **UI Components**: Custom components avec Lucide Icons
- **Notifications**: React Toastify
- **Charts**: Recharts

### Infrastructure
- **Conteneurisation**: Docker & Docker Compose
- **Reverse Proxy**: Nginx (pour le frontend)
- **Volumes persistants**: PostgreSQL data et uploads

---

## Technologies

### Backend
- Java 17
- Spring Boot 3.x
- Spring Security (JWT Authentication)
- Spring Data JPA (Hibernate)
- PostgreSQL Driver
- Lombok
- OpenAPI/Swagger

### Frontend
- React 18
- Vite (build tool)
- React Router DOM
- Axios
- Lucide React (icons)
- React Toastify
- Recharts (charts)
- TailwindCSS (styling)

### DevOps
- Docker
- Docker Compose
- Nginx
- PostgreSQL 16 Alpine

---

## Installation

### Prérequis
- Docker Desktop installé et en cours d'exécution
- Git (optionnel, pour cloner le repository)

### Clonage du Repository
```bash
git clone <repository-url>
cd gmpp-suite
```

### Configuration

Le fichier `docker-compose.yml` contient déjà toute la configuration nécessaire:

- **PostgreSQL**: Port 5432, base `gmpp_db`
- **Backend**: Port 8080
- **Frontend**: Port 3000 (Nginx sur port 80)

Les variables d'environnement sont configurées dans `docker-compose.yml`:
- `SPRING_DATASOURCE_URL`: JDBC PostgreSQL
- `SPRING_DATASOURCE_USERNAME`: gmpp_user
- `SPRING_DATASOURCE_PASSWORD`: gmpp_pass
- `JWT_SECRET`: Clé de signature JWT
- `JWT_EXPIRATION`: 86400000 ms (24h)

---

## Démarrage

### Démarrage avec Docker Compose

```bash
# Démarrer tous les services
docker-compose up -d

# Vérifier les logs
docker-compose logs -f

# Arrêter les services
docker-compose down
```

### Accès à l'Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs**: http://localhost:8080/v3/api-docs

### Utilisateurs de Test (créés automatiquement)

| Rôle | Email | Mot de passe | Nom Complet |
|------|-------|--------------|-------------|
| ADMIN | admin@gmpp.local | Admin123! | Admin GMPP |
| RESPONSABLE_MAINTENANCE | manager@gmpp.local | Manager123! | Manager Maintenance |
| CHEF_EQUIPE | chef@gmpp.local | Chef123! | Chef Equipe A |
| TECHNICIEN | tech@gmpp.local | Tech123! | Technicien Atelier |
| TECHNICIEN | tech2@gmpp.local | Tech123! | Technicien Mecanique |

---

## Rôles et Permissions

### ADMIN (Administrateur)
Accès complet à toutes les fonctionnalités:
- Gestion complète des utilisateurs (CRUD, activation/désactivation)
- Gestion complète des machines (CRUD, statut, heures)
- Gestion complète des interventions (CRUD, validation, annulation)
- Gestion complète des points de maintenance (CRUD)
- Gestion complète des consommables (CRUD, stock)
- Accès aux rapports et exports
- Accès aux logs d'audit
- Création de nouveaux utilisateurs

### RESPONSABLE_MAINTENANCE (Responsable Maintenance)
Gestion étendue des opérations:
- Lecture des utilisateurs
- Gestion complète des machines (CRUD, statut)
- Gestion complète des interventions (CRUD, validation, annulation)
- Gestion complète des points de maintenance (CRUD)
- Gestion complète des consommables (CRUD, stock)
- Accès aux rapports et exports
- Accès aux logs d'audit

### CHEF_EQUIPE (Chef d'Équipe)
Supervision et assignation:
- Lecture des utilisateurs
- Lecture des machines
- Ajout d'heures de fonctionnement aux machines
- Création et modification d'interventions
- Assignation de techniciens
- Démarrage, pause, terminaison d'interventions
- Marquage des points de maintenance comme exécutés
- Déduction de consommables du stock
- **NON**: Validation d'interventions
- **NON**: Accès aux rapports
- **NON**: Accès à l'audit

### TECHNICIEN (Technicien)
Exécution des tâches assignées:
- Lecture des utilisateurs (limitée)
- Lecture seule des machines
- Exécution de ses propres interventions (démarrer, pause, terminer)
- Voir uniquement ses interventions assignées
- Marquage des points de maintenance comme exécutés
- Déduction de consommables du stock
- Dashboard technicien personnalisé
- **NON**: Création d'interventions
- **NON**: Modification de machines
- **NON**: Validation d'interventions
- **NON**: Accès aux rapports
- **NON**: Accès à l'audit

---

## API Documentation

### Endpoints Principaux

#### Authentication
```
POST   /api/auth/login          - Connexion
POST   /api/auth/register       - Création d'utilisateur (ADMIN uniquement)
```

#### Utilisateurs
```
GET    /api/users               - Lister tous les utilisateurs
GET    /api/users/{id}          - Voir un utilisateur
GET    /api/users/role/{role}   - Filtrer par rôle
GET    /api/users/technicians   - Lister les techniciens actifs
PUT    /api/users/{id}          - Modifier (ADMIN)
PATCH  /api/users/{id}/activate    - Activer (ADMIN)
PATCH  /api/users/{id}/deactivate  - Désactiver (ADMIN)
```

#### Machines
```
GET    /api/machines            - Lister toutes les machines
GET    /api/machines/{id}       - Voir une machine
POST   /api/machines            - Créer (ADMIN, RESPONSABLE_MAINTENANCE)
PUT    /api/machines/{id}       - Modifier (ADMIN, RESPONSABLE_MAINTENANCE)
PATCH  /api/machines/{id}/status  - Changer statut (ADMIN, RESPONSABLE_MAINTENANCE)
PATCH  /api/machines/{id}/hours   - Ajouter heures (ADMIN, RESPONSABLE_MAINTENANCE, CHEF_EQUIPE)
DELETE /api/machines/{id}       - Supprimer (ADMIN)
```

#### Interventions
```
GET    /api/interventions           - Lister (techniciens: seulement leurs interventions)
GET    /api/interventions/{id}      - Voir une intervention
GET    /api/interventions/machine/{id}  - Filtrer par machine
GET    /api/interventions/technician/{id} - Filtrer par technicien
GET    /api/interventions/planning  - Voir planning par date
POST   /api/interventions           - Créer (ADMIN, RESPONSABLE_MAINTENANCE, CHEF_EQUIPE)
PUT    /api/interventions/{id}      - Modifier (ADMIN, RESPONSABLE_MAINTENANCE, CHEF_EQUIPE)
PATCH  /api/interventions/{id}/assign   - Assigner technicien
PATCH  /api/interventions/{id}/start    - Démarrer (tous les rôles)
PATCH  /api/interventions/{id}/pause    - Mettre en pause (tous les rôles)
PATCH  /api/interventions/{id}/complete - Terminer (tous les rôles)
PATCH  /api/interventions/{id}/validate - Valider (ADMIN, RESPONSABLE_MAINTENANCE)
PATCH  /api/interventions/{id}/cancel   - Annuler (ADMIN, RESPONSABLE_MAINTENANCE)
DELETE /api/interventions/{id}      - Supprimer (ADMIN)
```

#### Points de Maintenance
```
GET    /api/maintenance-points      - Lister tous les points
GET    /api/maintenance-points/{id} - Voir un point
GET    /api/maintenance-points/machine/{id} - Filtrer par machine
GET    /api/maintenance-points/overdue   - Points en retard
GET    /api/maintenance-points/upcoming   - Points à venir
POST   /api/maintenance-points      - Créer (ADMIN, RESPONSABLE_MAINTENANCE)
PUT    /api/maintenance-points/{id} - Modifier (ADMIN, RESPONSABLE_MAINTENANCE)
PATCH  /api/maintenance-points/{id}/execute - Marquer exécuté
DELETE /api/maintenance-points/{id} - Supprimer (ADMIN, RESPONSABLE_MAINTENANCE)
```

#### Consommables
```
GET    /api/consumables            - Lister tous les consommables
GET    /api/consumables/low-stock  - Stocks bas
GET    /api/consumables/{id}       - Voir un consommable
POST   /api/consumables            - Créer (ADMIN, RESPONSABLE_MAINTENANCE)
PUT    /api/consumables/{id}       - Modifier (ADMIN, RESPONSABLE_MAINTENANCE)
PATCH  /api/consumables/{id}/deduct    - Déduire stock (tous les rôles)
PATCH  /api/consumables/{id}/add-stock  - Ajouter stock (ADMIN, RESPONSABLE_MAINTENANCE)
DELETE /api/consumables/{id}       - Supprimer (ADMIN)
```

#### Rapports
```
GET    /api/reports/interventions/pdf  - Export PDF (ADMIN, RESPONSABLE_MAINTENANCE)
GET    /api/reports/interventions/csv  - Export CSV (ADMIN, RESPONSABLE_MAINTENANCE)
GET    /api/reports/machines/pdf       - Export PDF (ADMIN, RESPONSABLE_MAINTENANCE)
GET    /api/reports/machines/csv       - Export CSV (ADMIN, RESPONSABLE_MAINTENANCE)
```

#### Audit
```
GET    /api/audit               - Logs récents (ADMIN, RESPONSABLE_MAINTENANCE)
GET    /api/audit/{type}/{id}   - Logs par entité (ADMIN, RESPONSABLE_MAINTENANCE)
```

#### Dashboard
```
GET    /api/dashboard/stats     - Statistiques globales
GET    /api/dashboard/technician - Stats technicien connecté
```

#### Alertes
```
GET    /api/alerts/upcoming-interventions - Interventions à venir (7 jours)
GET    /api/alerts/overdue-points         - Points de maintenance en retard
```

#### Notifications
```
GET    /api/notifications            - Mes notifications
GET    /api/notifications/unread-count - Compteur non lus
PATCH  /api/notifications/{id}/read   - Marquer comme lu
PATCH  /api/notifications/read-all    - Tout marquer comme lu
```

#### Fichiers
```
POST   /api/files/upload        - Uploader un fichier
GET    /api/files/download/{filename} - Télécharger un fichier
```

### Sécurité
Tous les endpoints (sauf `/api/auth/login`, `/api/health`, `/swagger-ui/**`, `/v3/api-docs/**`, `/uploads/**`) nécessitent un header:
```
Authorization: Bearer <jwt_token>
```

---

## Structure du Projet

```
gmpp-suite/
├── backend/
│   ├── src/main/java/com/gmpp/
│   │   ├── auth/                  # Authentication (login, register, JWT)
│   │   ├── audit/                 # Audit logging
│   │   ├── common/                # Utilitaires communs (exception handler, exports)
│   │   ├── config/                # Configuration (DataSeeder, OpenAPI)
│   │   ├── consumable/            # Gestion des consommables
│   │   ├── dashboard/             # Dashboard et statistiques
│   │   ├── file/                  # Gestion des fichiers
│   │   ├── health/                # Health check
│   │   ├── intervention/          # Gestion des interventions
│   │   ├── machine/               # Gestion des machines
│   │   ├── maintenance/           # Points de maintenance
│   │   ├── notification/          # Système de notifications
│   │   ├── report/                # Rapports et exports
│   │   ├── security/              # Sécurité (JWT filter, config)
│   │   └── user/                  # Gestion des utilisateurs
│   ├── src/main/resources/
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── api/                   # Services API (axios, endpoints)
│   │   ├── components/
│   │   │   ├── layout/            # Layout (Sidebar, TopBar)
│   │   │   └── ui/                # UI components (Modal, Cards, etc.)
│   │   ├── contexts/              # React Context (Auth)
│   │   ├── pages/                 # Pages de l'application
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── MachinesPage.jsx
│   │   │   ├── MaintenancePointsPage.jsx
│   │   │   ├── InterventionsPage.jsx
│   │   │   ├── PlanningPage.jsx
│   │   │   ├── UsersPage.jsx
│   │   │   ├── ConsumablesPage.jsx
│   │   │   ├── ReportsPage.jsx
│   │   │   └── TechnicianDashboard.jsx
│   │   ├── utils/                 # Utilitaires (helpers)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── index.html
│   └── package.json
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Développement

### Backend (Développement Local)

```bash
cd backend
mvn spring-boot:run
```

Le backend sera accessible sur http://localhost:8080

### Frontend (Développement Local)

```bash
cd frontend
npm install
npm run dev
```

Le frontend sera accessible sur http://localhost:5173 (Vite dev server)

### Base de Données Locale

Pour utiliser PostgreSQL local:
1. Installer PostgreSQL 16
2. Créer la base `gmpp_db`
3. Créer l'utilisateur `gmpp_user` avec mot de passe `gmpp_pass`
4. Modifier `application.properties` pour utiliser la connexion locale

### Build pour Production

```bash
# Backend
cd backend
mvn clean package

# Frontend
cd frontend
npm run build
```

### Tests

```bash
# Backend tests
cd backend
mvn test

# Frontend tests (si configurés)
cd frontend
npm test
```

---

## Données de Démo

L'application inclut un `DataSeeder` qui crée automatiquement:
- 5 utilisateurs (1 admin, 1 responsable, 1 chef, 2 techniciens)
- 4 machines avec différents types et statuts
- 4 points de maintenance avec différentes fréquences
- 5 interventions avec divers statuts
- 4 consommables avec différents niveaux de stock

Ces données sont créées uniquement si la base est vide (au premier démarrage).

---

## Support et Maintenance

### Logs
- Backend logs: `docker-compose logs backend`
- Frontend logs: `docker-compose logs frontend`
- PostgreSQL logs: `docker-compose logs postgres`

### Sauvegarde de la Base de Données
```bash
docker exec gmpp-postgres pg_dump -U gmpp_user gmpp_db > backup.sql
```

### Restauration
```bash
docker exec -i gmpp-postgres psql -U gmpp_user gmpp_db < backup.sql
```

### Nettoyage
```bash
# Arrêter et supprimer les conteneurs
docker-compose down

# Supprimer aussi les volumes (attention: perte de données)
docker-compose down -v
```

---

## Roadmap

### Fonctionnalités Futures
- [ ] Mobile application (React Native)
- [ ] Notifications email/SMS
- [ ] Intégration avec ERP externe
- [ ] Gestion des pièces de rechange
- [ ] Planning avancé avec Gantt
- [ ] Rapports personnalisables
- [ ] Multi-langues
- [ ] Dark/Light mode
- [ ] Export Excel en plus de PDF/CSV
- [ ] Intégration IoT pour monitoring machines en temps réel

---

## Licence

Ce projet est propriétaire. Tous droits réservés.

---

## Contact

Pour toute question ou support technique, veuillez contacter l'équipe de développement.

**Version**: 1.0.0  
**Dernière mise à jour**: Avril 2026
# GMPP 
