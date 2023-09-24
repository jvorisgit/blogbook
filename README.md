# BlogBook
## Description
BlogBook is a mini-blogging service written with React and Node. Features include:
- Responsive activity feed grid and category sidebar
- User authentication
- Blog entry creation and management

![image](https://github.com/jvorisgit/blogbook/assets/11342956/23f7bd9f-3608-4a45-a4e0-e0a30ba06a59)

## Installation
BlogBook requires the installation of 3 core components:
-blogbookdb: MYSQL Database 
-blogbook-api: Node backend
-blogbook-frontend: React frontend

### blogbookdb MYSQL Database Initialization and Connection
BlogBook stores post, category, and user data in a MYSQL database. 

To initialize the blogbookdb, run the `blogbook_database_schema.sql` MYSQL script in the `mysql_db_init` directory.

```
cd mysql_db_init
mysql blogbook_database_schema.sql
```

Next, configure the connection to the blogbookdb by setting the `host`, `user`, and `password` parameters in `blogbook-api/db.js`.

### blogbook-api Installation

Install the BlogBook API by running `yarn install` in the `blogbook-api` directory.

```
cd blogbook-api
yarn install
```

### blogbook-frontend Installation

Install the BlogBook Frontend by running `yarn install` in the `blogbook-frontend` directory.

```
cd blogbook-frontend
yarn install
```

## Usage

First, start the BlogBook API by running `yarn start` in the  `blogbook-api` directory.

```
cd blogbook-api
yarn start
```

Next, open a new terminal and start the BlogBook Frontend by running `yarn start` in the  `blogbook-frontend` directory.

```
cd blogbook-api
yarn start
```

The BlogBook app should open in your browser.

