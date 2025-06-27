import mongoose from "mongoose";



/**
 * Establishes a connection to the MongoDB database using the URI
 * stored in the environment variables. It logs a success message
 * or any connection errors to the console.
 */
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Database Connected");
  } catch (error) {
    console.log("DB Error: " + error);
  }
};

export default dbConnection;
