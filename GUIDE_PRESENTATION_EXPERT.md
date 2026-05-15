# Guide de Présentation - Navigation et Flux Utilisateurs

## Pour un Débutant qui Doit Montrer sa Maîtrise

---

## Introduction

Ce document vous explique **comment naviguer entre les pages** de GMPP Suite, **comment les fonctionnalités sont reliées**, et vous donne les **clés pour répondre aux questions techniques** d'un expert. Même en tant que débutant, vous pourrez montrer que vous comprenez votre projet.

---

## Vue d'Ensemble - Architecture de Navigation

### Schéma Global de Navigation

```
                    ┌─────────────────┐
                    │     LOGIN       │
                    │  (Connexion)    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    DASHBOARD    │
                    │  (Accueil selon │
                    │    le rôle)     │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │   MACHINES   │ │INTERVENTIONS │ │  PLANNING    │
    │              │ │              │ │              │
    └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
           │                │                │
           ▼                ▼                ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │ MAINTENANCE  │ │ CONSOMM-     │ │   RAPPORTS   │
    │   POINTS     │ │   ABLES      │ │              │
    └──────────────┘ └──────────────┘ └──────────────┘
           │                │
           └────────────────┘
                  │
                  ▼
           ┌──────────────┐
           │   UTILISATEURS│
           │    (ADMIN)    │
           └───────────────┘
```

**À retenir pour l'expert:**
> "L'application suit une architecture en étoile avec le Dashboard comme hub central. Chaque module est accessible depuis la barre latérale, et les modules sont interdépendants - par exemple, une intervention ne peut pas exister sans machine ni technicien."

---

## Flux Utilisateur Détaillé par Rôle

### 1. ADMINISTRATEUR - Parcours Complet

#### Schéma du Parcours

```
Login → Dashboard → Utilisateurs → Création User
                                    ↓
                            Dashboard → Machines
                                        ↓
                              Création Machine
                                        ↓
                              Dashboard → Points de Maintenance
                                          ↓
                                Création Point
                                          ↓
                                Dashboard → Interventions
                                            ↓
                                  Création Intervention
                                            ↓
                                  Dashboard → Consommables
                                              ↓
                                    Gestion Stock
                                              ↓
                                    Dashboard → Rapports
```

#### Explication Détaillée (Ce que vous devez dire à l'expert)

**Étape 1: Connexion et Dashboard**
- Je me connecte avec le compte admin
- Le Dashboard m'affiche des KPIs globaux (nombre total de machines, interventions en cours, alertes)
- **Point technique:** Les données sont récupérées via l'API `/api/dashboard/stats` avec un token JWT

**Étape 2: Gestion des Utilisateurs (Fondamental)**
- Je vais dans le menu "Utilisateurs" (lien filtré par rôle)
- Je peux créer un nouveau technicien avec ses spécialités
- **Relation:** Sans utilisateur créé, je ne peux pas assigner de technicien aux interventions
- **Sécurité:** Seul l'ADMIN peut voir le bouton "Nouvel utilisateur" grâce à `@PreAuthorize("hasRole('ADMIN')")`

**Étape 3: Gestion des Machines**
- Je crée une machine (ex: "Presse Hydraulique PH-01")
- J'indique son type, localisation, heures de fonctionnement
- **Relation:** La machine est la base de tout - sans machine, pas de maintenance, pas d'intervention

**Étape 4: Points de Maintenance**
- Je crée un point de maintenance lié à cette machine
- Ex: "Graissage hebdomadaire du vérin principal"
- Je définis la fréquence (HEBDOMADAIRE) et le consommable nécessaire (Graisse hydraulique)
- **Intelligence:** Le système planifie automatiquement la prochaine date

**Étape 5: Interventions**
- Je crée une intervention à partir du point de maintenance
- J'assigne un technicien créé précédemment
- **Flux:** Point de Maintenance → Intervention → Assignation → Exécution → Validation

**Étape 6: Gestion des Consommables**
- Je vérifie que le graisse hydraulique est en stock
- Si stock bas, j'ajoute du stock
- **Lien:** Le technicien déduira le stock lors de l'intervention

**Question possible de l'expert:** *"Comment les modules communiquent entre eux ?"*
**Votre réponse:** *"Par des relations de clés étrangères en base de données et des appels API REST. Par exemple, une intervention a un `machine_id`, un `technician_id` et optionnellement un `point_maintenance_id`. Cela garantit l'intégrité référentielle."*

---

### 2. RESPONSABLE MAINTENANCE - Parcours Opérationnel

#### Schéma du Parcours

```
Login → Dashboard → Planning (Vue hebdo)
              ↓
      Création Intervention
              ↓
      Assignation Technicien
              ↓
      Suivi en temps réel
              ↓
      Validation Intervention
              ↓
      Gestion Stock/Rapports
```

#### Explication Détaillée

**Focus:** Planification et supervision

**Navigation Typique:**
1. Consulte le **Planning** pour voir la semaine
2. Crée une intervention urgente depuis le planning
3. Assigne un technicien disponible
4. Suit l'avancement dans la page **Interventions**
5. Valide l'intervention terminée
6. Génère un rapport PDF dans **Rapports**

**Point Technique à montrer:**
> "Le Responsable Maintenance a les mêmes permissions que l'ADMIN sur les opérations, mais ne peut pas créer de nouveaux utilisateurs. C'est géré par `hasAnyRole('ADMIN', 'RESPONSABLE_MAINTENANCE')` dans les contrôleurs."

---

### 3. CHEF D'ÉQUIPE - Parcours de Coordination

#### Schéma du Parcours

```
Login → Dashboard → Interventions
              ↓
      Création Intervention
              ↓
      Assignation à son équipe
              ↓
      Suivi des techniciens
              ↓
      Ajout heures machines
              ↓
      Déduction consommables
```

#### Explication Détaillée

**Focus:** Coordination terrain et logistique

**Navigation Typique:**
1. Voir les interventions à assigner
2. Créer une intervention corrective urgente
3. L'assigner à un technicien de son équipe
4. Ajouter les heures de fonctionnement d'une machine après usage intensif
5. Déduire les consommables utilisés par l'équipe

**Point clé à expliquer:**
> "Le Chef d'Équipe ne peut pas valider les interventions (contrairement au Responsable), mais il peut les créer et les assigner. C'est une séparation des prérogatives pour le contrôle qualité."

---

### 4. TECHNICIEN - Parcours d'Exécution

#### Schéma du Parcours (Le plus simple mais crucial)

```
Login → Dashboard Personnel
              ↓
      Voir "Mes Interventions"
              ↓
      Démarrer une tâche
              ↓
      Exécuter (avec pause possible)
              ↓
      Terminer avec rapport
              ↓
      Déduire consommables utilisés
```

#### Explication Détaillée

**Focus:** Exécution simple et efficace

**Navigation Typique:**
1. Dashboard personnalisé montrant **uniquement** ses interventions
2. Voir la liste filtrée (API: `/api/interventions` filtre automatiquement pour les techniciens)
3. Cliquer "Démarrer" → Status passe à EN_COURS
4. Option "Pause" si interruption
5. "Terminer" avec saisie du constat (NORMAL, ANOMALIE, etc.)
6. Déduire les consommables utilisés

**Point sécurité important:**
> "Le technicien ne voit que ses propres interventions grâce à un filtre côté backend qui vérifie le token JWT et compare l'ID du technicien connecté avec l'ID de l'intervention. C'est dans `InterventionController` avec la méthode `findAll()` qui applique un filtre si le rôle est TECHNICIEN."

---

## Relations Entre Pages et Fonctionnalités

### Matrice de Dépendance

| Page | Dépend de | Utilisé par | API Principale |
|------|-----------|-------------|----------------|
| **Utilisateurs** | - | Interventions (assignation), Rapports (stats) | `/api/users` |
| **Machines** | - | Points de Maintenance, Interventions | `/api/machines` |
| **Points Maintenance** | Machines | Interventions (création automatique) | `/api/maintenance-points` |
| **Interventions** | Machines, Users, Points Maint. | Planning, Dashboard | `/api/interventions` |
| **Planning** | Interventions | - | `/api/interventions/planning` |
| **Consommables** | - | Interventions (déduction), Points Maint. | `/api/consumables` |
| **Rapports** | Toutes les entités | - | `/api/reports/*` |

### Flux de Données Entre Pages

```
Création d'une Intervention Complète:

1. PAGE Utilisateurs ─┐
                      │ (sélection du technicien)
                      ▼
2. PAGE Machines ────→ 3. PAGE Interventions
                      │
                      │ (sélection de la machine)
                      ▼
4. PAGE Points Maint. (optionnel)
                      │
                      │ (pré-remplissage des infos)
                      ▼
5. PAGE Planning ─────→ Affichage de la nouvelle intervention
                      │
                      ▼
6. PAGE Dashboard ───→ Mise à jour des stats en temps réel
```

---

## Scénario Complet à Présenter à l'Expert

### Scénario: "Maintenance Préventive d'une Presse Hydraulique"

#### Étape 1: Préparation (ADMIN)

**Ce que vous montrez:**
1. "Je me connecte comme admin"
2. "Je crée un utilisateur 'Martin' avec rôle TECHNICIEN"
3. "Je crée la machine 'Presse PH-01'"
4. "Je crée un point de maintenance 'Graissage vérin' lié à cette machine"

**Point technique à dire:**
> "La création du point de maintenance insère une ligne dans la table `points_maintenance` avec une clé étrangère `machine_id` pointant vers la presse. C'est une relation Many-to-One : une machine peut avoir plusieurs points de maintenance."

#### Étape 2: Planification (RESPONSABLE MAINTENANCE)

**Ce que vous montrez:**
1. "Je me reconnecte comme responsable maintenance"
2. "Le système a automatiquement planifié une intervention basée sur la fréquence définie"
3. "Je vais dans Interventions et j'assigne Martin à cette tâche"

**Point technique:**
> "L'assignation met à jour le champ `technician_id` dans la table `interventions`. C'est une relation Many-to-One : un technicien peut avoir plusieurs interventions."

#### Étape 3: Exécution (TECHNICIEN)

**Ce que vous montrez:**
1. "Martin se connecte comme technicien"
2. "Il voit uniquement cette intervention dans son dashboard"
3. "Il clique 'Démarrer' - l'heure est enregistrée automatiquement"
4. "Il termine et signe son intervention"

**Point technique:**
> "Quand le technicien clique démarrer, le backend exécute `PATCH /api/interventions/{id}/start` qui met à jour le statut et la date d'exécution. Le calcul de la durée se fait automatiquement à la terminaison."

#### Étape 4: Validation (RESPONSABLE)

**Ce que vous montrez:**
1. "Le responsable voit l'intervention en statut 'TERMINEE'"
2. "Il clique 'Valider' pour clôturer officiellement"
3. "Le point de maintenance est automatiquement reprogrammé"

#### Étape 5: Suivi (Tous)

**Ce que vous montrez:**
1. "Le dashboard se met à jour avec les nouvelles statistiques"
2. "Les rapports peuvent être générés pour analyser la performance"

---

## Questions Techniques Fréquentes et Réponses

### Q1: "Comment gérez-vous la sécurité entre les pages ?"

**Votre réponse:**
> "La sécurité fonctionne à plusieurs niveaux:
> 1. **Authentification:** JWT token stocké dans localStorage après login, envoyé dans le header `Authorization` de chaque requête
> 2. **Autorisation côté backend:** Annotations `@PreAuthorize` sur les méthodes des contrôleurs
> 3. **Filtrage frontend:** La Sidebar filtre les liens de navigation selon le rôle de l'utilisateur connecté
> 4. **Vérification d'accès:** Par exemple, un technicien ne peut pas voir les interventions des autres car le backend filtre avec `if (user.getRole() == TECHNICIEN) { return interventions.forTechnician(user.getId()); }`"

### Q2: "Que se passe-t-il si je supprime une machine qui a des interventions ?"

**Votre réponse:**
> "La suppression est protégée par une contrainte de clé étrangère en base de données. Si une machine a des interventions liées, la suppression sera refusée pour préserver l'intégrité des données. L'ADMIN doit d'abord supprimer ou réassigner les interventions. On peut aussi configurer une suppression en cascade, mais ce n'est pas le cas ici pour des raisons d'audit."

### Q3: "Comment fonctionne le temps réel dans le Dashboard ?"

**Votre réponse:**
> "Le Dashboard n'est pas temps réel au sens WebSocket, mais il est actualisé:
> 1. Au chargement de la page via `useEffect` qui appelle l'API
> 2. Après chaque action importante (création, modification) via rechargement des données
> 3. On pourrait ajouter du polling (rafraîchissement toutes les 30s) ou du Server-Sent Events pour du vrai temps réel"

### Q4: "Expliquez le cycle de vie d'une intervention"

**Votre réponse avec le diagramme:**

```
PLANIFIEE
    │
    ▼ (technicien clique Démarrer)
EN_COURS
    │
    ├──────► EN_PAUSE (si interruption)
    │           │
    │           ▼ (reprendre)
    │       EN_COURS
    │           │
    ▼ (clique Terminer)
TERMINEE
    │
    ▼ (responsable valide)
VALIDEE
    │
    ▼ (archive automatique)
  [FIN]

OU

PLANIFIEE
    │
    ▼ (responsable annule)
ANNULEE
```

### Q5: "Pourquoi utilisez-vous React pour le frontend et pas juste des pages JSP ?"

**Votre réponse:**
> "React permet une expérience utilisateur fluide avec:
> 1. **SPA (Single Page Application):** Navigation sans rechargement complet
> 2. **Composants réutilisables:** Le même composant Modal utilisé partout
> 3. **État local et global:** Context API pour l'authentification, useState pour l'état local
> 4. **Déconnexion frontend/backend:** Le backend expose une API REST, le frontend consomme cette API. On pourrait changer le frontend en Angular ou Vue sans toucher au backend."

### Q6: "Comment Docker simplifie le déploiement ?"

**Votre réponse:**
> "Sans Docker, il faudrait:
> 1. Installer PostgreSQL sur le serveur
> 2. Configurer Java et Maven pour le backend
> 3. Installer Node.js pour le frontend
> 4. Configurer Nginx comme reverse proxy
> 5. Gérer les compatibilités de versions
>
> Avec Docker Compose, une seule commande `docker-compose up -d` lance:
> - PostgreSQL avec la bonne configuration
> - Le backend compilé et prêt
> - Le frontend servi par Nginx
> - Tout est isolé et reproductible"

---

## Astuces pour Impressionner l'Expert

### 1. Montrez que vous comprenez la séparation des responsabilités

> "Dans mon architecture, le frontend s'occupe de la présentation (React), le backend de la logique métier (Spring Boot), et la base de données de la persistance (PostgreSQL). C'est le pattern MVC moderne adapté aux applications web."

### 2. Expliquez le JWT simplement mais correctement

> "Le JWT (JSON Web Token) est comme une carte d'identité numérique. Quand je me connecte, le serveur me donne ce token signé. À chaque requête, je montre ce token. Le serveur vérifie la signature et sait qui je suis sans re-vérifier mon mot de passe."

### 3. Montrez l'intelligence métier

> "Mon application ne se contente pas de stocker des données. Elle calcule automatiquement les dates de prochaine maintenance basées sur les fréquences, alerte quand les stocks sont bas, et suit le temps d'exécution des interventions."

### 4. Parlez des améliorations possibles (montrez la vision)

> "Actuellement, l'application fonctionne bien en mode synchrone. Pour aller plus loin, j'ajouterais:
> - Des WebSockets pour les notifications temps réel
> - Du caching Redis pour améliorer les performances
> - Une application mobile React Native pour les techniciens sur le terrain"

### 5. Expliquez les choix techniques avec raison

**Pourquoi Spring Boot ?**
> "Parce qu'il offre une configuration rapide, une intégration native avec Spring Security pour l'authentification, et Spring Data JPA qui génère automatiquement les requêtes SQL."

**Pourquoi React et pas Angular ?**
> "React est plus léger et plus flexible. Avec Vite, le hot reload est instantané en développement. La courbe d'apprentissage est plus douce pour un projet académique."

**Pourquoi PostgreSQL ?**
> "C'est une base relationnelle robuste, open-source, qui supporte bien les relations complexes (Many-to-One, etc.) nécessaires pour ce type d'application ERP."

---

## Ce qu'il ne faut PAS dire (Erreurs courantes)

❌ **"Le frontend communique directement avec la base de données"**  
✅ **"Le frontend communique avec l'API REST qui elle communique avec la base"**

❌ **"La sécurité est gérée par React"**  
✅ **"La sécurité est gérée par Spring Security côté backend, React ne fait que cacher les boutons"

❌ **"Les données sont stockées dans le localStorage"**  
✅ **"Seul le token JWT est dans le localStorage, les données métier sont en PostgreSQL"

❌ **"Docker c'est une machine virtuelle"**  
✅ **"Docker utilise la conteneurisation qui partage le kernel de l'hôte, contrairement à une VM qui virtualise tout"

---

## Récapitulatif pour la Présentation

### Ordre de Présentation Recommandé

1. **Introduction (2 min)**
   - Présentation du projet GMPP Suite
   - Objectif: Gestion de maintenance préventive
   - Technologies: Spring Boot + React + PostgreSQL + Docker

2. **Architecture (3 min)**
   - Montrer le schéma de navigation
   - Expliquer la séparation frontend/backend
   - Montrer le diagramme de déploiement Docker

3. **Démonstration du Flux Principal (5 min)**
   - Créer un utilisateur
   - Créer une machine
   - Créer un point de maintenance
   - Créer et assigner une intervention
   - Exécuter comme technicien
   - Valider comme responsable

4. **Points Techniques Clés (3 min)**
   - Sécurité JWT + RBAC
   - Relations JPA (Many-to-One)
   - API REST documentée avec Swagger

5. **Qualité et Bonnes Pratiques (2 min)**
   - Tests (même s'il y en a peu)
   - Documentation
   - Docker pour la portabilité

6. **Questions/Réponses (5 min)**
   - Utiliser les réponses préparées ci-dessus

---

## Mot de la Fin

**Vous êtes un débutant, mais vous avez construit quelque chose de concret.** Ne cherchez pas à prétendre être un expert, mais montrez que vous:

1. **Comprenez ce que vous avez fait** (même si vous avez eu de l'aide)
2. **Savez expliquer simplement** des concepts techniques
3. **Avez une vision** de l'évolution du projet
4. **Respectez les bonnes pratiques** (sécurité, architecture, documentation)

**La phrase magique à dire à la fin:**
> "Ce projet m'a permis de comprendre l'importance d'une architecture bien pensée. Même si je suis débutant, j'ai pris soin de séparer les responsabilités, de sécuriser l'application avec JWT et RBAC, et de la conteneuriser avec Docker. Je suis conscient qu'il y a des améliorations possibles, notamment en termes de tests automatisés et de performance, mais la base est solide et évolutive."

---

**Bonne chance pour votre présentation !**
