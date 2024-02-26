// 1. Import express.
import express from 'express';
import CategoryController from './category.controller.js';

// 2. Initialize Express router.
const categoryRouter = express.Router();
const categoryController = new CategoryController();

// All the paths to the controller methods.
// localhost/api/categories 
categoryRouter.post('/', categoryController.addCategory);
categoryRouter.get('/', categoryController.getAllCategory);

export default categoryRouter;
