import mongoose, { Schema, Document } from "mongoose";

// Definisikan tipe ListItem
export interface ListItem {
  id: string;
  content: string;
  isCompleted: boolean;
}

// Definisikan tipe Todo yang mencakup ListItem[]
export interface Todo extends Document {
  title: string;
  lists: ListItem[];
}

// Definisikan schema untuk Todo
const ListItemSchema = new Schema<ListItem>({
  id: { type: String, required: true },
  content: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
});

const TodoSchema = new Schema<Todo>(
  {
    title: { type: String, required: true },
    lists: [ListItemSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Todo || mongoose.model<Todo>("Todo", TodoSchema);
