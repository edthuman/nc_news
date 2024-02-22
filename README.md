# Northcoders News API

NC News is an API which allows clients to interact with a database of articles. Every article has a related topic, and articles can have  comments related to them. Comments themselves are associated with a user.

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

Once that's been confirmed, you then need to install npm, by running:

```console
$ npm install
```

This by will also install the dependencies listed in package.json: Dotenv, Express, Husky, PostgreSQL (PSQL), SuperTest. Should any of these fail to install, the specific commands to download them individually are as follows:

```console
$ npm install dotenv
$ npm install express
$ npm install husky
$ npm install pg
$ npm install supertest
```

Several development-specific dependencies will be also need to be installed: Jest, Jest Extended, Jest Sorted, and pg-format. The commands to install these are:

```console
$ npm install --save-dev jest
$ npm install --save-dev jest-extended
$ npm install --save-dev jest-sorted
$ npm install --save-dev pg-format
```

> [!WARNING]
> Double check that these have not been added to your dependencies within package.json, they should only be present in devDependencies. Please move them if necessary.

PSQL will need to be version 8.7.3 or higher. You can check your version using:

```console
$ postgres --version
```

## Setting Up The Databases

### Creating Environmental Variables

To allow the API to correctly connect to the test and development databases as appropriate, please create two files locally named **.env.test** and **.env.development**.

Within each .env file, declare a PGDATABASE variable, and assign it the name of the database for the related environment.

For an example of what these should look like, see .env-example.

> **Note:**
> A second environment variable may be required which provides your PSQL password.

> [!WARNING]
> Directly declaring your password in .env files using PGPASSWORD is NOT recommended for security reasons. Instead, please create a password file, declare PGPASSFILE variables in each .env file, and assign them the path to your password file.

> [!CAUTION]
> Ensure that your .env files are included within the .gitignore file. If .env files are not covered by .gitignore, this risks secrets being revealed.

### Creating The Databases

A script has been written to create your development and test databases. Simply run:

```console
$ npm run setup-dbs
```

If either database already exists, it will be dropped and then recreated.

> **Note:**
> This does NOT need to ben run before re-seeding the development database.

### Seeding The Development Database

A script has been written to seed the development database, run:

```console
$ npm run seed
```

Any existing tables within the database will be dropped before the database is then seeded with the starting data.

> **Note:**
> The test database does not need to be seeded during this set-up, as the test file should handle this.

## Testing

To run all available tests on the API, run:

```console
$ npm test
```

If you only want tests from a specific file to run, you can provide the file's name; for example, the tests from app.test.js can be run with:

```console
$ npm test app.test.js
```