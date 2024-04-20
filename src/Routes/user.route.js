import { Router } from "express";
import { Add_More_Details, registerUser, Verify_User } from "../Controllers/user.controller.js";

const router = Router();


router.route("/register").post(registerUser)

router.route("/verify/:userid").get(Verify_User)

router.route("/AddDetails").post(Add_More_Details)


export default router