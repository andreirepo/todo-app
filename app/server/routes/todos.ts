import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import Todo from '../models/Todo';

const router = Router();

// @route   GET api/todos
// @desc    Get all todos
// @access  Public
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const todos = await Todo.find().sort({ date: -1 });
    res.json(todos);
  } catch (err: any) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/todos
// @desc    Create a todo
// @access  Public
router.post(
  '/',
  [check('text', 'Todo description is required').not().isEmpty()],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const newTodo = new Todo({ text: req.body.text });
      const todo = await newTodo.save();
      res.json(todo);
    } catch (err: any) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST api/todos/:id/completed
// @desc    Mark todo as completed
// @access  Public
router.post('/:id/completed', async (req: Request, res: Response): Promise<void> => {
  try {
    const todo = await Todo.findById(req.params.id);
    
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

// @route   DELETE api/todos/:id
// @desc    Delete a todo
// @access  Public
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const todo = await Todo.findById(req.params.id);

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

// @route   PUT api/todos/:id
// @desc    Update todo
// @access  Public
router.put(
  '/:id',
  [check('text', 'Todo description is required').not().isEmpty()],
  async (req: Request<{id: string}, {}, {text: string, isCompleted?: boolean}>, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { text, isCompleted } = req.body;
    const todoFields: { text?: string; isCompleted?: boolean } = {};

    if (text) todoFields.text = text;
    if (typeof isCompleted === 'boolean') todoFields.isCompleted = isCompleted;

    try {
      const todo = await Todo.findByIdAndUpdate(
        req.params.id,
        { $set: todoFields },
        { new: true }
      );

      if (!todo) {
        res.status(404).json({ msg: 'Not Found' });
        return;
      }
      res.json(todo);
      
    } catch (err: any) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

export default router;
