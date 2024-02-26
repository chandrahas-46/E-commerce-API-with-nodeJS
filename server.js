// 1. Import libraries
import express from "express";
import userRouter from "./src/Features/User/user.router.js";
import categoryRouter from "./src/Features/Category/category.router.js";
import productRouter from "./src/Features/Product/product.router.js";
import cartRouter from "./src/Features/Cart/cart.router.js";
import jwtAuth from "./src/Middlewares/jwt.middleware.js";
import orderRouter from "./src/Features/Order/order.router.js";

// 2. create server
const server = express(); 
server.use(express.json());

server.use("/api/users", userRouter);
server.use("/api/categories", categoryRouter);
server.use("/api/products", productRouter);
server.use("/api/cart", jwtAuth, cartRouter);
server.use("/api/order", jwtAuth, orderRouter);

// 3. Default request
server.get('/', (req, res) => {
    res.send({ info: "Welcome to the E-commmerce Application Server" })
});


// 4. Middleware to handle 404 requests
server.use((req, res) => {
    res.status(404).send("API not found. Please check your documentation for more information at localhost:3200/api-docs");
    // [localhost:3200/api-docs]: swagger link
})
 
export default server;