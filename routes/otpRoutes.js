import express from 'express';
import {
   sendOTP,
}
   from '../controllers/otpController.js';

const otpRoutes = express.Router();
otpRoutes.post('/userphoneverifiy', sendOTP);

export default otpRoutes;