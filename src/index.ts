import express from 'express'

const app = express();
const PORT = 4000

app.use(express.json())

app.get('/', (req,res)=>{
    res.send('Hello! Welcome to classroom ')
})

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))