import express from 'express';
import {
   login,
   logout,
   getCountries,
   createAcount,
   updateUserAccount
}
   from '../controllers/authController.js';
import { adminAuth } from '../middleware/auth.js';
import multer from 'multer';

const authRoutes = express.Router();

const upload = multer();

authRoutes.post('/createuseraccount', upload.none(), createAcount);
authRoutes.put('/useraccountupdate', upload.none(), updateUserAccount);
authRoutes.post('/login', login);
authRoutes.post('/logout', logout);
authRoutes.get('/country-list', getCountries);

export default authRoutes;
