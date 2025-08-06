import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
   addProduct,
   updateProduct,
   getProductsByVendor
}
   from '../controllers/productController.js';

const productRoutes = express.Router();
productRoutes.post('/addProduct', verifyToken, addProduct);
productRoutes.put('/updateProduct/:pid', verifyToken, updateProduct);
productRoutes.get('/products-by-vendor', verifyToken, getProductsByVendor);

export default productRoutes;
