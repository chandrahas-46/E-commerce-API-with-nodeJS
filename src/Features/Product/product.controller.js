import db from "../../Config/pg.config.js";

export default class ProductController {
    async addProduct(req, res) {
        const { title, price, description, category_id, availability, quantity } = req.body;
        try {
            const query = `
                INSERT INTO products (title, price, description, category_id, availability, quantity)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;
            `;
            const newProduct = await db.query(query, [title, price, description, category_id, availability, quantity]);

            res.status(201).json({
                success: true,
                product: newProduct.rows[0]
            });
        }
        catch (error) {
            console.error('Error in Add Product', error);
            res.status(500).send({
                success: false,
                message: 'Error in Add Product'
            });
        }
    }

    async getProducts(req, res) {
        const category_id = req.params.id;
        try {
            const query = `
                SELECT * FROM products WHERE category_id = $1;
            `;
            const productList = await db.query(query, [category_id]);

            res.status(200).json({
                success: true,
                products: productList.rows
            });
        }
        catch (error) {
            console.error('Error in Get Product by specific category', error);
            res.status(500).send({
                success: false,
                message: 'Error in Get Product by specific category'
            });
        }
    }

    async getOneProduct(req, res) {
        const id = req.params.id;
        try {
            const query = `
                SELECT * FROM products WHERE id = $1;
            `;
            const product = await db.query(query, [id]);

            if (product.rows.length === 0) {
                return res.status(404).send({
                    success: false,
                    message: 'Product not found'
                });
            } 
            else {
                res.status(200).send({
                    success: true,
                    product: product.rows
                });
            }
        }
        catch (error) {
            console.error('Error in Get Product by id', error);
            res.status(500).send({
                success: false,
                message: 'Error in Get Product by id'
            });
        }
    }

    async deleteProduct(req, res) {
        const product_id = req.params.id;
    
        try {
            // Delete product from the products table
            const deleteQuery = `
                DELETE FROM products WHERE id = $1;
            `;
            await db.query(deleteQuery, [product_id]);
    
            res.status(200).send({
                success: true,
                message: 'Product deleted successfully'
            });
        } catch (error) {
            console.error('Error in Delete Product', error);
            res.status(500).send({
                success: false,
                message: 'Error in Delete Product'
            });
        }
    }
}