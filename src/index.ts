import AgentAPI from 'apminsight';
AgentAPI.config();

import express from 'express'
import subjectsRouter from './routes/subjects';
import usersRouter from './routes/users';
import cors from 'cors'
import {toNodeHandler} from 'better-auth/node'
import { auth } from './lib/auth';
import securityMiddleware from './middleware/security';
import classesRouter from './routes/classes';
const app = express();
const PORT = 8000;

if(!process.env.FRONTEND_URL){
    throw new Error('Frontend_URL is not set in .env file')
}
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET','POST','PUT','DELETE'],
    credentials: true
}));

// Auth handler must be before express.json() or client API can get stuck (better-auth docs)
app.all('/api/auth/*splat',toNodeHandler(auth));

app.use(express.json())

app.use(securityMiddleware)
app.use('/api/subjects', subjectsRouter)
app.use('/api/users', usersRouter)
app.use('/api/classes',classesRouter)
app.get('/',(req,res)=>{
    res.send("Hello")
})


app.listen(PORT,() => {
    console.log(`Server running on http://localhost:${PORT}`)
})
