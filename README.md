# Northcoders News API

To allow the API to connect to the test and development databases as appropriate, please create two files locally - .env.test and .env.development

Each .env file should declare a PGDATABASE environment variable with the name of the database for the relevent environment.

These .env files will ultimately look very similar to the example file: .env-example

It is possible that a second environment variable may be required to provide your PSQL password. This can be declared in each .env file using PGPASSWORD, but it is recommended for security reasons to instead create a password file, and declare a PGPASSFILE environment variable in each .env file that directs to the password file.

> [!CAUTION]
> Please ensure that the .gitignore file covers your .env files. Removing .env files from .gitignore could mean accidentally committing secrets.