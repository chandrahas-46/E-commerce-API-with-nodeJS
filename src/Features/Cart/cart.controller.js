import db from "../../Config/pg.config.js";

export default class CartController {
    async addProductToCart(req, res) {
        const { product_id, quantity } = req.body;
        const user_id = req.userID;       //taken from JWT payload

        try {
            // Get [product details] to calculate total_price
            const productQuery = `
                SELECT price FROM products WHERE id = $1;
            `;
            const productResult = await db.query(productQuery, [product_id]);
            const product = productResult.rows[0];

            // Check if product is available
            if (product.length==0 || product.availability == false || product.quantity < quantity) {
                if(product.availability == false) {
                    return res.status(400).json({
                        success: false,
                        message: 'Product not available'
                    });
                }
                return res.status(400).json({
                    success: false,
                    message: 'Product quantity exceeded'
                });
            }

            // Calculate total_price for [cart item]
            const total_price = product.price * quantity;

            // [ Start transaction ] 
            await db.query('BEGIN');

            // Update [product quantity] in product table
            const updateProductQuery = `
                UPDATE products 
                SET quantity = quantity - $1 
                WHERE id = $2 
                RETURNING *;
            `;
            await db.query(updateProductQuery, [quantity, product_id]);

            // Add item to [ cart table ]
            const insertCartQuery = `
                INSERT INTO cart (product_id, user_id, quantity, total_price)
                VALUES ($1, $2, $3, $4) RETURNING *;
            `;
            const newCart = await db.query(insertCartQuery, [product_id, user_id, quantity, total_price]);

            // [ Commit transaction ]
            await db.query('COMMIT');

            res.status(201).send({
                success: true,
                message: 'Cart item added successfully',
                cart: newCart.rows[0]
            });
        }
        catch (error) {
            // [ Rollback transaction on error ]
            await db.query('ROLLBACK');
            console.error('Error in Add Product to cart', error);
            res.status(500).send({
                success: false,
                message: 'Error in Add Product to cart'
            });
        }
    }

    async viewCart(req, res) {
        const user_id = req.userID;       //taken from JWT payload
        try {
            const viewCartQuery = `
                SELECT * FROM cart WHERE user_id = $1;
            `;
            const cartItems = await db.query(viewCartQuery, [user_id]);

            res.status(200).send({
                success: true,
                cart: cartItems.rows
            });
        }
        catch (error) {
            console.error('Error in View Cart', error);
            res.status(500).send({
                success: false,
                message: 'Error in View Cart'
            });
        }
    }

    async updateCart(req, res) {
        const cart_id = req.params.id;  //cart_item id
        const { quantity } = req.body;
        // const user_id = req.userID;       //taken from JWT payload
        try {
            // Get [cart details] to update quantity
            const cartQuery = `
                SELECT product_id, quantity AS old_quantity FROM cart WHERE id = $1;
            `;
            const cartResult = await db.query(cartQuery, [cart_id]);
            const cart = cartResult.rows[0];
            // const { product_id, quantity: oldQuantity } = cartResult.rows[0];

            if (!cart) {
                return res.status(404).send({
                    success: false,
                    message: 'Cart item not found'
                });
            }

            // Get [ product details ] including price and availability
            const productQuery = `
                SELECT price, quantity, availability FROM products WHERE id = $1;
            `;
            const productResult = await db.query(productQuery, [cart.product_id]);
            const product = productResult.rows[0];

            if (!product || !product.availability) {
                return res.status(400).json({
                    success: false,
                    message: 'Product not available'
                });
            }

            // Calculate New total_price
            const total_price = product.price * quantity;

            // Check if product quantity is sufficient
            if (quantity > product.quantity) {
                return res.status(400).json({
                    success: false,
                    message: 'Quantity exceeded from product availability'
                });
            }

            // Start transaction
            await db.query('BEGIN');

            // Update product quantity in product table
            // const updateProductQuery = `
            //     UPDATE products 
            //     SET quantity = quantity - ($1 - $2) 
            //     WHERE id = $3 
            //     RETURNING *;
            // `;
            const updateProductQuery = `
                UPDATE products 
                SET quantity = quantity - (COALESCE($1, 0) - $2) 
                WHERE id = $3 
                RETURNING *;
            `;
            await db.query(updateProductQuery, [quantity, cart.old_quantity, cart.product_id]);

            // Update cart item in cart table
            const updateCartQuery = `
                UPDATE cart 
                SET quantity = $1, total_price = $2 
                WHERE id = $3 
                RETURNING *;
            `;
            const updatedCart = await db.query(updateCartQuery, [quantity, total_price, cart_id]);

            // Commit transaction
            await db.query('COMMIT');

            res.status(200).send({
                success: true,
                message: 'Cart item updated successfully',
                cart: updatedCart.rows[0]
            });
        }
        catch (error) {
            // [ Rollback transaction on error ]
            await db.query('ROLLBACK');
            console.error('Error in update cart', error);
            res.status(500).send({
                success: false,
                message: 'Error in update cart'
            });
        }
    }


    async deleteCart(req, res) {
        const cart_id = req.params.id;   //cart_item id
    
        try {
            // Get [ product_id and quantity ] of the cart item
            const cartQuery = `
                SELECT product_id, quantity FROM cart WHERE id = $1;
            `;
            const cartResult = await db.query(cartQuery, [cart_id]);
            const cart = cartResult.rows[0];
            // const { product_id, quantity } = cartResult.rows[0];

            if (!cart) {
                return res.status(404).json({
                    success: false,
                    message: 'Cart item not found'
                });
            }

            // Start transaction
            await db.query('BEGIN');
    
            // Update product quantity in product table
            const updateProductQuery = `
                UPDATE products SET quantity = quantity + $1 WHERE id = $2 RETURNING *;
            `;
            await db.query(updateProductQuery, [cart.quantity, cart.product_id]);
    
            // Delete cart item
            const deleteCartQuery = `
                DELETE FROM cart WHERE id = $1;
            `;
            await db.query(deleteCartQuery, [cart_id]);

            // [ Commit transaction ]
            await db.query('COMMIT');
    
            res.status(200).send({
                success: true,
                message: 'Cart item deleted successfully'
            });
        } catch (error) {
            // [ Rollback transaction on error ]
            await db.query('ROLLBACK');
            console.error('Error in Delete Cart Item', error);
            res.status(500).send({
                success: false,
                message: 'Error in Delete Cart Item'
            });
        }
    }
    
}