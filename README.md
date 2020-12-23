# criptoApi
  Simple api to connect to https://www.coingecko.com/en/api and perform some little stuff.

### Install the project
  Clone the project into a new folder. Inside the ./server folder open a command prompt and run

    npm install
  
### Pre-requisites
  Have Node.js installed in system.
  Have mariadb installed in system.

### Default Database configurations
    {
      "port": "3000",
      "db": {
          "HOST": "127.0.0.1",
          "PORT": 3306,
          "USER": "root",
          "PASS": "******",
          "DB": "cripto"
      },
      "dialect": "mariadb"
    }

### Run the server
  Inside ./server folder open a command prompt and run

    npm run start

  If it went well you should see
  >Server running in port ${port}
  
  and database named 'cripto' should been created with its tables.

  Inside table 'users' you shuld see an admin user created.

### Endpoints
  BaseUrl example: http://localhost:3000/api

  ##### Users
  /POST

    Access and use the application

    body (REQUIRED)
    {
      "username": STRING,
      "password": STRING
    }

    http://localhost:3000/api/login

  /GET

    List all users or one if specified

    ?user_id=${user_id} (OPTIONAL)

    http://localhost:3000/api/users

  /DELETE

    Delete a user

    id=${user_id} (REQUIRED)

    http://localhost:3000/api/users/:id

  /PUT

    Modify a user

    id=${user_id} (REQUIRED)
    body (OPTIONAL)
    {
      "first_name": STRING,
      "last_name": STRING,
      "username": STRING NOT NULL,
      "password": STRING NOT NULL,
      "default_cripto": STRING
    }

    http://localhost:3000/api/users

    /POST

    Create a user

    body
    {
      "first_name": STRING,
      "last_name": STRING,
      "username": STRING NOT NULL,
      "password": STRING NOT NULL,
      "default_cripto": STRING
    }

    http://localhost:3000/api/users

  ##### CriptoCurrency

  /GET

    List all cryptocurrencies. If user is added the currencies are
    listed with the price according to the user's' preference, if not, default one is in usd

    ?user_id=${user_id} (OPTIONAL)

    http://localhost:3000/api/cripto

  /GET

    List top N or 25 of the user's' cryptocurrencies.

    ?user_id=${user_id} (REQUIRED)
    ?size=${size} N, default 25 (OPTIONAL)
    ?order=${order} asc/desc default desc (OPTIONAL)

    http://localhost:3000/api/cripto/top

  /POST

    Add cryptocurrencies to the user

    body (REQUIRED)
    {
      "user_id": INTEGER,
      "cripto_id": STRING,
      "symbol": STRING,
      "price": DOUBLE,
      "name": STRING,
      "image": STRING, (OPTIONAL)
      "last_updated": DATETIME (OPTIONAL)
    }

    http://localhost:3000/api/cripto
