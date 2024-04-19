import { ApiError } from "../Utils/Api_Error.js";
import { Emailchecking, isEmpty, User_Existed_or_not } from "../Utils/Verification_Methods.js";
import { User } from "../Models/User.model.js";
import { sendVerificationEmail } from "../Utils/Email_Verification_otp.js";
import path from 'path';
import { fileURLToPath } from 'url';


// registering user 
const registerUser = async (req, res) => {
  // get user details from frontend
  // validation - check if empty
  //check if email alredy existed
  //create user object and enter in db
  // remove password and refresh token from response
  //check if user chreated
  // return response

  const { username, email, password } = req.body;
  console.log(req.body);
  console.log("username : ", username, " email :", email);

  //   verification of data
  isEmpty(req.body);

  // checking for format of email 
  Emailchecking(req.body.email);

  // checking if user is alredy in the database or not , if yes , an erro will occur
  User_Existed_or_not(username , email);

  
  // creating the user in the database
  const userr = await User.create({
    username , 
    email,
    password,
  })

  // checking if user created and removing password and refresh token field 
  const createdUser = User.findById(userr._id).select(
    "-password -Refresh_Token -"
  )

  if (!createdUser){
    throw new ApiError(500 , "erros is comming in server while regsitering the user")
  }

  // after storing user data , we are sending user a verification mail to verify them
  sendVerificationEmail(email , userr._id)

};

// when user clciks on the link in his/her email , validation field in model will be updated to true
const Verify_User = async (req, res) =>{

  const UserId = req.params.userid
  console.log("this isthe user id" , req.params);

  // updating user validation field 
  try {
     await User.updateOne({_id : UserId},
      {
        $set : {
          validation : true
  
        },
        $currentDate: { lastUpdated: true }
      })
  
    res.status(200).json({
      Message: "use verified successfully"
    })
    
  } catch (error) {
    res.status(500),json({
      Message: "something is worng , and we could not abel to update the validation of the user"
    })
    console.log("error in validation and updating user => ",error);
    
  }











}










export { registerUser , Verify_User };
