import express from 'express';
import {
   vendorStats,
   updateShopStatus
}
   from '../controllers/dashboardController.js';
import { verifyToken } from '../middleware/auth.js';

const dashboardRoutes = express.Router();
dashboardRoutes.get('/vendor-stats', verifyToken, vendorStats);
dashboardRoutes.put('/shop-status', verifyToken, updateShopStatus);

export default dashboardRoutes;
