import mysql2 from "mysql2";

//set db connection parameters
export const db = mysql2.createConnection({
    host:"myhost",
    user:"blogbookadmin",
    password:"",
    database: "blogbookdb"
});
