import { Router, Response } from 'express';
import { check, validationResult } from 'express-validator';
import Todo from '../models/TodoWithUser';
import { auth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/todo - Get all todos for the authenticated user
router.get('/api/todo', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const todos = await Todo.find({ userId: req.user?.id }).sort({ date: -1 });
    res.json(todos);
  } catch (err: any) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// POST /api/todo - Create a todo for the authenticated user
router.post(
  '/api/todo',
  [auth, check('text', 'Todo description is required').not().isEmpty()],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const newTodo = new Todo({ 
        text: req.body.text,
        userId: req.user?.id
      });
      const todo = await newTodo.save();
      res.json(todo);
    } catch (err: any) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// POST /api/todo/:id/completed - Mark todo as completed
router.post('/api/todo/:id/completed', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user?.id });
    
    if (!todo) {
      res.status(404).json({ msg: 'Todo not found' });
      return;
    }

    if (todo.isCompleted) {
      res.status(400).json({ msg: 'Todo already completed' });
      return;
    }

    todo.isCompleted = true;
    await todo.save();
    res.json(todo);
    
  } catch (err: any) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      res.status(404).json({ msg: 'Invalid ID format' });
      return;
    }
    res.status(500).send('Server Error');
  }
});

// DELETE /api/todo/:id - Delete a todo
router.delete('/api/todo/:id', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user?.id });

    if (!todo) {
      res.status(404).json({ msg: 'Not Found' });
      return;
    }

    await todo.deleteOne();  
    res.json({ msg: 'Successfully Removed', id: req.params.id });
    
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({  
      error: 'Server Error',
      details: err.message
    });
  }
});

export default router;