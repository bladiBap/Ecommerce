const {Pool} = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'root',
    database: 'Webdb',
    port: '5432'
});
module.exports = {
    pool: pool
};