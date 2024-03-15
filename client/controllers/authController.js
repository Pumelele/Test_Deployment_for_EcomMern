import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";

export const registerController = async (req,res) => {

    try {
        const {name, email, password, phone, address} = req.body;

        //validations
        if (!name){
            return res.send({message: 'Name is required'})
        }
        if (!email){
            return res.send({message: 'Email is required'})
        }
        if (!password){
            return res.send({message: 'Password is required'})
        }
        if (!phone){
            return res.send({message: 'Contact number is required'})
        }
        if (!address){
            return res.send({message: 'Address is required'})
        }
        //check user
        const existingUser = await userModel.findOne({email})
        //Checking if user already exists during registration process
        if(existingUser){
            return res.status(200).send({
                success: false,
                message: "You already have an account, please log in",
            })
        }
        //Registering a user
        const hashedPassword = await hashPassword(password);
        //save user
        
        const user =  await new userModel({name, email, phone, address, password:hashedPassword}).save();
        res.status(201).send({
            success: true,
            message: "User Registered successfully",
            user,
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Registraion",
            error,
        })
    }
};

//POST LOGIN
export  const loginController = async(req,res)=>{
    try {
        const {email,password}= req.body
        //login validation
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message: 'Invalid Email or Password'
            })
        }
        //check user
        const user = await userModel.findOne({email})
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registered"
            })
        }
        const match = await comparePassword(password, user.password)
        if(!match){
            return res.status(200).send({
                success:false,
                message: 'Invalid Password'
            })
        }
        //token
        const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET, {expiresIn: '7D',})
        res.status(200).send({
            success: true,
            message: "Login successful",
            user:{
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,

            },
            token
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,message: "Error in login",
            error
        })
    }
};

//test controller
export const testController = (req, res)=>{
    res.send("Protected Route")
}
