
import dotenv from 'dotenv';
import assert from 'assert';
import sql from 'mssql';
dotenv.config();

const {
    SQL_SERVER,
    SQL_DB,
    SQL_USER,
    SQL_PWD,
    SQL_PORT,
}= process.env;

assert(SQL_PORT, 'PORT is required');
assert(SQL_SERVER, 'SQL_SERVER is required');
assert(SQL_DB, 'SQL_DB is required');
assert(SQL_USER, 'SQL_USER is required');
assert(SQL_PWD, 'SQL_PWD is required');

export const config ={
    port:SQL_PORT,
    sqlConfig: {
        user: SQL_USER,
        password: SQL_PWD,
        database: SQL_DB,
        server: SQL_SERVER,
        pool:{
            max:10,
            min:0,
            idleTimeoutMillis: 30000
        },
        options:{
            encrypt: true,
            trustServerCertificate: true
        }
    }
}

export const getPool = async () => {
    try {
        const pool = await sql.connect(config.sqlConfig)
        return pool;
    } catch (error) {
        console.log("SQL Connection error", error);
        throw error
    }
}