// 1. Import express.
import express from 'express';
import ProductController from './product.controller.js';

// 2. Initialize Express router.
const productRouter = express.Router();
const productController = new ProductController();

// All the paths to the controller methods.
// localhost/api/products 
productRouter.post('/', productController.addProduct);
productRouter.get('/category/:id', productController.getProducts);
productRouter.get('/:id', productController.getOneProduct);
productRouter.delete('/:id', productController.deleteProduct);

export default productRouter;
