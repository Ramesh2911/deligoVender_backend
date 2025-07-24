import express from 'express';
import { login, logout } from '../controllers/authController.js';
import { adminAuth } from '../middleware/auth.js';

const authRoutes = express.Router();
authRoutes.post('/login', login);
authRoutes.post('/logout', logout);

export default authRoutes;