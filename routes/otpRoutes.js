import express from 'express';
import {
   sendOTP,
   verifyOTP
}
   from '../controllers/otpController.js';

const otpRoutes = express.Router();
otpRoutes.post('/userphoneverifiy', sendOTP);
otpRoutes.post('/otpvarification', verifyOTP);

export default otpRoutes;
