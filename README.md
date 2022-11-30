# 12-labours-nodejs-api

## Database Setup

PostgreSQL is used on our database setup, it is recommended for the developers to have some basic
knowledge with PostgreSQL and psql before setting up the database.

The following commands may vary depending on the operating system and shells used.

```bash
#Setup a new 12-labours user on the PostgreSQL database
$ sudo su - postgres
$ createuser --interactive --pwprompt
$ 12-labours

#Create database with postgres account create.sql
$ psql -U postgres postgres -f ./db_setup/create.sql

#Create tables:
$ psql -U 12-labours -d 12labours -W -f ./db_setup/createTable.sql

#Setup initial data:
$ psql -U 12-labours -d 12labours -W -f ./db_setup/dataSetup.sql
```

## Envionment variables

Here is the list of environment variables. The local sign up and login should work without
GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET

```bash
#The following indicates which portal the api services should be deployed on
API_PORT="8085"
#The following should point to the verify page on the portal
USER_VERIFY_URL="{PORTAL URL}/verify"
#Google authentication will redirect the user to the following page.
#This need to be setup on google for it to work
GOOGLE_REDIRECT_URI="{PORTAL URL}/login/callback"
#A secret phase of your own choosing
SECRET_KEY="SomeSecretKey"
#Database server host
DB_HOST="localhost"
#Database server port
DB_PORT="5432"
#Database user name
DB_USER="12-labours"
#Password of the DB_USER
DB_PASSWORD="SomePassword"
#Name for the database
DB_NAME="12labours"
#The following is the client id and secret from google.They are provided from the Credentials setup on Google Cloud. They are used for google login
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
#Sendgrid email notification keys and sender email address
SENDGRID_API_KEY=""
SENDGRID_VERIFIED_SENDER=""
#An API Key to protect the server, this variable is required and
#should be the same when starting the api and app server
API_KEY="SomeAPIKey"
```

## Starting up the server

```bash
#Install required npm packages
$ npm install

#Start the server
$ npm run start

#Start the server in debug mode
$ npm run dev
```
