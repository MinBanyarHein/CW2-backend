import { MongoClient } from "mongodb";
export async function connectDB() {
  try {
    const client = await MongoClient.connect("mongodb+srv://minmin:t4YETX8ZSX8uzTaj@cluster0.ok2f5fy.mongodb.net/?retryWrites=true&w=majority");
    await client.connect();
    const db = client.db("Lesson");
    // const collection = db.collection("myFirstCollection");
    return db;
  }
  catch(err){
    console.log(err);
    throw new Error("Unable to Connect to Database");
}
finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  } 

}