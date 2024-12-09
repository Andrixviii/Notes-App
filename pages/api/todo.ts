import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ObjectId } from "mongodb";

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://Users:user123@cluster0.w9jfl.mongodb.net/User_aunt?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "User_aunt";

const getDatabase = async () => {
  const client = new MongoClient(uri);
  await client.connect();
  return client.db(dbName);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDatabase();
  const collection = db.collection("todos");

  try {
    switch (req.method) {
      case "GET": {
        const todos = await collection.find({}).toArray();
        res.status(200).json(todos);
        break;
      }

      case "POST": {
        const { title, lists } = req.body;

        if (!title || !lists) {
          return res
            .status(400)
            .json({ message: "Title and lists are required" });
        }

        const result = await collection.insertOne({ title, lists });

        res.status(201).json({
          _id: result.insertedId,
          title,
          lists,
        });
        break;
      }

      case "DELETE": {
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ message: "Task ID is required" });
        }

        const result = await collection.deleteOne({
          _id: new ObjectId(id as string),
        });

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully" });
        break;
      }

      case "PATCH": {
        const { id } = req.query;
        const { listId, isCompleted } = req.body;

        if (!id || !listId) {
          return res
            .status(400)
            .json({ message: "Task ID and List ID are required" });
        }

        const result = await collection.updateOne(
          { _id: new ObjectId(id as string), "lists.id": listId },
          { $set: { "lists.$.isCompleted": isCompleted } }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Task or List not found" });
        }

        res.status(200).json({ message: "List status updated successfully" });
        break;
      }

      default:
        res.setHeader("Allow", ["GET", "POST", "DELETE", "PATCH"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error in API route:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
