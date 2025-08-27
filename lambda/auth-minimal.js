const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

// Simple in-memory rate limiting (resets on cold start)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // Max 10 registration attempts per minute per IP

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

// Generate JWT token
const generateToken = (userId) => {
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.sign({ userId }, jwtSecret, { expiresIn: '7d' });
};

// Validate email
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Rate limiting check
const checkRateLimit = (ip) => {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  // Clean old entries
  for (const [key, timestamp] of rateLimitMap.entries()) {
    if (timestamp < windowStart) {
      rateLimitMap.delete(key);
    }
  }
  
  // Count requests for this IP in current window
  const ipRequests = Array.from(rateLimitMap.entries())
    .filter(([key, timestamp]) => key.startsWith(ip + ':') && timestamp >= windowStart)
    .length;
  
  if (ipRequests >= MAX_REQUESTS_PER_WINDOW) {
    return false; // Rate limited
  }
  
  // Record this request
  rateLimitMap.set(`${ip}:${now}`, now);
  return true; // Allow request
};

exports.handler = async (event) => {
  try {
    const { db } = await connectToDatabase();
    
    const { httpMethod, path, body: rawBody, headers } = event;
    const body = JSON.parse(rawBody || '{}');
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    };

    if (httpMethod === 'OPTIONS') {
      return { statusCode: 200, headers: corsHeaders, body: '' };
    }

    // Get client IP for rate limiting
    const clientIP = event.requestContext?.identity?.sourceIp || 'unknown';

    const route = path.replace('/auth/', '');

    switch (`${httpMethod}-${route}`) {
      case 'POST-register':
        // Apply rate limiting to registration
        if (!checkRateLimit(clientIP)) {
          return {
            statusCode: 429,
            headers: corsHeaders,
            body: JSON.stringify({ 
              msg: 'Too many registration attempts. Please try again later.' 
            })
          };
        }
        return await handleRegister(db, body, corsHeaders);
      case 'POST-login':
        return await handleLogin(db, body, corsHeaders);
      case 'GET-me':
        return await handleGetUser(db, headers, corsHeaders);
      default:
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Route not found' })
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

const handleRegister = async (db, body, corsHeaders) => {
  const { name, email, password } = body;

  // Enhanced validation
  if (!name || !email || !password || 
      password.length < 6 || password.length > 128 ||
      name.length > 100 || email.length > 254 ||
      !validateEmail(email)) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ errors: [{ msg: 'Invalid input' }] })
    };
  }

  // Basic input sanitization
  const sanitizedName = name.trim().substring(0, 100);
  const sanitizedEmail = email.trim().toLowerCase().substring(0, 254);

  try {
    const existingUser = await db.collection('users').findOne({ email: sanitizedEmail });
    if (existingUser) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ msg: 'User already exists' })
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.collection('users').insertOne({
      name: sanitizedName,
      email: sanitizedEmail,
      password: hashedPassword,
      createdAt: new Date()
    });

    const token = generateToken(result.insertedId.toString());

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        token,
        user: { id: result.insertedId, name, email }
      })
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};

const handleLogin = async (db, body, corsHeaders) => {
  const { email, password } = body;

  if (!email || !password || !validateEmail(email)) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ errors: [{ msg: 'Invalid input' }] })
    };
  }

  try {
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ msg: 'Invalid credentials' })
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ msg: 'Invalid credentials' })
      };
    }

    const token = generateToken(user._id.toString());

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        token,
        user: { id: user._id, name: user.name, email: user.email }
      })
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};

const handleGetUser = async (db, headers, corsHeaders) => {
  try {
    const authHeader = headers.Authorization || headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ msg: 'No token provided' })
      };
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    
    const decoded = jwt.verify(token, jwtSecret);
    const { ObjectId } = require('mongodb');
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { password: 0 } }
    );
    
    if (!user) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ msg: 'User not found' })
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(user)
    };
  } catch (error) {
    console.error('Get user error:', error);
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ msg: 'Token is not valid' })
    };
  }
};