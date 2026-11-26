import "dotenv/config";
import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
const port = process.env.PORT || 5000;
// middleware

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_DB_URL);
const database = client.db("pizzaHub_db");
const usersCollection = database.collection("user");
const menuCollection = database.collection("menuItems");
export async function connectToMongoDB() {
  try {
    await client.connect();

    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});
// user-get
app.get("/users", async (req, res) => {
  const cursor = usersCollection.find();
  const result = await cursor.toArray();
  res.send(result);
});
// menu-post
app.post("/add-menu", async (req, res) => {
  const menu = req.body;
  const menuData = {
    ...menu,
    status: "Pending",
    createdAt: new Date(),
  };
  const result = await menuCollection.insertOne(menuData);
  res.send(result);
});
// add-menu-get
app.get("/add-menus", async (req, res) => {
  const cursor = menuCollection.find();
  const result = await cursor.toArray();
  res.send(result);
});
// add-menu-item by email
app.get("/my-menu-by-email/:email", async (req, res) => {
  const { email } = req.params;
  const result = await menuCollection.find({ vendorEmail: email }).toArray();
  res.send(result);
});

// update-my-menu
app.patch("/update-my-menu/:id", async (req, res) => {
  const { id } = req.params;
  const { _id, ...data } = req.body;
  const query = { _id: new ObjectId(id) };
  console.log("Backend form query", query);
  const result = await menuCollection.updateOne(query, {
    $set: data,
  });

  res.send(result);
});
connectToMongoDB();
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
