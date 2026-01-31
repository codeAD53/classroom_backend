import express from 'express'
import subjectsRouter from './routes/subjects';
import cors from 'cors'
import securityMiddleware from './middleware/security';
const app = express();
const PORT = 8000;

app.use(express.json())

if(!process.env.FRONTEND_URL){
    throw new Error('Frontend_URL is not set in .env file')
}
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET','POST','PUT','DELETE'],
    credentials: true
}))

app.use(securityMiddleware)
app.use('/api/subjects', subjectsRouter)

app.get('/',(req,res)=>{
    res.send("Hello")
})


app.listen(PORT,() => {
    console.log(`Server running on http://localhost:${PORT}`)
})

