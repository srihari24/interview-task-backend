const pg = require('pg');
 const pool = new pg.Pool({
     user: "postgres",
     host:'localhost',
     database: 'ssss',
     password : 'root',
     port: '5432',
 })

 module.exports=pool;