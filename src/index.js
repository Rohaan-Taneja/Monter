import dotenv from "dotenv";
import DB_Connection_Function from "./DB/mongodb_connection.js";
import app from "./app.js";

dotenv.config();


//calling database connection function  
DB_Connection_Function()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server running on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log("Error connecting to the database:", error);
  });

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })
