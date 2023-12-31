import {Router} from "express";
import {Request,Response} from "express-serve-static-core";
import mysql, {ResultSetHeader} from 'mysql2/promise'
import 'dotenv/config'
import {TransactionTo} from "../to/transaction.to.js";


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
async function addTransaction(req:Request,res:Response){
    const transaction = <TransactionTo>req.body;
    const connection=await pool.getConnection();
    const [{insertId}]= await connection.execute<ResultSetHeader>('INSERT INTO transaction1 (text,amount) VALUES (?,?)',
        [transaction.text,transaction.amount]);
    pool.releaseConnection(connection);
    transaction.id=insertId;
    res.status(201).json(transaction);
}
async function deleteTransaction(req:Request,res:Response){
    const transactionId=+req.params.id;
    const transaction=<TransactionTo> req.body;
    const connection= await  pool.getConnection();
    const [result]=await connection.execute<ResultSetHeader[]>('SELECT * FROM transaction1 WHERE id =? ',[transactionId]);

    if(!result.length){
        res.sendStatus(404);
        return;
    }else{
        await connection.execute('DELETE FROM transaction1 WHERE id=?',[transactionId])
    }
    await connection.execute('UPDATE task SET description =? ,status=? WHERE id=?',
        [transaction.text,transactionId]
    );

    pool.releaseConnection(connection);
}