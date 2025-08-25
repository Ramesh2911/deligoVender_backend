import express from 'express';
import {
   login,
   logout,
   getCountries,
   createAcount,
   updateUserAccount,
   sendResetOtp,
   resendResetOtp,
   verifyResetOtp,
   resetPassword,
   forgotPasswordPhone,
   updatePassword
}
   from '../controllers/authController.js';
import multer from 'multer';
import { verifyToken } from '../middleware/auth.js';

const authRoutes = express.Router();

const upload = multer();

authRoutes.post('/createuseraccount', upload.none(), createAcount);
authRoutes.put('/useraccountupdate', upload.none(), updateUserAccount);
authRoutes.post('/login', login);
authRoutes.post('/logout', verifyToken, logout);
authRoutes.post('/reset-password-otp', sendResetOtp);
authRoutes.post('/resend-reset-otp', resendResetOtp);
authRoutes.post('/verify-reset-otp', verifyResetOtp);
authRoutes.put('/reset-password', resetPassword);
authRoutes.get('/country-list', getCountries);
authRoutes.post('/forgot-password-phone', forgotPasswordPhone);
authRoutes.put("/update-password", updatePassword);

export default authRoutes;