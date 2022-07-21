Test user

username : "Test Man",
email: "test@gmail.com",
password: "Abcde12345"

# Setup backend

1. Install sequelize-cli module globally if you haven't.
2. run the following command : npm install
3. Go to file config/config.json and change password to match your database's. Change the database name also if you like. Edit the following section:
   "development": {
   "username": "root",
   "password": "YOUR_PASSWORD_HERE",
   "database": "YOUR_DATABASE_NAME",
   "host": "127.0.0.1",
   "dialect": "mysql"
   }
4. run the following command in the terminal : sequelize db:create
5. run the following command in the terminal : sequelize db:migrate
6. run the following command in the terminal : sequelize db:seed:all
7. Optional : if you wish to clear the database run : sequelize db:seed:undo:all
8. run the following command in the terminal : npm start
9. You're good to go. Start the fronend server and the app will be ready. Please also read README.md in the frontend repo.
