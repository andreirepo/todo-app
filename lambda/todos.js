const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// MongoDB connection string (from environment)
const MONGODB_URI = process.env.MONGODB_URI;

// Todo model (simplified for Lambda)
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
  userId: { type: String, required: true }
});

const Todo = mongoose.models.Todo || mongoose.model('Todo', todoSchema);

// Database connection helper
let cachedDb = null;
const connectToDatabase = async () => {
  if (cachedDb) return cachedDb;
  
  const connection = await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  cachedDb = connection;
  return connection;
};

// Auth middleware helper
const authenticateToken = (headers) => {
  const authHeader = headers.Authorization || headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.substring(7);
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  
  try {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded.userId;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

exports.handler = async (event) => {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Parse the request
    const { httpMethod, path, body: rawBody, headers, pathParameters } = event;
    const body = JSON.parse(rawBody || '{}');
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    };

    // Handle OPTIONS request for CORS
    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: ''
      };
    }

    // Authenticate user for all routes
    let userId;
    try {
      userId = authenticateToken(headers);
    } catch (error) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ msg: 'Authorization denied' })
      };
    }

    // Extract todo ID from path if present
    const todoId = pathParameters?.id;

    // Route handling
    switch (httpMethod) {
      case 'GET':
        return await handleGetTodos(userId, corsHeaders);
      case 'POST':
        if (todoId && path.includes('/completed')) {
          return await handleCompleteTodo(todoId, userId, corsHeaders);
        } else {
          return await handleCreateTodo(body, userId, corsHeaders);
        }
      case 'DELETE':
        return await handleDeleteTodo(todoId, userId, corsHeaders);
      default:
        return {
          statusCode: 405,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Lambda error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

// Get all todos for user
const handleGetTodos = async (userId, corsHeaders) => {
  try {
    const todos = await Todo.find({ userId }).sort({ date: -1 });
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(todos)
    };
  } catch (error) {
    console.error('Get todos error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};

// Create new todo
const handleCreateTodo = async (body, userId, corsHeaders) => {
  const { text } = body;

  if (!text || text.trim() === '') {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ errors: [{ msg: 'Todo description is required' }] })
    };
  }

  try {
    const newTodo = new Todo({ 
      text: text.trim(),
      userId 
    });
    
    const todo = await newTodo.save();
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(todo)
    };
  } catch (error) {
    console.error('Create todo error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};

// Mark todo as completed
const handleCompleteTodo = async (todoId, userId, corsHeaders) => {
  if (!todoId) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ msg: 'Todo ID is required' })
    };
  }

  try {
    const todo = await Todo.findOne({ _id: todoId, userId });
    
    if (!todo) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ msg: 'Todo not found' })
      };
    }

    if (todo.isCompleted) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ msg: 'Todo already completed' })
      };
    }

    todo.isCompleted = true;
    await todo.save();
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(todo)
    };
  } catch (error) {
    console.error('Complete todo error:', error);
    
    if (error.name === 'CastError') {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ msg: 'Invalid ID format' })
      };
    }
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};

// Delete todo
const handleDeleteTodo = async (todoId, userId, corsHeaders) => {
  if (!todoId) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ msg: 'Todo ID is required' })
    };
  }

  try {
    const todo = await Todo.findOne({ _id: todoId, userId });

    if (!todo) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ msg: 'Todo not found' })
      };
    }

    await todo.deleteOne();
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        msg: 'Successfully Removed', 
        id: todoId 
      })
    };
  } catch (error) {
    console.error('Delete todo error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Server Error',
        details: error.message 
      })
    };
  }
};