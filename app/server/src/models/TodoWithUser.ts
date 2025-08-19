import mongoose from 'mongoose';

interface ITodoWithUser extends mongoose.Document {
  text: string;
  isCompleted: boolean;
  date: Date;
  userId: string;
}

const TodoWithUserSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
  userId: { type: String, required: true }
}, {
  collection: 'todos'
});

export default mongoose.model<ITodoWithUser>('TodoWithUser', TodoWithUserSchema);