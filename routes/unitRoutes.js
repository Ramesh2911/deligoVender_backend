import express from 'express';
import {
   getUnits,
}
   from '../controllers/unitController.js';

const unitRoutes = express.Router();
unitRoutes.get('/get-units', getUnits);

export default unitRoutes;