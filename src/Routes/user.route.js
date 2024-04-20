import { Router } from "express";
import { Add_More_Details,getuserinfo,loginUser , logoutUser, registerUser, Verify_User } from "../Controllers/user.controller.js";
import { VerifyJWT } from "../Middlewares/auth.middleware.js";

const router = Router();


router.route("/register").post(registerUser)

router.route("/verify/:userid").get(Verify_User)

router.route("/AddDetails").post(Add_More_Details)

router.route("/login").post(loginUser)


router.route('/logout').post( VerifyJWT ,logoutUser)


router.route("/getuserinfor_fromcookie").get(VerifyJWT , getuserinfo)


export default router