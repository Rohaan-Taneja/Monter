import mongoose from "mongoose";

const userschema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: [true, "name is required"],
      unique: [true, "username should be unique"],
      trim: true, // all the white spaces will be removed
      index: true, // fast searching ke liye
    },
    email: {
      type: String,
      require: [true, "email is required"],
      unique: [true, "email should be unique"],
      trim: true, // all the white spaces will be removed
    },

    password: {
      type: String,
      require: [true, "password is required"],
    },

    validate: {
      type: Boolean,
      default: false,
    },

    location: {
      type: String,
    },

    age: {
      type: Number,
      require: [true, "age is required"],
    },

    Work_Details: {
      type: String,
    },
  },
  { timestamps: true }
);

// we want before saving the password to the database , we are encrypting the password
userschema.pre('save' ,async function(next){

    // if password is not chanegd/entered , we will move forward 
    if(!this.ismodified("password")) return next();

    // if password is entered/updated , we will encrypt the password 
    this.password= bcrypt.hash(this.password , 10)
});


// we are adding a function into the userschema 
userschema.methods.isPasswordCorrect= async function (enteredPassword){

    // we ae checking if the login password is correct or not 
    return bcrypt.compare(enteredPassword , this.password)

}


userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
      {
          _id: this._id,
          email: this.email,
          username: this.username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
  )
}
userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
      {
          _id: this._id,
          
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
  )
}




export const User = mongoose.model("User", userschema);