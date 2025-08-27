const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection
let cachedClient = null;
let cachedDb = null;

const connectToDatabase = async () => {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(process.env.MONGODB_URI, {
    maxPoolSize: 10,        // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  });
  
  await client.connect();

  const db = client.db();
  cachedClient = client;
  cachedDb = db;

  return { client, db };
};

// Auth middleware
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
    const { db } = await connectToDatabase();
    
    const { httpMethod, path, body: rawBody, headers, pathParameters } = event;
    const body = JSON.parse(rawBody || '{}');
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    };

    if (httpMethod === 'OPTIONS') {
      return { statusCode: 200, headers: corsHeaders, body: '' };
    }

    // Authenticate user
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

    const todoId = pathParameters?.id;

    switch (httpMethod) {
      case 'GET':
        return await handleGetTodos(db, userId, corsHeaders);
      case 'POST':
        if (todoId && path.includes('/completed')) {
          return await handleCompleteTodo(db, todoId, userId, corsHeaders);
        } else {
          return await handleCreateTodo(db, body, userId, corsHeaders);
        }
      case 'DELETE':
        return await handleDeleteTodo(db, todoId, userId, corsHeaders);
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
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

const handleGetTodos = async (db, userId, corsHeaders) => {
  try {
    const todos = await db.collection('todos').find({ userId }).sort({ date: -1 }).toArray();
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

const handleCreateTodo = async (db, body, userId, corsHeaders) => {
  const { text } = body;

  if (!text || text.trim() === '' || text.length > 500) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ errors: [{ msg: 'Todo description is required and must be under 500 characters' }] })
    };
  }

  try {
    // Check if user has too many todos (prevent spam)
    const userTodoCount = await db.collection('todos').countDocuments({ userId });
    if (userTodoCount >= 1000) {
      return {
        statusCode: 429,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Maximum number of todos reached (1000)' })
      };
    }

    const result = await db.collection('todos').insertOne({
      text: text.trim().substring(0, 500),
      isCompleted: false,
      date: new Date(),
      userId
    });
    
    const todo = await db.collection('todos').findOne({ _id: result.insertedId });
    
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

const handleCompleteTodo = async (db, todoId, userId, corsHeaders) => {
  if (!todoId) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ msg: 'Todo ID is required' })
    };
  }

  try {
    const todo = await db.collection('todos').findOne({ 
      _id: new ObjectId(todoId), 
      userId 
    });
    
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

    await db.collection('todos').updateOne(
      { _id: new ObjectId(todoId), userId },
      { $set: { isCompleted: true } }
    );
    
    const updatedTodo = await db.collection('todos').findOne({ _id: new ObjectId(todoId) });
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(updatedTodo)
    };
  } catch (error) {
    console.error('Complete todo error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};

const handleDeleteTodo = async (db, todoId, userId, corsHeaders) => {
  if (!todoId) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ msg: 'Todo ID is required' })
    };
  }

  try {
    const result = await db.collection('todos').deleteOne({ 
      _id: new ObjectId(todoId), 
      userId 
    });

    if (result.deletedCount === 0) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ msg: 'Todo not found' })
      };
    }
    
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
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};