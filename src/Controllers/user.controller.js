import { ApiError } from "../Utils/Api_Error.js";
import {
  Emailchecking,
  isEmpty,
  User_Existed_or_not,
} from "../Utils/Verification_Methods.js";
import { User } from "../Models/User.model.js";
import { sendVerificationEmail } from "../Utils/Email_Verification_otp.js";


const generateRefreshTokenAccessToken =async (user_id)=>{

  console.log(user_id)

  try {

    const userr = await User.findById(user_id )
    console.log("this is the user , whose acces token is finding" , userr);

    const AccessToken = userr.generateAccessToken()
    const RefreshToken = userr.generateRefreshToken()

    // userr.Refresh_Token =RefreshToken
    //  await userr.save( )
    await User.updateOne(
      { _id: userr._id },
      {
        $set: {
          Refresh_Token: RefreshToken,
        },
        $currentDate: { lastUpdated: true },
      }
    );

    console.log("these are the refresh tokens", userr.Refresh_Token , RefreshToken);

    return {AccessToken , RefreshToken}

    
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating referesh and access token" ,error)
  }
}

// registering user
const registerUser = async (req, res) => {
  // get user details from frontend
  // validation - check if empty
  //check if email alredy existed
  //create user object and enter in db
  // remove password and refresh token from response
  //check if user chreated
  // return response
  console.log("hello");

  const { username, email, password } = req.body;
  console.log(req.body);
  console.log("username : ", username, " email :", email);

  //   verification of data
  isEmpty(req.body);

  // checking for format of email
  Emailchecking(req.body.email);

  // checking if user is alredy in the database or not , if yes , an erro will occur
  User_Existed_or_not(username, email);

  // creating the user in the database
  const userr = await User.create({
    username,
    email,
    password,
  });

  // checking if user created and removing password and refresh token field
  const createdUser = User.findById(userr._id).select(
    "-password -Refresh_Token -"
  );

  if (!createdUser) {
    throw new ApiError(
      500,
      "erros is comming in server while regsitering the user"
    );
  }

  // after storing user data , we are sending user a verification mail to verify them
  sendVerificationEmail(email, userr._id);
};

// when user clciks on the link in his/her email , validation field in model will be updated to true
const Verify_User = async (req, res) => {
  const UserId = req.params.userid;
  console.log("this is the user id", req.params);

  // updating user validation field
  try {
    await User.updateOne(
      { _id: UserId },
      {
        $set: {
          validation: true,
        },
        $currentDate: { lastUpdated: true },
      }
    );

    res.status(200).json({
      Message: "use verified successfully",
    });
  } catch (error) {
    res.status(500),
      json({
        Message:
          "something is worng , and we could not abel to update the validation of the user",
      });
    console.log("error in validation and updating user => ", error);
  }
};

// conntroller to add more details after validating email
const Add_More_Details = async (req, res) => {
  
  try {
    const { email, location, age, work_details } = req.body;

    // checking if user exist or not
    const isUserExist = await User.findOne({ email });

    // if user does not exist
    if (!isUserExist) {
      return res.status(404).json({
        message: "user does not exist",
      });
    }

    // checking if user email is validated or not
    const isValidated = isUserExist.validation;
    if (isValidated) {
      // setting the user further details
      await User.updateOne(
        { email: email },
        {
          $set: {
            Work_Details: work_details,
            age: age,
            location: location,
          },
          $currentDate: { lastUpdated: true },
        }
      );

      res.status(200).json({
        message: "user data updated successfully",
      });
    }
    // if not validated we will give an error message
    else {
      res.status(400).json({
        message: "user is not validated",
      });
    }
  } catch (error) {
    console.log("some error is coming up checking user info ", error);
    res.status(500).json({
      message: `some error in server = ${error}`,
    });
  }
};


const loginUser = async (req, res)=>{
  // req.body => data (email and pass)
  // first time = username and password check 
  // if correct , the move forward and if wrong => no user or wrong password
  //if correct pasword , token build and save it in db
  //send it to user in cookies

  const {email , password} = req.body
  console.log("someone tryng to login" , req.body);

  try {

    const user = await User.findOne({email})

    if(!user){
      console.log("user does not exist");
      return res.status(401).json({
        message : "user not found"
      })
    }

    // checking if password is correct 
    const iseUserAuthetic = await user.isPasswordCorrect(password)

    // if password is wrong , 
    if(!iseUserAuthetic){
      return res.status(400).json({
        message :"wrong password"
      })
    }

    // if password is correct , getting the tokens
    const {RefreshToken , AccessToken } = await generateRefreshTokenAccessToken(user._id)


    // now , the current user(that we caled above) , does not have refresh token , 
    // we can two things either call the user , or update the user info 
    // updated user 
    const LoggedinUser = await User.findOne(user._id ).select(
      "-password -Refresh_Token"
    )

    // options for cookies = only server can change cookiea and secure 
    const options = 
    {
      https:true, 
      secure:true
    }

    return res
    .status(200)
    .cookie("accessToken" , AccessToken ,options)
    .cookie("refrehToken" , RefreshToken ,options)
    .json({
      mesaage : "user loggedin successfully , and cookies are set"
    })
    
  } catch (error) {
    
    console.log("error in logging in user = >" , error);
    res.status(500).json({
      message :"error in loggining in user"
    })
    
  }

  



}

const logoutUser = async (req,res)=>{


// to loggout user , we are undefining refreshToken value in DB and also deleting cookies 
  await User.findByIdAndUpdate(
    req.user._id,
    {
        $unset: {
            refreshToken: undefined
        }
    },
    {
        new: true
    }
)

const options = 
{
  https:true, 
  secure:true
}

return res
.status(200)
.clearCookie("accessToken", options)
.clearCookie("refrehToken", options)
.json({message : "user logged out successfully"})


}

// when user calls this route , itwill first go to middleware , we will take details form cokkies and add user to req
// and now we can get the details from this req.user 
const getuserinfo =  async (req, res)=>{

  const {username , email , age , location} = req.user
  console.log(req.user);
  return res.status(200).json({
    message : "below is the user infor from the cookie",
    username : username,
    email : email ,
    age : age,
    location : location

  })

}





export { registerUser, Verify_User, Add_More_Details , 
  loginUser 
  ,logoutUser , getuserinfo
};
