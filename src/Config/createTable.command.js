// Create the database if it doesn't exist
export const createDatabase = `
    CREATE DATABASE IF NOT EXISTS ecommerce;
`;

// ALTER TABLE users
// ALTER COLUMN created_at SET DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'IST');
// ALTER COLUMN updated_at SET DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'IST');

// ALTER TABLE products
// ALTER COLUMN created_at SET DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'IST');
// ALTER COLUMN updated_at SET DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'IST');

// ALTER TABLE cart
// ALTER COLUMN created_at SET DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'IST');
// ALTER COLUMN updated_at SET DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'IST');

// ALTER TABLE orders
// ALTER COLUMN created_at SET DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'IST');
// ALTER COLUMN updated_at SET DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'IST');

// ALTER TABLE order_items
// ALTER COLUMN created_at SET DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'IST');
// ALTER COLUMN updated_at SET DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'IST');

// User table
export const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(250) NOT NULL,
        last_name VARCHAR(250) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
`;

// Category table
export const createCategoryTableQuery = `
    CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    )
`;

// Product table
export const createProductTableQuery = `
    CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        description TEXT,
        category_id INTEGER REFERENCES categories(id),
        availability BOOLEAN NOT NULL DEFAULT true,
        quantity INTEGER NOT NULL DEFAULT 10,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

// Cart table
export const createCartTableQuery = `
    CREATE TABLE IF NOT EXISTS cart (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        total_price NUMERIC(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

// export const createCartTableQuery = `
//     CREATE TABLE IF NOT EXISTS carts (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER UNIQUE,
//         created_at TIMESTAMP DEFAULT NOW(),
//         updated_at TIMESTAMP DEFAULT NOW()
//     )
// `;

// export const createCartItemTableQuery = `
//     CREATE TABLE IF NOT EXISTS cart_items (
//         cart_id INTEGER NOT NULL REFERENCES carts(id),
//         product_id INTEGER NOT NULL,
//         quantity INTEGER NOT NULL DEFAULT 1,
//         total_price NUMERIC(10, 2) NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         PRIMARY KEY("cart_id", "product_id")
//     )
// `;


// Order table
// export const createOrderTableQuery = `
//     CREATE TABLE IF NOT EXISTS orders (
//         id SERIAL PRIMARY KEY,
//         user_id INT NOT NULL,
//         order_details
//         total_price DECIMAL(10, 2) NOT NULL,
//         payment_mode VARCHAR(255) NOT NULL,
//         address VARCHAR(255) NOT NULL,
//         status VARCHAR(20) DEFAULT 'progress',
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )
// `;

// CREATE TYPE "order_status" AS ENUM (
//     'progress',
//     'shipped',
//     'delivered',
//     'canceled'
//   );

// Order table
export const createOrderTableQuery = `
    CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'progress',
        address VARCHAR(255) NOT NULL,
        payment_mode VARCHAR(255) NOT NULL,
        amount_charged DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

export const createOrderItemTableQuery = `
    CREATE TABLE IF NOT EXISTS order_items (
        order_id INTEGER NOT NULL REFERENCES orders(id),
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        total_price NUMERIC(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY("order_id", "product_id")
    )
`;

// CREATE TABLE "orders" (
//     "id" SERIAL PRIMARY KEY,
//     "user_id" int NOT NULL,
//     "status" order_status NOT NULL DEFAULT ('pending'),
//   );
  

// --psql -U postgres
// --\c jwtdb
// --\dt
// --heroku pg:psql