import { MongoClient } from "mongodb";
const client = new MongoClient("mongodb+srv://minmin:t4YETX8ZSX8uzTaj@cluster0.ok2f5fy.mongodb.net/?retryWrites=true&w=majority");


export async function connectDB() {
  try {
    await client.connect();
    const db = client.db("Lesson");
    console.log("Connected to Database");
    return db;
  }
  catch(err){
    console.log(err);
    throw new Error("Unable to Connect to Database");
}
}
export async function closeDB() {
  try {
    // close the connection
    await client.close();
  }
  catch(err){
    console.log(err);
    throw new Error("Unable to close the Database");
}
} 