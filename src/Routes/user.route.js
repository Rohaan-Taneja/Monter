import { Router } from "express";
import { registerUser, Verify_User } from "../Controllers/user.controller.js";

const router = Router();


router.route("/register").post(registerUser)

router.route("/verify/:userid").get(Verify_User)


export default router