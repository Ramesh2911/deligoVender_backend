import express from 'express';
import { adminAuth } from '../middleware/auth.js';

import {
   addProduct,
   updateProduct,
   getProductsByVendor
}
   from '../controllers/productController.js';

const productRoutes = express.Router();
productRoutes.post('/addProduct', addProduct);
productRoutes.put('/updateProduct/:pid', updateProduct);
productRoutes.get('/products-by-vendor', getProductsByVendor);

export default productRoutes;
