# Northcoders News API
NC News is an API that allows clients to interact with articles within a database. Articles have related topics, and can have related comments. Comments are themselves associated to users.

### Hosted API
Link to API: https://northcoders-news-c5lb.onrender.com

To see a description of the endpoints available, go to: https://northcoders-news-c5lb.onrender.com/api

### Cloning The Repository
To clone this repo, run the following command in your shell:

```console
$ git clone https://github.com/edthuman/nc_news
```
## Installation

Before proceeding, please ensure that your Node.js version is higher than 6.0.0; you can check this with the following command:
```console
$ node --version
```

There are then dependencies which must be installed: Dotenv, Express, Husky, PostgreSQL (PSQL), SuperTest.

To install them, please run the following commands one-by-one:

```console
$ npm install dotenv
$ npm install express
$ npm install pg
$ npm install supertest
```

Several development-specific dependencies will be also need to be installed: Jest, Jest Extended, Jest Sorted, and pg-format. The commands to install these are:

```console
$ npm install --save-dev jest
$ npm install --save-dev jest-extended
$ npm install --save-dev jest-sorted
$ npm install --save-dev
```

> [!WARNING]
> Double check that these have not been added to your dependencies within package.json, they should only be present in devDependencies. Please move them if necessary.

PSQL will need to be version 8.7.3 or higher. You can check this is the case using:

```console
$ postgres --version
```
## Setting Up The Databases

### Creating Environmental Variables
To allow the API to correctly connect to the test and development databases as appropriate, please create two files locally named **.env.test** and **.env.development**.

Within each .env file, declare a PGDATABASE variable, and assign it the name of the database for the related environment.

For an example of what these should look like, see .env-example.

> **Note**
>A second environment variable may be required which provides your PSQL password.

> [!WARNING]
> PGPASSWORD can directly declare your PSQL password in your .env files, but this is not recommended for security reasons. Instead, please create a password file, and then declare PGPASSFILE variables in each .env file that provides the path to your password file.

> [!CAUTION]
> Ensure that your .env files are ignored using the .gitignore file. Removing .env files from .gitignore could cause secrets to be revealed.

### Creating The Databases
A script has been written to create the development and test databases for you. Simply run:

```console
$ npm run setup-dbs
```

If either database already exists, it will be dropped and then recreated. 

>**Note:**
>This does NOT need to ben run before re-seeding the development database.

### Seeding The Development Database
A script has been written to seed the development database, run:

```console
$ npm run seed
```

Any existing tables within the database will be dropped before the database is then seeded with the starting data.

>**Note:**
>The test database does not need to be seeded in the set-up, as test files will handle this.

## Testing
To run all available tests on the API, run: 

```console
$ npm test
```

If you only want tests from a specific file to run, you can provide the file's name; for example, the tests from app.test.js can be run with:

```console
$ npm test app.test.js
```