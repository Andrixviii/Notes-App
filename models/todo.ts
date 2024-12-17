import mongoose, { Schema, Document } from "mongoose";

export interface ListItem {
  id: string;
  content: string;
  isCompleted: boolean;
  time?: string | null;
  note?: string | null;
}

export interface Todo extends Document {
  title: string;
  lists: ListItem[];
}

const ListItemSchema = new Schema<ListItem>({
  id: { type: String, required: true },
  content: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  time: { type: String, default: null },
  note: { type: String, default: null },
});

const TodoSchema = new Schema<Todo>(
  {
    title: { type: String, required: true },
    lists: [ListItemSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Todo || mongoose.model<Todo>("Todo", TodoSchema);
