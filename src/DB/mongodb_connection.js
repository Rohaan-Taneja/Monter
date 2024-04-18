import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();


const DB_Connection_Function = async ()=>{

    try {
        await mongoose.connect(`${process.env.MONGODB_CONNECTION_URL}`);
        console.log("connection established");
        
    } catch (error) {
        console.log("error is coming up in db connection ", error);
        
    }
}
export default DB_Connection_Function;