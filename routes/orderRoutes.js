import express from 'express';
import {
   orderDetails,
}
   from '../controllers/orderController.js';

const orderRoutes = express.Router();
orderRoutes.get('/orders', orderDetails);

export default orderRoutes;