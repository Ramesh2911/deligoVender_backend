import express from 'express';
import {
   orderDetails,
   updateOrderStatus
}
   from '../controllers/orderController.js';
import { verifyToken } from '../middleware/auth.js';

const orderRoutes = express.Router();
orderRoutes.get('/orders', verifyToken, orderDetails);
orderRoutes.put('/update-order-status', verifyToken, updateOrderStatus);

export default orderRoutes;