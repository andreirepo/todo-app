import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import * as jwt from 'jsonwebtoken';
import User from '../models/User';
import { auth, AuthRequest } from '../middleware/auth';

const router = Router();

// Generate JWT token
const generateToken = (userId: string): string => {
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.sign({ userId }, jwtSecret, { expiresIn: '7d' });
};

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/auth/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, email, password } = req.body;

    try {
      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ msg: 'User already exists' });
        return;
      }

      // Create new user
      user = new User({
        name,
        email,
        password
      });

      await user.save();

      // Generate token
      const token = generateToken(user._id.toString());

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (err: any) {
      console.error('Registration error:', err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/auth/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ msg: 'Invalid credentials' });
        return;
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(400).json({ msg: 'Invalid credentials' });
        return;
      }

      // Generate token
      const token = generateToken(user._id.toString());

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (err: any) {
      console.error('Login error:', err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
router.get('/auth/me', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    res.json(user);
  } catch (err: any) {
    console.error('Get user error:', err.message);
    res.status(500).send('Server Error');
  }
});

export default router;