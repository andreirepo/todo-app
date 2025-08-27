const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// MongoDB connection string (from environment)
const MONGODB_URI = process.env.MONGODB_URI;

// User model (simplified for Lambda)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

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

// Generate JWT token
const generateToken = (userId) => {
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.sign({ userId }, jwtSecret, { expiresIn: '7d' });
};

// Validate input
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

exports.handler = async (event) => {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Parse the request
    const { httpMethod, path, body: rawBody, headers } = event;
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

    // Extract route from path
    const route = path.replace('/api/auth/', '');

    switch (`${httpMethod}-${route}`) {
      case 'POST-register':
        return await handleRegister(body, corsHeaders);
      case 'POST-login':
        return await handleLogin(body, corsHeaders);
      case 'GET-me':
        return await handleGetUser(headers, corsHeaders);
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
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

// Register handler
const handleRegister = async (body, corsHeaders) => {
  const { name, email, password } = body;

  // Validation
  if (!name || !email || !password) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ errors: [{ msg: 'All fields are required' }] })
    };
  }

  if (!validateEmail(email)) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ errors: [{ msg: 'Please include a valid email' }] })
    };
  }

  if (password.length < 6) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ errors: [{ msg: 'Password must be at least 6 characters' }] })
    };
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ msg: 'User already exists' })
      };
    }

    // Create new user
    user = new User({ name, email, password });
    await user.save();

    // Generate token
    const token = generateToken(user._id.toString());

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
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

// Login handler
const handleLogin = async (body, corsHeaders) => {
  const { email, password } = body;

  // Validation
  if (!email || !password) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ errors: [{ msg: 'Email and password are required' }] })
    };
  }

  if (!validateEmail(email)) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ errors: [{ msg: 'Please include a valid email' }] })
    };
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ msg: 'Invalid credentials' })
      };
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ msg: 'Invalid credentials' })
      };
    }

    // Generate token
    const token = generateToken(user._id.toString());

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
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

// Get current user handler
const handleGetUser = async (headers, corsHeaders) => {
  try {
    // Extract token from Authorization header
    const authHeader = headers.Authorization || headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ msg: 'No token, authorization denied' })
      };
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.userId).select('-password');
    
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