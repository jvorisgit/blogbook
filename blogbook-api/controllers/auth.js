import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db.js";

//handle registration requests
export const register = (req,res) => {
    //check if email already exists
    const emailCheckQuery = "SELECT id, email, password FROM users WHERE email = ?";
    db.query(emailCheckQuery, [req.body.email], (err,data) => {
        if (err) {
            return res.json(err);
        }
        if (data.length) {
            return res.status(409).json("Email already registered");
        }
        
        //salt and hash password before writing to DB
        //see https://www.npmjs.com/package/bcryptjs
        var salt = bcrypt.genSaltSync(10);
        var passwordHash = bcrypt.hashSync(req.body.password, salt);

        //create new user
        const addUserQuery = "INSERT INTO users(`email`,`password`) VALUES (?)"
        const addUserQueryValues = [
            req.body.email,
            passwordHash
        ]

        db.query(addUserQuery, [addUserQueryValues], (err,data) => {
            if (err) {
                return res.json(err);
            }

            return res.status(200).json("New user with email " + req.body.email + " registered successfully");
        });
    });
};


//handle login requests
export const login = (req,res) => {
    //check if user exists
    const emailCheckQuery = "SELECT id, email, password FROM users WHERE email = ?";
    db.query(emailCheckQuery, [req.body.email], (err,data) => {
        if (err) {
            return res.json(err);
        }

        if (data.length === 0) {
            return res.status(404).json("Email not registered");
        }

        //check if provided password matchs stored hash
        //see https://www.npmjs.com/package/bcryptjs
        const passwordMatch = bcrypt.compareSync(req.body.password, data[0].password);
        if (!passwordMatch) {
            return res.status(400).json("Incorrect username or password");
        }

        //user is successfully authenticated
        //create their access token and return it as a cookie
        const token = jwt.sign({id:data[0].id}, "blogbooksecretkey");
        const {password, ...userData} = data[0];

        return res.cookie("access_token", token, {httpOnly:true}).status(200).json(userData);
      
    });
};

//handle logout requests
export const logout = (req,res) => {
    //logut by deleting access token cookie
    console.log("auth route logout")
    ///console.log(res)
    res.clearCookie("access_token",{
        sameSite:"None",
        secure:true
    }).status(200).json("Logout successful");
};