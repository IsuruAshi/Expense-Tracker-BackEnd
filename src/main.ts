import cors from 'cors';
import express, {json} from 'express';
import {TransactionHttpController} from "./controller/transaction.http.controller.js";

const app=express();
app.use(cors());
app.use(json());

app.use((req,res,next)=>{
    next();
});


app.use('/api/v1/transactions/',TransactionHttpController);

app.listen(8080,()=>console.log('Server is Listening to 8080'))