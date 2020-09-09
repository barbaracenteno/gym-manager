const { Pool } = require('pg')

module.exports = new Pool({
    user: 'postgres',
    password: 'gymmanager',
    host: 'localhost',
    port: 5432,
    database: 'gymmanager'
})
