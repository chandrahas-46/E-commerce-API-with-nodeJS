// 1. Import express.
import express from 'express';
import UserController from './user.controller.js';

// 2. Initialize Express router.
const userRouter = express.Router();
const userController = new UserController();

// All the paths to the controller methods.

// localhost/api/users 
// userRouter.post('/signup', userController.signUp);
userRouter.post('/signup', (req, res)=>{
    userController.signUp(req, res);  
});
userRouter.post('/signin', (req, res)=>{
    userController.signIn(req, res);
});

export default userRouter;
