# Northcoders News API

To allow the API to connect to the test and development databases as appropriate, please create two files locally - .env.test and .env.development

Each .env file should declare (with PGDATABASE=) the name of the appropriate database for its environment.

These .env files will ultimately look very similar to the example .env-example

It is possible that a second environment variable may be required to provide your PSQL password. This can be declared in each .env files with PGPASSWORD=, but it is recommended for security reasons to instead create a password file, declaring a PGPASSFILE environment variable in the .env files which directs to your password file.

> [!CAUTION]
> Please be ensure that the .gitignore file covers your .env files. Removing .env files from .gitignore could mean accidentally committing secrets.