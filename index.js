import "dotenv/config";
import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

const app = express();
const port = process.env.PORT || 500;
// middleware

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_DB_URL);

export async function connectToMongoDB() {
  try {
    await client.connect();
    const database = client.db("pizzaHub_db");

    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});
connectToMongoDB();
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
