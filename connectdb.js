import { MongoClient } from "mongodb";
export async function connectDB() {
  try {
    const client = await MongoClient.connect("mongodb+srv://hmin1867:g3UcfIxUVle9uVLt@cluster0.qzptoj5.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true });
    await client.connect();
    const db = client.db("Lesson");
    // const collection = db.collection("myFirstCollection");
    return db;
  }
  catch(err){
    console.log(err);
}
}