# Users Microservice
In charge of users management. Authentication & more.

# Setup
## First thing first
Run:
``` 
npm install
``` 
## DB connection
For local development, you will need mongodb installed in your computer OR you can connnect to Mongo Atlas doing the following:
1. Create the file ".env" in the root folder of the project
2. Add the following line (ask mods for \<password>)
``` 
DB_URL="mongodb+srv://superuser:<password>@users-service.5nzx63g.mongodb.net/test"
``` 
3. Run "npm run start-linux" if you're on a UNIX environment or "npm run start-windows" if you're on Windows.

If you already have mongodb in your system, just run "npm start", but make sure the name of the db is "test".