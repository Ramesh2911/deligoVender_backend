import express from 'express';
import {
   mainCategories,
   subCategories
}
   from '../controllers/categoryController.js';

const categoryRoutes = express.Router();
categoryRoutes.get('/mainCategories', mainCategories);
categoryRoutes.get('/subCategories', subCategories);

export default categoryRoutes;