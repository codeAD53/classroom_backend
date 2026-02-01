import express  from 'express'
import { db } from '../db/db';
import { Classes } from '../db/schemas';


const classesRouter = express.Router()

classesRouter.post('/',async(req,res)=>{
    try{

        const [createdClass] = await db
        .insert(Classes)
        .values({...req.body, inviteCode:Math.random().toString(36).substring(2,9), schedules:[]})
        .returning({id: Classes.id});

    if(!createdClass) throw Error;
    res.status(201).json({data:createdClass})
        
    }catch(e){
        console.error(`POST /classes error ${e}`);
        res.status(500).json({error:e})
        
    }
})

export default classesRouter