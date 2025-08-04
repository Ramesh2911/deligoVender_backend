import express from 'express';
import {
   vendorStats,
   updateShopStatus
}
   from '../controllers/dashboardController.js';

const dashboardRoutes = express.Router();
dashboardRoutes.get('/vendor-stats', vendorStats);
dashboardRoutes.put('/shop-status', updateShopStatus);

export default dashboardRoutes;
