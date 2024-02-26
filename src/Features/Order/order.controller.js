import db from "../../Config/pg.config.js";

// {
//     "status": "progress",
//     "address": "123 Main St, City, Country",
//     "payment_mode": "cash on delivery",
//     "items": [
//       {
//         "product_id": 1,
//         "quantity": 3
//       },
//       {
//         "product_id": 2,
//         "quantity": 4
//       }
//     ]
//   }
  

export default class OrderController {
    async placeOrder(req, res) {
        const { status, address, payment_mode, items } = req.body;
        const user_id = req.userID;       //taken from JWT payload

        try {
            // [ Start transaction ]
            await db.query('BEGIN'); 

            let totalAmount = 0;

            // Insert into [order table]
            const orderQuery = `
                INSERT INTO orders (user_id, status, address, payment_mode, amount_charged)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id;
            `;
            // Initialize amount_charged to 0
            const orderValues = [user_id, status, address, payment_mode, 0];
            const orderResult = await db.query(orderQuery, orderValues);
            const orderId = orderResult.rows[0].id;

            // Insert into [order_items table]
            for (const item of items) {
                const { product_id, quantity } = item;

                // Get [product details] to calculate total amount
                const productQuery = `
                    SELECT price FROM products WHERE id = $1;
                `;
                const productResult = await db.query(productQuery, [product_id]);
                const productPrice = productResult.rows[0].price;

                const total_price = productPrice * quantity;
                totalAmount += total_price;

                const orderItemQuery = `
                    INSERT INTO order_items (order_id, product_id, quantity, total_price)
                    VALUES ($1, $2, $3, $4)`;
                const orderItemValues = [orderId, product_id, quantity, total_price];
                await db.query(orderItemQuery, orderItemValues);
            }

            // Update [ amount_charged ] in the orders table
            const updateAmountChargedQuery = `
                UPDATE orders
                SET amount_charged = $1
                WHERE id = $2;
            `;
            const updateAmountChargedValues = [totalAmount, orderId];
            await db.query(updateAmountChargedQuery, updateAmountChargedValues);

            // [ Commit transaction ]
            await db.query('COMMIT');

            res.status(200).send({
                success: true,
                message: 'Order placed successfully',
                orderId: orderId
            });
        }
        catch (error) {
            // [ Rollback transaction on error ]
            await db.query('ROLLBACK');
            console.error('Error in order placed', error);
            res.status(500).send({
                success: false,
                message: 'Error in order placed'
            });
        }
    }

    async updateOrder(req, res) {
        const order_id = req.params.id;
        const { status, address, payment_mode } = req.body;
        const user_id = req.userID; // Taken from JWT payload

        try {
            // Check if the order belongs to the user
            const checkOrderQuery = `
                SELECT id, status, address, payment_mode
                FROM orders
                WHERE id = $1 AND user_id = $2;
            `;
            const checkOrderValues = [order_id, user_id];
            const orderResult = await db.query(checkOrderQuery, checkOrderValues);

            if (orderResult.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found or unauthorized'
                });
            }

            const currentOrder = orderResult.rows[0];

            // Update the order details if any attribute is changed
            const updatedOrder = {
                status: status || currentOrder.status,
                address: address || currentOrder.address,
                payment_mode: payment_mode || currentOrder.payment_mode
            };

            // Update the order details
            const updateOrderQuery = `
                UPDATE orders
                SET status = $1, address = $2, payment_mode = $3, updated_at = CURRENT_TIMESTAMP
                WHERE id = $4;
            `;
            const updateOrderValues = [updatedOrder.status, updatedOrder.address, updatedOrder.payment_mode, order_id];
            await db.query(updateOrderQuery, updateOrderValues);

            res.status(200).json({
                success: true,
                message: 'Order updated successfully'
            });
        }
        catch (error) {
            console.error('Error in order update', error);
            res.status(500).send({
                success: false,
                message: 'Error in order update'
            });
        }
    }

    async orderHistory(req, res) {
        const user_id = req.userID;       //taken from JWT payload
        try {
            const query = `
                SELECT * FROM orders
                WHERE user_id = $1
                ORDER BY created_at DESC;
            `;
            const values = [user_id];
            const result = await db.query(query, values);

            res.status(200).send({
                success: true,
                orders: result.rows
            });
        }
        catch (error) {
            console.error('Error in order history', error);
            res.status(500).send({
                success: false,
                message: 'Error in order history'
            });
        }
    }

    async orderDetails(req, res) {
        const order_id = req.params.id;

        try {
            const orderQuery = `
                SELECT id AS order_id, user_id, status, address, payment_mode, amount_charged, created_at updated_at
                FROM orders
                WHERE id = $1;
            `;
            const orderResult = await db.query(orderQuery, [order_id]);


            const orderItemQuery = `
                SELECT product_id, quantity, total_price
                FROM order_items
                WHERE order_id = $1;
            `;
            const orderItemsResult = await db.query(orderItemQuery, [order_id]);

            const orderDetails = {
                order_id: orderResult.rows[0].order_id,
                user_id: orderResult.rows[0].user_id,
                status: orderResult.rows[0].status,
                address: orderResult.rows[0].address,
                payment_mode: orderResult.rows[0].payment_mode,
                amount_charged: orderResult.rows[0].amount_charged,
                created_at: orderResult.rows[0].created_at,
                updated_at: orderResult.rows[0].updated_at,
                items: orderItemsResult.rows
            };

            res.status(200).send({
                success: true,
                order: orderDetails
            });
        }
        catch (error) {
            console.error('Error in order details', error);
            res.status(500).send({
                success: false,
                message: 'Error in order details'
            });
        }
    }
    
}



// Calculate total_price for each order item
// UPDATE order_items
// SET total_price = quantity * (SELECT price FROM products WHERE id = order_items.product_id);

// Calculate total amount charged for each order
// UPDATE orders
// SET amount_charged = (SELECT SUM(total_price) FROM order_items WHERE order_id = orders.id)
// WHERE id = $1; -- Use the specific order ID
