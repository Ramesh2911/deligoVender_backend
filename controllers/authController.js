import { adminCookie } from '../utils/cookies.js';
import bcrypt from 'bcrypt';
import con from '../db/db.js';

// =====login======
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: 'Email and password are required',
      });
    }

    const [rows] = await con.query(
      `SELECT * FROM hr_users WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        status: false,
        message: 'Invalid credentials',
      });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        status: false,
        message: 'Invalid credentials',
      });
    }

    adminCookie(
      process.env.JWT_SECRET,
      user,
      res,
      `${user.first_name} ${user.last_name} logged in`
    );

  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({
      status: false,
      message: 'Server error',
    });
  }
};

//======logout======
export const logout = async (req, res) => {
  try {
    res.clearCookie('admin_token', {
      httpOnly: true,
      sameSite: 'none',
      secure: true
    });

    return res.status(200).json({
      status: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout Error:', error.message);
    res.status(500).json({
      status: false,
      message: 'Server error during logout',
    });
  }
};

//======country list ======
export const getCountries = async (req, res) => {
  try {
    const [rows] = await con.query('SELECT * FROM hr_countries WHERE is_active = 1');

    return res.status(200).json({
      status: true,
      message: 'Active countries fetched successfully',
      data: rows,
    });
  } catch (error) {
    console.error('Get Active Countries Error:', error.message);
    return res.status(500).json({
      status: false,
      message: 'Server error while fetching active countries',
    });
  }
};
