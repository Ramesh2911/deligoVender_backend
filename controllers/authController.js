import { adminCookie } from '../utils/cookies.js';
import bcrypt from 'bcrypt';
import con from '../db/db.js';

//=====createAcount=====
export const createAcount = async (req, res) => {
  try {
    const {
      prefix,
      first_name,
      last_name,
      password,
      email,
      country_id,
      country_code,
      mobile,
      address,
      pincode,
      latitude,
      longitude,
      profile_picture,
      passport,
    } = req.body;

    if (
      !first_name || !last_name || !password || !email ||
      !country_id || !country_code || !mobile || !address || !pincode
    ) {
      return res.status(400).json({
        status: false,
        message: 'All required fields must be provided.',
      });
    }

    const [existingUser] = await con.query(
      `SELECT id FROM hr_users WHERE email = ? OR mobile = ?`,
      [email, mobile]
    );

    if (existingUser.length > 0) {
      return res.status(401).json({
        status: false,
        message: 'User with this email or phone number already exists.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = `
      INSERT INTO hr_users (
        prefix, first_name, last_name, password, email,
        country_id, country_code, mobile, address, pincode,
        nif, latitude, longitude, role_id, built_in, exclude,
        profile_picture, passport, vehicle_type, is_login_active, is_active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', ?, ?, 4, 0, 0, ?, ?, 0, 'Y', 'Y')
    `;

    const insertValues = [
      prefix, first_name, last_name, hashedPassword, email,
      country_id, country_code, mobile, address, pincode,
      latitude, longitude, profile_picture, passport
    ];

    const [result] = await con.query(insertQuery, insertValues);

    return res.status(200).json({
      status: true,
      message: 'User registered successfully.',
      insertedId: result.insertId,
    });
  } catch (error) {
    console.error('Register Error:', error.message);
    return res.status(500).json({
      status: false,
      message: 'Server error while registering user.',
    });
  }
};

//======updateAccount=====
export const updateUserAccount = async (req, res) => {
  try {
    const {
      id,
      business_name,
      business_person,
      company_name,
      contact_mail,
      contact_mobile,
      business_type_id,
    } = req.body;

    if (!id) {
      return res.status(400).json({ status: false, message: 'User ID is required.' });
    }

    const query = `
      UPDATE hr_users SET
        business_name = ?,
        business_person = ?,
        company_name = ?,
        contact_mail = ?,
        contact_mobile = ?,
        business_type_id = ?
      WHERE id = ?
    `;

    const values = [
      business_name,
      business_person,
      company_name,
      contact_mail,
      contact_mobile,
      business_type_id,
      id,
    ];

    con.query(query, values, (err, result) => {
      if (err) {
        console.error('MySQL Error:', err);
        return res.status(500).json({ status: false, message: 'Database update failed.' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ status: false, message: 'No user found with given ID.' });
      }

      return res.status(200).json({ status: true, message: 'User updated successfully.' });
    });
  } catch (error) {
    console.error('Catch Error:', error);
    return res.status(500).json({ status: false, message: 'Internal server error.' });
  }
};

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
      `SELECT * FROM hr_users WHERE email = ? AND role_id = 4 AND is_active = 'Y'`,
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
    const [rows] = await con.query(
      `SELECT * FROM hr_countries WHERE phonecode > 0 AND is_active = '1' ORDER BY hr_countries.name DESC`
    );

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
