# E-commerce-API-with-nodeJS
This is an e-commerce application REST API that provides endpoints for user authentication, product management, cart management, and order management. And ensuring the cart and order using JWT.

## Features

- User registration
- User login
- Add Category and Get Categories
- Product creation, deletion, and retrieval with product id and category id
- Cart creation, update, deletion, and retrieval
- Order creation, update, history, and details
- JWT-based authentication

## Tech Stack
**Backend:**
- Node.js
- Express.js
- Postgresql
- JWT

**Data Storage:** 
- Postgresql

**User Authentication:**
- JSON Web Tokens (JWT)
## API Reference

#### User Authentication
- `POST /api/users/signup` - Register a new user.
- `POST /api/users/signin` -    Login with an existing user.

#### Category
- `POST /api/categories` - Create a new Category.
- `GET /api/categories` -    Get all categories.

#### Products
- `POST /api/products` -    Create a new product.
- `GET /api/products/category/:id` -    Get all products by Category ID .
- `GET /api/products/:id` -   Get a single product by ID .
- `DELETE /api/products/:id` -   Delete a product by ID .

#### Cart
- `POST /api/cart` -    Create a new cart item for a product.
- `GET /api/cart` -    Get all cart items for a specific user.
- `PATCH /api/cart/:id` -   Update a cart item by ID.
- `DELETE /api/cart/:id` -   Delete a cart item by ID.

#### Order
- `POST /api/order` -    Create an order .
- `PATCH /api/order/:id` -   Update an order by ID.
- `GET /api/order` -   Get an user orders history.
- `GET /api/order/:id` -   Get an user orders history details by ID.


