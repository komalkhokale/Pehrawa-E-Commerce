import jwt from "jsonwebtoken"
import {config} from "../config/config.js"
import userModel from "../models/user.model.js";


export const authenticateUser = async (req, res, next) => {

    const token = req.cookies.token

    if(!token){
        return res.status(401).json({message: "Unauthorized token"})
    }

    try{

        const decoded = jwt.verify(token, config.JWT_SECRET)

        const user = await userModel.findById(decoded.userId)

        if(!user){
            return res.status(401).json({message: "Unauthorized User"})
        }

        req.user = user
        next()

    }catch(error){

        console.log(error);
        return res.status(401).json({message: "Unauthorized"})
     }

    }


export const authenticateSeller = async (req, res, next) => {


    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message: "Unauthorized token"})
    }


    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        
        const user = await userModel.findById(decoded.userId);

        // console.log(decoded);
        

        if(!user) {
            return res.status(401).json({message: "Unauthorized user"})
        }

        if(user.role !== "seller") {
            return res.status(403).json({message: "Forbidden"})
        }

        req.user = user;

        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({message: "Unauthorized"})
    }
}