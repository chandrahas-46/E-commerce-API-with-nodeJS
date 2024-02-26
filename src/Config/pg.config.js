import pg from 'pg';
const { Pool } = pg;

let localPoolConfig = {
    host:'localhost',
    user:'postgres',
    password:'Chk@4401',
    database:'ecommerce',
    port:'5432',
    timezone:'IST'
    // host:process.env.PG_HOST,
    // user:process.env.PG_USER,
    // password:process.env.PG_PASSWORD,
    // database:process.env.PG_DATABASE,
    // port:process.env.PG_PORT
}

// const poolConfig = process.env.DATABASE_URL ? {
//     connectionString: process.env.DATABASE_URL,
//     ssl: { rejectUnauthorized: false }
// } : localPoolConfig;
// const pool = new Pool(poolConfig);

const db = new Pool(localPoolConfig);

//Set the timezone for the connection pool
db.on('connect', (client) => {
    client.query('SET TIME ZONE "Asia/Kolkata";', (err) => {
        if (err) {
            console.error('Error setting timezone:', err);
        }
    });
});


export default db;

