import {Router} from "express";
import {Request,Response} from "express-serve-static-core";
import mysql from 'mysql2/promise'
import 'dotenv/config'


const controller=Router();
controller.get('/',getAllTransactions);
controller.post('/',addTransaction);
controller.delete('/:id',deleteTransaction);

export {controller as TransactionHttpController};
const pool=mysql.createPool({
    database:process.env.DB_NAME,
    port:+process.env.DB_PORT!,
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    connectionLimit:+process.env.DB_CONNECTION_LIMIT!
});
async function getAllTransactions(req:Request,res:Response){
    // if(!req.query.email) res.sendStatus(400);
    const connection=await pool.getConnection();
    const [transactions]=await connection.execute('SELECT * FROM transaction1');
    res.json(transactions);
    pool.releaseConnection(connection);
}
function addTransaction(){}
function deleteTransaction(req:Request,res:Response){

}