// import { createDatabase } from "./createTable.command.js";
import { createCategoryTableQuery } from "./createTable.command.js";
import { createUserTableQuery } from "./createTable.command.js";
import { createProductTableQuery } from "./createTable.command.js";
import { createCartTableQuery } from "./createTable.command.js";
import { createOrderTableQuery } from "./createTable.command.js";
import { createOrderItemTableQuery } from "./createTable.command.js";
import db from "./pg.config.js";

const runDB = async () => {
    console.log("Begin DB Migration");
    // use single client for transaction
    const client = await db.connect();
    try {
        await client.query('BEGIN');    // BEGIN Transaction
        // await client.query(createDatabase);
        await client.query(createCategoryTableQuery);
        await client.query(createUserTableQuery);
        await client.query(createProductTableQuery);
        await client.query(createCartTableQuery);
        await client.query(createOrderTableQuery);
        await client.query(createOrderItemTableQuery);
        await client.query('COMMIT');   // Commit Transaction
        console.log("END DB Migration");
    }
    catch (err) {
        await client.query('ROLLBACK'); // Rollback transaction
        console.log("DB Migration Failed");
        throw err
    }
    finally {
        client.release();
    }
    
}

export default runDB;