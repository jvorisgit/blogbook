import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db.js";

export const register = (req,res) => {
    const emailCheckQuery = "SELECT id, email, password FROM users WHERE email = ?";
    
    db.query(emailCheckQuery, [req.body.email], (err,data) => {
        if (err) {
            return res.json(err);
        }
        if (data.length) {
            return res.status(409).json("Email already registered");
        }
        
        var salt = bcrypt.genSaltSync(10);
        var passwordHash = bcrypt.hashSync(req.body.password, salt);

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

export const login = (req,res) => {
    const emailCheckQuery = "SELECT id, email, password FROM users WHERE email = ?";
    
    db.query(emailCheckQuery, [req.body.email], (err,data) => {
        console.log(req.body);
        if (err) {
            return res.json(err);
        }

        if (data.length === 0) {
            return res.status(404).json("Email not registered");
        }

        const passwordMatch = bcrypt.compareSync(req.body.password, data[0].password);
        if (!passwordMatch) {
            return res.status(400).json("Incorrect username or password");
        }

        const token = jwt.sign({id:data[0].id}, "blogbooksecretkey");
        const {password, ...userData} = data[0];

        return res.cookie("access_token", token, {httpOnly:true}).status(200).json(userData);
      
    });
};

export const logout = (req,res) => {
    res.clearCookie("access_token",{
        samSite:"None",
        secure:true
    }).status(200).json("Logout successful");
};