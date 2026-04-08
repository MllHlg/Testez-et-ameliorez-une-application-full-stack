# Yoga App

## Sommaire

- [Prérequis](#prérequis)
- [Installation et lancement de l'application](#installation-et-lancement-de-lapplication)
- [Exécution des tests et génération des rapports](#exécution-des-tests-et-génération-des-rapports)
- [Ressources supplémentaires](#ressources-supplémentaires)

## Prérequis

Avant de lancer le projet, assurez-vous d'avoir installé les éléments suivants sur votre machine :

**Pour le Back-end :**
* JDK 21
* Docker et Docker Compose
* Maven 3.9.3 ou supérieur

**Pour le Front-end :**
* Node.js et npm
* Angular CLI version 19.2.16

---

## Installation et lancement de l'application

### 1. Back-end (Spring Boot & Base de données Docker)

L'environnement de base de données est entièrement géré par Docker Compose.

1. Assurez-vous que **Docker-Desktop** est démarré sur votre poste de travail local.
2. Ouvrez un terminal, placez-vous à la racine du dossier `back/` et exécutez :
   ```bash
   mvn spring-boot:run
   ```
Cette commande va initialiser le container Docker (MySQL) et lancer l'application back sur le port 8080.

#### Initialisation des données de test :
Pour pouvoir vous connecter, vous devez créer l'utilisateur administrateur par défaut.

Sur Docker-Desktop, cliquez sur le container back_mysql pour ouvrir l'onglet Exec.

Connectez-vous à MySQL avec la commande 
```bash 
mysql -u user_test -p test_password 
```

Sélectionnez la base de données avec `use test;`.

Exécutez le script d'insertion SQL se trouvant dans `back/src/main/resources/sql/insert_user.sql`.

Vous pouvez maintenant vous connecter à l'application avec les identifiants : yoga@studio.com / admin_password

### 2. Front-end (Angular)

Ouvrez un nouveau terminal et placez-vous dans le dossier front/.

Installez les dépendances du projet :
```bash
npm install
```

Lancez l'application web :
```bash
npm run start
```

---

## Exécution des tests et génération des rapports

Les tests doivent couvrir un minimum de 80 % du code sur les instructions et les branches.

### Back-end (JUnit, Mockito)

Lancer les tests et générer le rapport :
Depuis le dossier `back/`, exécutez la commande Maven :
```bash
mvn clean test
```

Consulter la couverture :
Le rapport HTML est automatiquement généré après les tests. Ouvrez le fichier `back/target/site/jacoco/index.html`.

### Front-end : Tests Unitaires (Jest)

Lancer les tests unitaires :
Depuis le dossier `front/`, exécutez la commande :
```bash
npx jest --coverage
```

Consulter la couverture :
Le rapport HTML est automatiquement généré après les tests. Ouvrez le fichier `front/coverage/jest/lcov-report/index.html`.

### Front-end : Tests End-to-End (Cypress)

Placez-vous dans le dossier `front/`.

- Lancer les tests E2E avec l'interface Cypress : 
```bash
npm run e2e
```

- Lancer les tests E2E sans interface et générer le rapport de couverture : 
```bash
npm run e2e:ci
```

Consulter la couverture :
Le rapport HTML est automatiquement généré après les tests. Ouvrez le fichier `front/coverage/cypress/lcov-report/index.html`.

---

## Ressources supplémentaires
Pour faciliter vos tests d'API en développement, une collection Postman est disponible dans le projet.

Vous pouvez la trouver dans ce dossier : `back/postman/collections/yoga`.