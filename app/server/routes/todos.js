const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();

const Todo = require('../models/Todo');

// @route   GET api/todos
// @desc    Get all todos
// @access  Public
router.get('/', async (req, res) => {
	try {
		const todos = await Todo.find().sort({ date: -1 });
		res.json(todos);
	} catch (err) {
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
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array(),
			});
		}
		try {
			const newTodo = new Todo({
				text: req.body.text,
			});
			const todo = await newTodo.save();
			res.json(todo);
		} catch (err) {
			console.log(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route   POST api/todos/:id/completed
// @desc    Mark todo as completed
// @access  Public
router.post('/:id/completed', async (req, res) => {
	try {
		const todo = await Todo.findById(req.params.id);

		if (!todo === 'ObjectId') {
			return res.status(404).json({ msg: 'Not Found' });
		} else if (todo.isCompleted === true) {
			return res.status(400).json({ msg: 'Already Completed' });
		}

		todo.isCompleted = true;

		await todo.save();

		res.json(todo);
	} catch (err) {
		console.log(err.message);
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Not Found' });
		}
		res.status(500).send('Server Error');
	}
});

// @route   DELETE api/todos/:id
// @desc    Delete a todo
// @access  Public
router.delete('/:id', async (req, res) => {
	try {
		const todo = await Todo.findById(req.params.id);

		if (!todo) {
			return res.status(404).json({ msg: 'Not Found' });
		}

		await todo.deleteOne();  

		res.json({ msg: 'Successfully Removed', id: req.params.id });
	} catch (err) {
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
	[check('todo', 'Todo description is required').not().isEmpty()],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { todo, isCompleted } = req.body;

		const todoFields = {};

		if (todo) todoFields.todo = todo;
		if (isCompleted === false || true) todoFields.isCompleted = isCompleted;

		try {
			let todo = await Todo.findById(req.params.id);

			if (!todo) return res.status(404).json({ msg: 'Not Found' });

			todo = await Todo.findByIdAndUpdate(
				req.params.id,
				{ $set: todoFields },
				{ new: true }
			);

			res.json(todo);
		} catch (err) {
			console.log(err.message);
			res.status(500).send('Server Error');
		}
	}
);

module.exports = router;
