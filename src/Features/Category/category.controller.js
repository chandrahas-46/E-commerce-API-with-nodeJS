import db from "../../Config/pg.config.js";

export default class CategoryController {
    async addCategory(req, res) {
        const { name } = req.body;
        try {
            const query = `
                INSERT INTO categories (name)
                VALUES ($1)
                RETURNING *;
            `;
            const newCategory = await db.query(query, [name]);

            res.status(201).json({
                success: true,
                category: newCategory.rows[0]
            });
        }
        catch (error) {
            console.error('Error in Add Category', error);
            res.status(500).send({
                success: false,
                message: 'Error in Add Category'
            });
        }
    }

    async getAllCategory(req, res) {
        try {
            const query = `
                SELECT * FROM categories;
            `;
            const AllCategory = await db.query(query);

            res.status(200).json({
                success: true,
                categories: AllCategory.rows
            });
        }
        catch (error) {
            console.error('Error in Get Category', error);
            res.status(500).send({
                success: false,
                message: 'Error in Get Category'
            });
        }
    }
}

// const create = async({name}) => {
//     const query = `
//         INSERT INTO categories (name)
//         VALUES ($1)
//         RETUENING *;
//     `;
//     const result = await db.query(query, [name]);

//     return result.rows[0];
// }

// const findOne = async(id) => {
//     const query = `
//         SELECT * FROM
//             categories
//         WHERE
//             id = &1;
//     `;
//     const result = await db.query(query, [+id]);

//     return result.rows[0];
// }

// const findAll = async() => {
//     const query = `
//         SELECT * FROM
//             categories;
//     `;
//     const result = await db.query(query);

//     return result.rows;
// }

// const updateOne = async(id, {name}) => {
//     const query = `
//         UPDATE
//             categories
//         SET
//             name = $2
//         WHERE
//             id = &1
//         RETUENING *;
//     `;
//     const result = await db.query(query, [+id, name]);

//     return result.rows[0];
// }

// const deleteOne = async(id) => {
//     const query = `
//         DELETE FROM
//             categories
//         WHERE
//             id = &1
//         RETUENING *;
//     `;
//     const result = await db.query(query, [+id]);

//     return result.rows[0];
// }

// export default {create, updateOne, findAll, findOne, deleteOne};