import validator from "validator";
import { ApiError } from "./Api_Error.js";
import { User } from "../Models/User.model.js";


// methods to verify that input fields are not empty 
const isEmpty =(input)=>{
    const {username , email , password}= input

    if ([username, email, password].some((field) => field?.trim() === "")) {
        console.log("empty string ");
        throw new ApiError(400, "field is empty");
      }

}

// email validation method 
const Emailchecking = (email)=>{
    if (!validator.isEmail(email)){
        throw new ApiError(400 , "wrong email format")
    }

}

// checking if user is alredy in the database or not , if yes , an erro will occur
const User_Existed_or_not = async (username, email)=>{
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
      })
      
      if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
      }
}

export {isEmpty , Emailchecking , User_Existed_or_not}