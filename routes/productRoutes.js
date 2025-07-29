import express from 'express';
import { adminAuth } from '../middleware/auth.js';

import {
   addProduct,
   getProductsByVendor
}
   from '../controllers/productController.js';

const productRoutes = express.Router();
productRoutes.post('/addProduct', addProduct);
productRoutes.get('/products-by-vendor', getProductsByVendor);

export default productRoutes;
