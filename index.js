// Import libraries
import './env.js';
import server from './server.js';
import runDB from './src/Config/migration.js';

async function start() {
    await runDB();
  
    const PORT = process.env.PG_PORT || 5431;
    // 5. server listening
    server.listen(PORT, (err) => {
        if(err) console.log("server error on port 5431");
        console.log(`Server is running at ${PORT}`);
    })
}
  
start();
