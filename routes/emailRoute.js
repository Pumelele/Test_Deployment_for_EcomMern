import express from "express";
import { sendEmailController } from "../controllers/emailController.js";

//router object

const router = express.Router();

//route
router.post("/sendEmail", sendEmailController);

//export
export default router