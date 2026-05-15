# GMPP Suite - Documentation Technique Complète

## Table des Matières

1. [Introduction](#introduction)
2. [Architecture Globale](#architecture-globale)
3. [Diagramme de Cas d'Utilisation](#diagramme-de-cas-dutilisation)
4. [Diagramme de Classes](#diagramme-de-classes)
5. [Diagrammes de Séquence](#diagrammes-de-séquence)
6. [Backend - Entités JPA et Relations](#backend---entités-jpa-et-relations)
7. [Backend - API REST et Contrôleurs](#backend---api-rest-et-contrôleurs)
8. [Backend - Sécurité JWT et Gestion des Rôles](#backend---sécurité-jwt-et-gestion-des-rôles)
9. [Backend - Documentation Swagger/OpenAPI](#backend---documentation-swaggeropenapi)
10. [Frontend - Interface React et Composants](#frontend---interface-react-et-composants)
11. [Frontend - Calendrier, Planning et Tableau de Bord](#frontend---calendrier-planning-et-tableau-de-bord)
12. [Conteneurisation - Docker et Docker Compose](#conteneurisation---docker-et-docker-compose)
13. [Qualité du Code et Bonnes Pratiques](#qualité-du-code-et-bonnes-pratiques)
14. [Conclusion](#conclusion)

---

## Introduction

**GMPP Suite** (Gestion de Maintenance Préventive et Prévisionnelle) est une application ERP moderne développée pour optimiser la gestion de la maintenance industrielle. Elle permet aux entreprises de:

- Gérer efficacement leur parc de machines
- Planifier et suivre les interventions de maintenance
- Gérer les stocks de consommables
- Assigner et superviser les techniciens
- Analyser les performances et générer des rapports

### Technologies Utilisées

**Backend:**
- Java 17
- Spring Boot 3.x
- Spring Data JPA (Hibernate)
- Spring Security (JWT)
- PostgreSQL 16
- OpenAPI/Swagger

**Frontend:**
- React 18
- Vite
- React Router
- Axios
- TailwindCSS
- Recharts

**Infrastructure:**
- Docker
- Docker Compose
- Nginx

---

## Architecture Globale

### Architecture en Couches

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │Dashboard │ │ Machines │ │Intervent.│ │Consom.   │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└─────────────────────────────────────────────────────────┘
                            │ HTTP/REST (JSON)
                            │ JWT Authentication
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Backend (Spring Boot)                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │           Controllers (REST API)                 │   │
│  │  AuthController | UserController | Machine...   │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Services Layer                      │   │
│  │  AuthService | UserService | MachineService...   │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Repositories (JPA)                  │   │
│  │  UserRepository | MachineRepository | ...       │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                            │ JDBC
                            ▼
┌─────────────────────────────────────────────────────────┐
│              PostgreSQL Database                         │
│  utilisateurs | machines | interventions | ...         │
└─────────────────────────────────────────────────────────┘
```

### Flux de Données

1. **Authentification**: Frontend → AuthController → JWT Token
2. **Requêtes API**: Frontend (avec JWT) → Controller → Service → Repository → Database
3. **Réponse**: Database → Repository → Service → Controller → Frontend (JSON)

---

## Diagramme de Cas d'Utilisation

### Acteurs du Système

```
┌──────────────┐
│   ADMIN      │
└──────────────┘
       │
       ▼
┌──────────────┐
│ RESPONSABLE  │
│ MAINTENANCE  │
└──────────────┘
       │
       ▼
┌──────────────┐
│  CHEF_EQUIPE │
└──────────────┘
       │
       ▼
┌──────────────┐
│  TECHNICIEN  │
└──────────────┘
```

### Cas d'Utilisation par Acteur

#### ADMIN (Administrateur)
```
┌─────────────────────────────────────────────┐
│                  ADMIN                      │
└─────────────────────────────────────────────┘
                    │
    ┌───────────────┼───────────────┐
    ▼               ▼               ▼
┌─────────┐   ┌─────────┐   ┌─────────┐
│ Gérer   │   │ Gérer   │   │ Voir    │
│Utilisat.│   │ Machines│   │ Rapports│
└─────────┘   └─────────┘   └─────────┘
    │               │               │
    ▼               ▼               ▼
- Créer user    - Créer machine  - Export PDF
- Modifier user  - Modifier mach   - Export CSV
- Activer/désact - Supprimer mach  - Voir audit
```

#### RESPONSABLE_MAINTENANCE
```
┌─────────────────────────────────────────────┐
│         RESPONSABLE_MAINTENANCE              │
└─────────────────────────────────────────────┘
                    │
    ┌───────────────┼───────────────┐
    ▼               ▼               ▼
┌─────────┐   ┌─────────┐   ┌─────────┐
│ Planifier│   │ Valider │   │ Gérer   │
│Mainten.  │   │ Interv. │   │ Stocks  │
└─────────┘   └─────────┘   └─────────┘
    │               │               │
    ▼               ▼               ▼
- Créer points  - Valider term.  - Ajout stock
- Créer interv. - Annuler        - Créer cons.
- Assigner tech                  - Modifier stock
```

#### CHEF_EQUIPE
```
┌─────────────────────────────────────────────┐
│              CHEF_EQUIPE                      │
└─────────────────────────────────────────────┘
                    │
    ┌───────────────┼───────────────┐
    ▼               ▼               ▼
┌─────────┐   ┌─────────┐   ┌─────────┐
│ Assigner│   │ Suivre  │   │ Ajouter │
│ Interv. │   │ Équipe  │   │ Heures  │
└─────────┘   └─────────┘   └─────────┘
    │               │               │
    ▼               ▼               ▼
- Créer interv.  - Voir progress  - Ajouter h
- Assigner tech  - Coordonner     - Déduire stock
- Modifier plan  - Communiquer
```

#### TECHNICIEN
```
┌─────────────────────────────────────────────┐
│              TECHNICIEN                      │
└─────────────────────────────────────────────┘
                    │
    ┌───────────────┼───────────────┐
    ▼               ▼               ▼
┌─────────┐   ┌─────────┐   ┌─────────┐
│Exécuter │   │ Voir    │   │Gérer    │
│Interv.  │   │ Tâches  │   │Consom.  │
└─────────┘   └─────────┘   └─────────┘
    │               │               │
    ▼               ▼               ▼
- Démarrer      - Voir mes       - Consulter
- Pause         - Interventions  - Déduire
- Terminer      - Dashboard      - Signaler
```

---

## Diagramme de Classes

### Entités Principales

```
┌─────────────────────────────────────────────────────────┐
│                      AppUser                            │
├─────────────────────────────────────────────────────────┤
│ - id: Long                                               │
│ - fullName: String                                       │
│ - email: String (unique)                                 │
│ - password: String                                       │
│ - employeeCode: String (unique)                          │
│ - role: Role (ENUM)                                      │
│ - specialties: String                                    │
│ - certifications: String                                 │
│ - active: Boolean                                        │
│ - lastLogin: LocalDateTime                                │
├─────────────────────────────────────────────────────────┤
│ + getAuthorities(): Collection<GrantedAuthority>        │
│ + getUsername(): String                                  │
│ + isAccountNonLocked(): Boolean                          │
└─────────────────────────────────────────────────────────┘
                            │
                            │ 1
                            │
                            │ *
┌─────────────────────────────────────────────────────────┐
│                      Machine                            │
├─────────────────────────────────────────────────────────┤
│ - id: Long                                               │
│ - name: String                                           │
│ - machineType: String                                    │
│ - brand: String                                          │
│ - model: String                                          │
│ - serialNumber: String (unique)                          │
│ - manufacturingYear: Integer                             │
│ - commissioningDate: LocalDate                           │
│ - location: String                                       │
│ - status: MachineStatus (ENUM)                           │
│ - operatingHours: Long                                   │
│ - createdAt: LocalDateTime                               │
│ - updatedAt: LocalDateTime                               │
├─────────────────────────────────────────────────────────┤
│ + onUpdate(): void (@PreUpdate)                          │
└─────────────────────────────────────────────────────────┘
                            │
                            │ 1
                            │
                            │ *
┌─────────────────────────────────────────────────────────┐
│                MaintenancePoint                          │
├─────────────────────────────────────────────────────────┤
│ - id: Long                                               │
│ - machine: Machine (ManyToOne)                           │
│ - operationType: OperationType (ENUM)                    │
│ - description: String                                    │
│ - preciseLocation: String                                │
│ - consumableType: String                                 │
│ - quantityRequired: Double                               │
│ - quantityUnit: String                                   │
│ - frequency: MaintenanceFrequency (ENUM)                 │
│ - counterThreshold: Integer                              │
│ - nextPlannedDate: LocalDate                             │
│ - lastExecutedDate: LocalDate                            │
│ - active: Boolean                                        │
│ - estimatedDurationMinutes: Integer                      │
│ - instructions: String                                   │
│ - createdAt: LocalDateTime                               │
└─────────────────────────────────────────────────────────┘
                            │
                            │ 1
                            │
                            │ *
┌─────────────────────────────────────────────────────────┐
│                  Intervention                            │
├─────────────────────────────────────────────────────────┤
│ - id: Long                                               │
│ - machine: Machine (ManyToOne)                           │
│ - maintenancePoint: MaintenancePoint (ManyToOne)         │
│ - technician: AppUser (ManyToOne)                        │
│ - assignedBy: AppUser (ManyToOne)                        │
│ - plannedAt: LocalDateTime                               │
│ - executedAt: LocalDateTime                              │
│ - completedAt: LocalDateTime                              │
│ - validatedAt: LocalDateTime                              │
│ - durationMinutes: Integer                               │
│ - status: InterventionStatus (ENUM)                      │
│ - findingStatus: FindingStatus (ENUM)                    │
│ - observations: String                                   │
│ - etatConstate: String                                   │
│ - documentsJoints: List<String>                          │
│ - technicianSignature: String                            │
│ - supervisorValidation: String                           │
│ - correctionReport: String                               │
│ - urgent: Boolean                                        │
│ - createdAt: LocalDateTime                               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  Consumable                              │
├─────────────────────────────────────────────────────────┤
│ - id: Long                                               │
│ - name: String                                           │
│ - reference: String                                      │
│ - category: String                                       │
│ - unit: String                                           │
│ - currentStock: Double                                   │
│ - minimumStock: Double                                   │
│ - unitPrice: Double                                      │
│ - supplier: String                                       │
│ - location: String                                       │
│ - createdAt: LocalDateTime                               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   AuditLog                               │
├─────────────────────────────────────────────────────────┤
│ - id: Long                                               │
│ - entityType: String                                     │
│ - entityId: Long                                         │
│ - action: String                                         │
│ - userId: Long                                           │
│ - username: String                                       │
│ - timestamp: LocalDateTime                               │
│ - details: String                                        │
└─────────────────────────────────────────────────────────┘
```

### Enums

```
Role
├── ADMIN
├── RESPONSABLE_MAINTENANCE
├── CHEF_EQUIPE
└── TECHNICIEN

MachineStatus
├── EN_SERVICE
├── EN_PANNE
├── MAINTENANCE
└── HORS_SERVICE

OperationType
├── GRAISSAGE
├── INSPECTION
├── NETTOYAGE
├── CALIBRATION
└── REMPLACEMENT

MaintenanceFrequency
├── HEBDOMADAIRE
├── MENSUELLE
├── TRIMESTRIELLE
├── SEMESTRIELLE
└── ANNUELLE

InterventionStatus
├── PLANIFIEE
├── EN_COURS
├── EN_PAUSE
├── TERMINEE
├── VALIDEE
├── EN_RETARD
└── ANNULEE

FindingStatus
├── NORMAL
├── USURE_DETECTEE
├── ANOMALIE_TROUVEE
└── REPARATION_REQUISE
```

---

## Diagrammes de Séquence

### Séquence 1: Authentification

```
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│ Frontend │      │AuthContr │      │AuthService│      │  Database│
└────┬─────┘      └────┬─────┘      └────┬─────┘      └────┬─────┘
     │                  │                  │                  │
     │ POST /login      │                  │                  │
     │----------------->│                  │                  │
     │ {email, password}│                  │                  │
     │                  │                  │                  │
     │                  │ login(request)   │                  │
     │                  │----------------->│                  │
     │                  │                  │                  │
     │                  │                  │ findByEmail()    │
     │                  │                  │----------------->│
     │                  │                  │                  │
     │                  │                  │ User             │
     │                  │                  │<-----------------│
     │                  │                  │                  │
     │                  │                  │ checkPassword()  │
     │                  │                  │                  │
     │                  │                  │ generateToken()  │
     │                  │                  │                  │
     │                  │ AuthResponse     │                  │
     │                  │ {token, user}    │                  │
     │                  │<-----------------│                  │
     │                  │                  │                  │
     │ AuthResponse     │                  │                  │
     │ {token, user}    │                  │                  │
     │<-----------------│                  │                  │
     │                  │                  │                  │
     │ Store token in localStorage                  │
     │                  │                  │                  │
```

### Séquence 2: Création d'Intervention

```
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│ Frontend │      │IntervContr│     │IntervService│     │  Database│
└────┬─────┘      └────┬─────┘      └────┬─────┘      └────┬─────┘
     │                  │                  │                  │
     │ POST /interventions                 │                  │
     │----------------->│                  │                  │
     │ {machineId, ...}  │                  │                  │
     │                  │                  │                  │
     │                  │ create(request)  │                  │
     │                  │----------------->│                  │
     │                  │                  │                  │
     │                  │                  │ findById(machine) │
     │                  │                  │----------------->│
     │                  │                  │                  │
     │                  │                  │ Machine          │
     │                  │                  │<-----------------│
     │                  │                  │                  │
     │                  │                  │ findById(tech)   │
     │                  │                  │----------------->│
     │                  │                  │                  │
     │                  │                  │ User             │
     │                  │                  │<-----------------│
     │                  │                  │                  │
     │                  │                  │ save(intervention)│
     │                  │                  │----------------->│
     │                  │                  │                  │
     │                  │                  │ Intervention     │
     │                  │                  │<-----------------│
     │                  │                  │                  │
     │                  │                  │ logAudit()       │
     │                  │                  │----------------->│
     │                  │                  │                  │
     │                  │ Intervention     │                  │
     │                  │<-----------------│                  │
     │                  │                  │                  │
     │ Intervention     │                  │                  │
     │<-----------------│                  │                  │
     │                  │                  │                  │
```

### Séquence 3: Exécution d'Intervention par Technicien

```
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│ Frontend │      │IntervContr│     │IntervService│     │  Database│
└────┬─────┘      └────┬─────┘      └────┬─────┘      └────┬─────┘
     │                  │                  │                  │
     │ PATCH /interventions/{id}/start     │                  │
     │----------------->│                  │                  │
     │                  │                  │                  │
     │                  │ start(id)        │                  │
     │                  │----------------->│                  │
     │                  │                  │                  │
     │                  │                  │ findById(id)     │
     │                  │                  │----------------->│
     │                  │                  │                  │
     │                  │                  │ Intervention     │
     │                  │                  │<-----------------│
     │                  │                  │                  │
     │                  │                  │ status=EN_COURS   │
     │                  │                  │ executedAt=now    │
     │                  │                  │                  │
     │                  │                  │ save(intervention)│
     │                  │                  │----------------->│
     │                  │                  │                  │
     │                  │                  │ logAudit()       │
     │                  │                  │----------------->│
     │                  │                  │                  │
     │                  │ Intervention     │                  │
     │                  │<-----------------│                  │
     │                  │                  │                  │
     │ Intervention     │                  │                  │
     │<-----------------│                  │                  │
     │                  │                  │                  │
```

---

## Backend - Entités JPA et Relations

### Structure des Tables

#### utilisateurs
```sql
CREATE TABLE utilisateurs (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR NOT NULL,
    employee_code VARCHAR UNIQUE NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    role VARCHAR NOT NULL,
    specialties VARCHAR,
    certifications VARCHAR,
    active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    phone VARCHAR,
    department VARCHAR
);
```

#### machines
```sql
CREATE TABLE machines (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    machine_type VARCHAR,
    brand VARCHAR,
    model VARCHAR,
    serial_number VARCHAR UNIQUE,
    manufacturing_year INTEGER,
    commissioning_date DATE,
    location VARCHAR,
    status VARCHAR DEFAULT 'EN_SERVICE',
    operating_hours BIGINT DEFAULT 0,
    description TEXT,
    image VARCHAR,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### points_maintenance
```sql
CREATE TABLE points_maintenance (
    id BIGSERIAL PRIMARY KEY,
    machine_id BIGINT REFERENCES machines(id),
    operation_type VARCHAR NOT NULL,
    description TEXT,
    precise_location VARCHAR,
    consumable_type VARCHAR,
    quantity_required DOUBLE,
    quantity_unit VARCHAR,
    frequency VARCHAR,
    counter_threshold INTEGER,
    next_planned_date DATE,
    last_executed_date DATE,
    active BOOLEAN DEFAULT true,
    estimated_duration_minutes INTEGER,
    instructions TEXT,
    created_at TIMESTAMP
);
```

#### interventions
```sql
CREATE TABLE interventions (
    id BIGSERIAL PRIMARY KEY,
    machine_id BIGINT REFERENCES machines(id),
    point_maintenance_id BIGINT REFERENCES points_maintenance(id),
    technician_id BIGINT REFERENCES utilisateurs(id),
    assigned_by_id BIGINT REFERENCES utilisateurs(id),
    planned_at TIMESTAMP NOT NULL,
    executed_at TIMESTAMP,
    completed_at TIMESTAMP,
    validated_at TIMESTAMP,
    duration_minutes INTEGER,
    status VARCHAR DEFAULT 'PLANIFIEE',
    finding_status VARCHAR DEFAULT 'NORMAL',
    observations TEXT,
    etat_constate TEXT,
    technician_signature VARCHAR,
    supervisor_validation VARCHAR,
    correction_report TEXT,
    urgent BOOLEAN DEFAULT false,
    created_at TIMESTAMP
);
```

#### consumables
```sql
CREATE TABLE consumables (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    reference VARCHAR,
    category VARCHAR,
    unit VARCHAR,
    current_stock DOUBLE,
    minimum_stock DOUBLE,
    unit_price DOUBLE,
    supplier VARCHAR,
    location VARCHAR,
    created_at TIMESTAMP
);
```

#### intervention_documents
```sql
CREATE TABLE intervention_documents (
    intervention_id BIGINT REFERENCES interventions(id),
    document_path VARCHAR
);
```

#### audit_logs
```sql
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR,
    entity_id BIGINT,
    action VARCHAR,
    user_id BIGINT,
    username VARCHAR,
    timestamp TIMESTAMP,
    details TEXT
);
```

### Relations JPA

**ManyToOne Relations:**
- Intervention → Machine (machine_id)
- Intervention → MaintenancePoint (point_maintenance_id)
- Intervention → AppUser (technician_id)
- Intervention → AppUser (assigned_by_id)
- MaintenancePoint → Machine (machine_id)

**OneToMany Relations (implicites):**
- Machine → MaintenancePoint
- Machine → Intervention
- AppUser → Intervention (comme technicien)
- AppUser → Intervention (comme assigneur)

**ElementCollection:**
- Intervention → documentsJoints (List<String>)

---

## Backend - API REST et Contrôleurs

### Structure des Contrôleurs

#### AuthController
```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthRequest request) {
        return authService.login(request);
    }
    
    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }
}
```

**Endpoints:**
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register` - Création utilisateur (ADMIN uniquement)

#### UserController
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_MAINTENANCE', 'CHEF_EQUIPE')")
    public List<AppUser> findAll() { ... }
    
    @GetMapping("/{id}")
    public AppUser findById(@PathVariable Long id) { ... }
    
    @GetMapping("/role/{role}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_MAINTENANCE', 'CHEF_EQUIPE')")
    public List<AppUser> findByRole(@PathVariable Role role) { ... }
    
    @GetMapping("/technicians")
    public List<AppUser> getTechnicians() { ... }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public AppUser update(@PathVariable Long id, @RequestBody AppUser user) { ... }
    
    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public AppUser activate(@PathVariable Long id) { ... }
    
    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public AppUser deactivate(@PathVariable Long id) { ... }
}
```

**Endpoints:**
- `GET /api/users` - Liste tous les utilisateurs
- `GET /api/users/{id}` - Voir un utilisateur
- `GET /api/users/role/{role}` - Filtrer par rôle
- `GET /api/users/technicians` - Lister les techniciens actifs
- `PUT /api/users/{id}` - Modifier (ADMIN)
- `PATCH /api/users/{id}/activate` - Activer (ADMIN)
- `PATCH /api/users/{id}/deactivate` - Désactiver (ADMIN)

#### MachineController
```java
@RestController
@RequestMapping("/api/machines")
public class MachineController {
    
    @GetMapping
    public List<Machine> findAll() { ... }
    
    @GetMapping("/{id}")
    public Machine findById(@PathVariable Long id) { ... }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_MAINTENANCE')")
    public Machine create(@Valid @RequestBody Machine machine) { ... }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_MAINTENANCE')")
    public Machine update(@PathVariable Long id, @RequestBody Machine machine) { ... }
    
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_MAINTENANCE')")
    public Machine changeStatus(@PathVariable Long id, @RequestParam MachineStatus status) { ... }
    
    @PatchMapping("/{id}/hours")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_MAINTENANCE', 'CHEF_EQUIPE')")
    public Machine addHours(@PathVariable Long id, @RequestParam Long hours) { ... }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) { ... }
}
```

**Endpoints:**
- `GET /api/machines` - Lister toutes les machines
- `GET /api/machines/{id}` - Voir une machine
- `POST /api/machines` - Créer (ADMIN, RESPONSABLE_MAINTENANCE)
- `PUT /api/machines/{id}` - Modifier (ADMIN, RESPONSABLE_MAINTENANCE)
- `PATCH /api/machines/{id}/status` - Changer statut (ADMIN, RESPONSABLE_MAINTENANCE)
- `PATCH /api/machines/{id}/hours` - Ajouter heures (ADMIN, RESPONSABLE_MAINTENANCE, CHEF_EQUIPE)
- `DELETE /api/machines/{id}` - Supprimer (ADMIN)

#### InterventionController
```java
@RestController
@RequestMapping("/api/interventions")
public class InterventionController {
    
    @GetMapping
    public List<Intervention> findAll() { 
        // TECHNICIEN: voit seulement ses interventions
        // AUTRES: voit toutes
    }
    
    @GetMapping("/{id}")
    public Intervention findById(@PathVariable Long id) { ... }
    
    @GetMapping("/machine/{machineId}")
    public List<Intervention> findByMachine(@PathVariable Long machineId) { ... }
    
    @GetMapping("/technician/{technicianId}")
    public List<Intervention> findByTechnician(@PathVariable Long technicianId) { ... }
    
    @GetMapping("/planning")
    public List<Intervention> getPlanning(@RequestParam LocalDate date) { ... }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_MAINTENANCE', 'CHEF_EQUIPE')")
    public Intervention create(@Valid @RequestBody Intervention intervention) { ... }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_MAINTENANCE', 'CHEF_EQUIPE')")
    public Intervention update(@PathVariable Long id, @RequestBody Intervention intervention) { ... }
    
    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_MAINTENANCE', 'CHEF_EQUIPE')")
    public Intervention assign(@PathVariable Long id, @RequestParam Long technicianId) { ... }
    
    @PatchMapping("/{id}/start")
    public Intervention start(@PathVariable Long id) { ... }
    
    @PatchMapping("/{id}/pause")
    public Intervention pause(@PathVariable Long id) { ... }
    
    @PatchMapping("/{id}/complete")
    public Intervention complete(@PathVariable Long id, @RequestBody CompleteInterventionRequest request) { ... }
    
    @PatchMapping("/{id}/validate")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_MAINTENANCE')")
    public Intervention validate(@PathVariable Long id) { ... }
    
    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_MAINTENANCE')")
    public Intervention cancel(@PathVariable Long id) { ... }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) { ... }
}
```

**Endpoints:**
- `GET /api/interventions` - Lister (techniciens: seulement leurs interventions)
- `GET /api/interventions/{id}` - Voir une intervention
- `GET /api/interventions/machine/{id}` - Filtrer par machine
- `GET /api/interventions/technician/{id}` - Filtrer par technicien
- `GET /api/interventions/planning` - Voir planning par date
- `POST /api/interventions` - Créer (ADMIN, RESPONSABLE_MAINTENANCE, CHEF_EQUIPE)
- `PUT /api/interventions/{id}` - Modifier (ADMIN, RESPONSABLE_MAINTENANCE, CHEF_EQUIPE)
- `PATCH /api/interventions/{id}/assign` - Assigner technicien
- `PATCH /api/interventions/{id}/start` - Démarrer (tous les rôles)
- `PATCH /api/interventions/{id}/pause` - Mettre en pause (tous les rôles)
- `PATCH /api/interventions/{id}/complete` - Terminer (tous les rôles)
- `PATCH /api/interventions/{id}/validate` - Valider (ADMIN, RESPONSABLE_MAINTENANCE)
- `PATCH /api/interventions/{id}/cancel` - Annuler (ADMIN, RESPONSABLE_MAINTENANCE)
- `DELETE /api/interventions/{id}` - Supprimer (ADMIN)

---

## Backend - Sécurité JWT et Gestion des Rôles

### Architecture de Sécurité

```
┌─────────────────────────────────────────────────────────┐
│                  Spring Security                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │         JwtAuthenticationFilter                 │   │
│  │  - Extrait le token du header Authorization    │   │
│  │  - Valide le token                             │   │
│  │  - Charge l'utilisateur dans SecurityContext   │   │
│  └─────────────────────────────────────────────────┘   │
│                          │                              │
│                          ▼                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │         SecurityConfig                          │   │
│  │  - Configure les endpoints publics/privés       │   │
│  │  - Configure CORS                               │   │
│  │  - Configure AuthenticationProvider            │   │
│  └─────────────────────────────────────────────────┘   │
│                          │                              │
│                          ▼                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │         CustomUserDetailsService                │   │
│  │  - Charge l'utilisateur depuis la DB            │   │
│  │  - Implémente UserDetails                      │   │
│  └─────────────────────────────────────────────────┘   │
│                          │                              │
│                          ▼                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │         @PreAuthorize Annotations                │   │
│  │  - Contrôle d'accès par rôle au niveau méthode  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Configuration de Sécurité

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/api/health", 
                    "/swagger-ui/**", "/v3/api-docs/**", "/uploads/**")
                .permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, 
                UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public AuthenticationProvider authenticationProvider(
            UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return new CustomAuthenticationProvider(userRepository, passwordEncoder);
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

### JWT Authentication Filter

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response,
                                   FilterChain filterChain) throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String username = jwtService.extractUsername(token);
            
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                
                if (jwtService.isTokenValid(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = 
                        new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
```

### Génération et Validation JWT

```java
@Service
public class JwtService {
    
    private final JwtEncoder jwtEncoder;
    private final JwtDecoder jwtDecoder;
    
    private final long jwtExpiration = 86400000; // 24h
    
    public String generateToken(UserDetails userDetails) {
        Instant now = Instant.now();
        
        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuer("gmpp-suite")
            .issuedAt(now)
            .expiresAt(now.plusMillis(jwtExpiration))
            .subject(userDetails.getUsername())
            .claim("scope", userDetails.getAuthorities())
            .build();
        
        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
    
    public String extractUsername(String token) {
        Jwt jwt = jwtDecoder.decode(token);
        return jwt.getSubject();
    }
    
    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }
}
```

### Contrôle d'Accès par Rôle

**Annotations @PreAuthorize:**

```java
// Seul ADMIN peut créer des utilisateurs
@PostMapping("/register")
@PreAuthorize("hasRole('ADMIN')")
public AuthResponse register(@RequestBody RegisterRequest request) { ... }

// ADMIN et RESPONSABLE peuvent créer des machines
@PostMapping
@PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_MAINTENANCE')")
public Machine create(@RequestBody Machine machine) { ... }

// Tous les rôles authentifiés peuvent démarrer une intervention
@PatchMapping("/{id}/start")
public Intervention start(@PathVariable Long id) { ... }

// ADMIN et RESPONSABLE peuvent valider
@PatchMapping("/{id}/validate")
@PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_MAINTENANCE')")
public Intervention validate(@PathVariable Long id) { ... }
```

**Hiérarchie des Rôles:**

```
ADMIN
├── Accès total
├── Gestion utilisateurs
├── Suppression données
└── Accès audit

RESPONSABLE_MAINTENANCE
├── Gestion opérations
├── Validation interventions
├── Gestion stocks
└── Accès rapports

CHEF_EQUIPE
├── Création interventions
├── Assignation techniciens
├── Ajout heures machines
└── Déduction stock

TECHNICIEN
├── Exécution interventions
├── Voir ses tâches
└── Déduction stock
```

---

## Backend - Documentation Swagger/OpenAPI

### Configuration OpenAPI

```java
@Configuration
public class OpenApiConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("GMPP Suite API")
                .version("1.0.0")
                .description("API pour la gestion de maintenance préventive")
                .contact(new Contact()
                    .name("Équipe GMPP")
                    .email("support@gmpp.local")))
            .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
            .components(new Components()
                .addSecuritySchemes("bearerAuth",
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")));
    }
}
```

### Accès à la Documentation

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

### Exemple de Documentation Générée

**Endpoint: POST /api/auth/login**

```yaml
paths:
  /api/auth/login:
    post:
      summary: Connexion utilisateur
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                  example: "admin@gmpp.local"
                password:
                  type: string
                  example: "Admin123!"
      responses:
        '200':
          description: Connexion réussie
          content:
            application/json:
              schema:
                type: object
                properties:
                  token:
                    type: string
                  user:
                    $ref: '#/components/schemas/AppUser'
        '401':
          description: Identifiants invalides
```

**Endpoint: GET /api/interventions**

```yaml
paths:
  /api/interventions:
    get:
      summary: Lister les interventions
      security:
        - bearerAuth: []
      parameters:
        - name: Authorization
          in: header
          required: true
          schema:
            type: string
            example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      responses:
        '200':
          description: Liste des interventions
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Intervention'
        '403':
          description: Accès non autorisé
        '401':
          description: Non authentifié
```

### Schémas de Données

**AppUser Schema:**
```yaml
components:
  schemas:
    AppUser:
      type: object
      properties:
        id:
          type: integer
        fullName:
          type: string
        email:
          type: string
        employeeCode:
          type: string
        role:
          type: string
          enum: [ADMIN, RESPONSABLE_MAINTENANCE, CHEF_EQUIPE, TECHNICIEN]
        specialties:
          type: string
        active:
          type: boolean
```

---

## Frontend - Interface React et Composants

### Structure du Projet Frontend

```
frontend/
├── src/
│   ├── api/
│   │   └── services.js          # Configuration Axios et endpoints
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx      # Barre de navigation
│   │   │   └── TopBar.jsx       # Barre supérieure
│   │   └── ui/
│   │       ├── Modal.jsx        # Composant modal générique
│   │       ├── Card.jsx         # Composant carte
│   │       └── ConfirmDialog.jsx# Dialogue de confirmation
│   ├── contexts/
│   │   └── AuthContext.jsx      # Contexte d'authentification
│   ├── pages/
│   │   ├── DashboardPage.jsx    # Page dashboard
│   │   ├── MachinesPage.jsx     # Gestion machines
│   │   ├── MaintenancePointsPage.jsx # Points maintenance
│   │   ├── InterventionsPage.jsx # Gestion interventions
│   │   ├── PlanningPage.jsx     # Calendrier planning
│   │   ├── UsersPage.jsx        # Gestion utilisateurs
│   │   ├── ConsumablesPage.jsx  # Gestion consommables
│   │   └── ReportsPage.jsx      # Rapports
│   ├── utils/
│   │   └── helpers.js           # Fonctions utilitaires
│   ├── App.jsx                  # Composant principal
│   └── main.jsx                 # Point d'entrée
├── package.json
└── vite.config.js
```

### Composant AuthContext

```jsx
import { createContext, useContext, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))

  const login = async (email, password) => {
    const response = await axios.post('/api/auth/login', { email, password })
    const { token, user } = response.data
    localStorage.setItem('token', token)
    setToken(token)
    setUser(user)
    return user
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

### Composant Sidebar avec Filtrage par Rôle

```jsx
import { useAuth } from '../contexts/AuthContext'

const allLinks = [
  { to: '/', icon: LayoutDashboard, label: 'Tableau de bord', 
    roles: ['ADMIN', 'RESPONSABLE_MAINTENANCE', 'CHEF_EQUIPE', 'TECHNICIEN'] },
  { to: '/machines', icon: Cpu, label: 'Machines', 
    roles: ['ADMIN', 'RESPONSABLE_MAINTENANCE', 'CHEF_EQUIPE', 'TECHNICIEN'] },
  { to: '/maintenance-points', icon: Wrench, label: 'Points de maintenance', 
    roles: ['ADMIN', 'RESPONSABLE_MAINTENANCE', 'CHEF_EQUIPE', 'TECHNICIEN'] },
  { to: '/interventions', icon: ClipboardList, label: 'Interventions', 
    roles: ['ADMIN', 'RESPONSABLE_MAINTENANCE', 'CHEF_EQUIPE', 'TECHNICIEN'] },
  { to: '/planning', icon: Calendar, label: 'Planning', 
    roles: ['ADMIN', 'RESPONSABLE_MAINTENANCE', 'CHEF_EQUIPE', 'TECHNICIEN'] },
  { to: '/users', icon: Users, label: 'Utilisateurs', 
    roles: ['ADMIN', 'RESPONSABLE_MAINTENANCE', 'CHEF_EQUIPE'] },
  { to: '/consumables', icon: Package, label: 'Consommables', 
    roles: ['ADMIN', 'RESPONSABLE_MAINTENANCE', 'CHEF_EQUIPE', 'TECHNICIEN'] },
  { to: '/reports', icon: BarChart3, label: 'Rapports', 
    roles: ['ADMIN', 'RESPONSABLE_MAINTENANCE'] },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const filteredLinks = allLinks.filter(link => link.roles.includes(user?.role))

  return (
    <aside>
      <nav>
        {filteredLinks.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}>
            <Icon /> {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
```

### Page Interventions avec Contrôle d'Accès

```jsx
export default function InterventionsPage() {
  const { user } = useAuth()
  const canCreateIntervention = user?.role !== 'TECHNICIEN'
  const canValidateIntervention = user?.role === 'ADMIN' || user?.role === 'RESPONSABLE_MAINTENANCE'
  const canCancelIntervention = user?.role === 'ADMIN' || user?.role === 'RESPONSABLE_MAINTENANCE'

  return (
    <div>
      <div className="page-header">
        <h1>Interventions</h1>
        {canCreateIntervention && (
          <button onClick={openCreate}>Nouvelle intervention</button>
        )}
      </div>

      <table>
        {interventions.map(i => (
          <tr key={i.id}>
            <td>{i.machineName}</td>
            <td>{i.technicianName}</td>
            <td>
              {i.status === 'PLANIFIEE' && <button onClick={start}>Démarrer</button>}
              {i.status === 'EN_COURS' && <button onClick={pause}>Pause</button>}
              {i.status === 'TERMINEE' && canValidateIntervention && (
                <button onClick={validate}>Valider</button>
              )}
              {['PLANIFIEE', 'EN_RETARD'].includes(i.status) && canCancelIntervention && (
                <button onClick={cancel}>Annuler</button>
              )}
            </td>
          </tr>
        ))}
      </table>
    </div>
  )
}
```

### Configuration Axios

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

---

## Frontend - Calendrier, Planning et Tableau de Bord

### Dashboard Global

**Composant DashboardPage.jsx:**

```jsx
export default function DashboardPage() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    dashboardApi.getStats().then(r => setStats(r.data))
  }, [])

  if (!stats) return <div>Chargement...</div>

  return (
    <div className="dashboard">
      <h1>Tableau de Bord</h1>
      
      <div className="stats-grid">
        <StatCard title="Machines" value={stats.totalMachines} />
        <StatCard title="Interventions" value={stats.totalInterventions} />
        <StatCard title="En Cours" value={stats.inProgressInterventions} />
        <StatCard title="En Retard" value={stats.overdueInterventions} />
      </div>

      <div className="charts">
        <BarChart data={stats.monthlyTrends} />
        <PieChart data={stats.statusDistribution} />
      </div>
    </div>
  )
}
```

**KPIs affichés:**
- Nombre total de machines
- Nombre total d'interventions
- Interventions en cours
- Interventions en retard
- Tendance mensuelle
- Répartition par statut

### Dashboard Technicien

```jsx
export default function TechnicianDashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    dashboardApi.getTechnicianStats().then(r => setStats(r.data))
  }, [])

  return (
    <div className="technician-dashboard">
      <h1>Mon Espace</h1>
      
      <div className="my-stats">
        <StatCard title="À Faire" value={stats.pendingInterventions} />
        <StatCard title="En Cours" value={stats.inProgressInterventions} />
        <StatCard title="Terminées" value={stats.completedInterventions} />
      </div>

      <div className="my-interventions">
        <h2>Mes Interventions</h2>
        {stats.myInterventions.map(int => (
          <InterventionCard key={int.id} intervention={int} />
        ))}
      </div>
    </div>
  )
}
```

### Planning (Calendrier)

**Composant PlanningPage.jsx:**

```jsx
export default function PlanningPage() {
  const [interventions, setInterventions] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    const fetchPlanning = async () => {
      const response = await interventionsApi.getPlanning(selectedDate)
      setInterventions(response.data)
    }
    fetchPlanning()
  }, [selectedDate])

  return (
    <div className="planning">
      <h1>Planning</h1>
      
      <div className="calendar-controls">
        <DatePicker 
          selected={selectedDate}
          onChange={setSelectedDate}
        />
        <button onClick={() => setSelectedDate(new Date())}>Aujourd'hui</button>
      </div>

      <div className="planning-grid">
        {interventions.map(int => (
          <PlanningCard key={int.id} intervention={int} />
        ))}
      </div>
    </div>
  )
}
```

**Fonctionnalités:**
- Navigation par date
- Vue journalière/semaine/mois
- Filtrage par technicien
- Drag and drop pour réassigner
- Coloration par statut

### Graphiques avec Recharts

```jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export function MonthlyTrendsChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="interventions" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  )
}
```

---

## Conteneurisation - Docker et Docker Compose

### Dockerfile Backend

```dockerfile
# Build stage
FROM maven:3.9-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Explication:**
- **Stage Build**: Utilise Maven pour compiler l'application
- **Stage Runtime**: Image légère OpenJDK pour l'exécution
- **Multi-stage**: Réduit la taille finale de l'image
- **Port 8080**: Port d'écoute de l'application

### Dockerfile Frontend

```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Runtime stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Explication:**
- **Stage Build**: Utilise Node.js pour compiler React avec Vite
- **Stage Runtime**: Utilise Nginx pour servir les fichiers statiques
- **nginx.conf**: Configuration du reverse proxy

### Configuration Nginx

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**Explication:**
- **try_files**: Gère le routing React (SPA)
- **proxy_pass**: Redirige /api vers le backend
- **Headers**: Transmission des informations client

### Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: gmpp-postgres
    environment:
      POSTGRES_DB: gmpp_db
      POSTGRES_USER: gmpp_user
      POSTGRES_PASSWORD: gmpp_pass
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U gmpp_user -d gmpp_db"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    container_name: gmpp-backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/gmpp_db
      SPRING_DATASOURCE_USERNAME: gmpp_user
      SPRING_DATASOURCE_PASSWORD: gmpp_pass
      JWT_SECRET: gmpp-secret-key-2024
      JWT_EXPIRATION: 86400000
    ports:
      - "8080:8080"
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./uploads:/app/uploads

  frontend:
    build: ./frontend
    container_name: gmpp-frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  postgres-data:
```

**Explication des Services:**

1. **postgres**
   - Image PostgreSQL 16 Alpine
   - Variables d'environnement pour la base
   - Volume persistant pour les données
   - Health check pour vérifier la disponibilité
   - Port 5432 exposé

2. **backend**
   - Build depuis le Dockerfile backend
   - Variables d'environnement Spring
   - Dépendance sur postgres (health check)
   - Volume pour les fichiers uploadés
   - Port 8080 exposé

3. **frontend**
   - Build depuis le Dockerfile frontend
   - Dépendance sur backend
   - Port 80 exposé (accessible sur 3000)

**Commandes Docker Compose:**

```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v

# Reconstruire les images
docker-compose up -d --build
```

### Avantages de la Conteneurisation

1. **Portabilité**: L'application fonctionne sur n'importe quel système avec Docker
2. **Isolation**: Chaque service est isolé dans son propre conteneur
3. **Reproductibilité**: Même environnement en développement et production
4. **Scalabilité**: Facile de scaler les services horizontalement
5. **Déploiement simplifié**: Une commande pour déployer toute l'application

---

## Qualité du Code et Bonnes Pratiques

### Principes SOLID Appliqués

**1. Single Responsibility Principle (SRP)**
- Chaque contrôleur a une seule responsabilité
- Les services contiennent la logique métier
- Les repositories gèrent uniquement l'accès aux données

**2. Open/Closed Principle (OCP)**
- Utilisation d'interfaces pour extensibilité
- Ajout de nouvelles fonctionnalités sans modifier le code existant

**3. Liskov Substitution Principle (LSP)**
- UserDetails implémenté par AppUser
- Substituable dans le contexte Spring Security

**4. Interface Segregation Principle (ISP)**
- Interfaces spécifiques par fonctionnalité
- Pas d'interfaces trop générales

**5. Dependency Inversion Principle (DIP)**
- Injection de dépendances via Spring
- Dépendance aux abstractions (interfaces) et non aux implémentations

### Clean Architecture

```
┌─────────────────────────────────────────────┐
│         Presentation Layer                   │
│    (Controllers, DTOs, API Documentation)    │
└─────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│          Business Logic Layer                │
│         (Services, Use Cases)                │
└─────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│           Data Access Layer                  │
│        (Repositories, JPA Entities)          │
└─────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│             Database Layer                   │
│              (PostgreSQL)                    │
└─────────────────────────────────────────────┘
```

### Gestion des Erreurs

**ExceptionHandler Global:**

```java
@RestControllerAdvice
public class ApiExceptionHandler {
    
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(EntityNotFoundException ex) {
        ErrorResponse error = new ErrorResponse("NOT_FOUND", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        ErrorResponse error = new ErrorResponse("FORBIDDEN", "Accès non autorisé");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        ErrorResponse error = new ErrorResponse("INTERNAL_ERROR", "Erreur serveur");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
```

### Validation des Données

**DTOs avec Annotations:**

```java
public class AuthRequest {
    @NotBlank(message = "L'email est requis")
    @Email(message = "Email invalide")
    private String email;
    
    @NotBlank(message = "Le mot de passe est requis")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
    private String password;
}
```

### Logging et Audit

**Audit Log automatique:**

```java
@Aspect
@Component
public class AuditAspect {
    
    @AfterReturning(
        pointcut = "@annotation(Auditable)",
        returning = "result"
    )
    public void auditAfterReturning(JoinPoint joinPoint, Object result) {
        String action = joinPoint.getSignature().getName();
        String entityType = result.getClass().getSimpleName();
        
        AuditLog log = AuditLog.builder()
            .entityType(entityType)
            .action(action)
            .userId(getCurrentUserId())
            .username(getCurrentUsername())
            .timestamp(LocalDateTime.now())
            .build();
        
        auditLogRepository.save(log);
    }
}
```

### Tests (Structure)

```java
@SpringBootTest
@AutoConfigureMockMvc
class InterventionControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private InterventionRepository repository;
    
    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldCreateIntervention() throws Exception {
        mockMvc.perform(post("/api/interventions")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                    "machineId": 1,
                    "plannedAt": "2024-05-01T10:00:00"
                }
            """))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists());
    }
}
```

### Code Quality Tools

**Lombok pour réduire le boilerplate:**
```java
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Machine {
    private Long id;
    private String name;
    // getters, setters, constructor générés automatiquement
}
```

**Spring Boot DevTools:**
- Auto-reload pendant le développement
- Remote debugging facilité

**Formatage du Code:**
- Consistance de l'indentation
- Convention de nommage Java

---

## Conclusion

GMPP Suite est une application moderne et complète de gestion de maintenance préventive qui met en œuvre les meilleures pratiques du développement logiciel:

### Points Forts

1. **Architecture Solide**: Séparation claire des couches, respect des principes SOLID
2. **Sécurité Robuste**: JWT avec contrôle d'accès granulaire par rôle
3. **API RESTful**: Documentation OpenAPI automatique
4. **Frontend Reactive**: Interface moderne avec React
5. **Conteneurisation**: Déploiement simplifié avec Docker
6. **Qualité du Code**: Validation, gestion d'erreurs, audit logging

### Technologies Clés

- **Backend**: Spring Boot 3, JPA, PostgreSQL, JWT
- **Frontend**: React 18, Vite, TailwindCSS
- **Infrastructure**: Docker, Docker Compose, Nginx

### Scalabilité

L'architecture permet d'ajouter facilement:
- De nouveaux rôles et permissions
- De nouveaux types d'entités
- De nouvelles fonctionnalités métier
- Une mise à l'échelle horizontale avec Kubernetes

### Perspectives

Ce projet démontre une maîtrise complète du développement full-stack moderne, de la conception à la mise en production, en passant par la sécurité, la documentation et les tests.

---

**Document généré pour la présentation académique du projet GMPP Suite**  
**Version**: 1.0  
**Date**: Avril 2026
