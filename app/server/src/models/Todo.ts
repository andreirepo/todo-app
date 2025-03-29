import mongoose from 'mongoose';

interface ITodo extends mongoose.Document {
  text: string;
  isCompleted: boolean;
  date: Date;
}

const TodoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

const Todo = mongoose.model<ITodo>('Todo', TodoSchema);
export default Todo;