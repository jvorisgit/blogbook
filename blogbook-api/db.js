import mysql2 from "mysql2";

//set db connection parameters
export const db = mysql2.createConnection({
    host:"172.31.176.1",
    user:"blogbookadmin",
    password:"LoyaltyTrunkCreatureMost8",
    database: "blogbookdb"
});
