const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

app.listen('5000',console.log("Server run on PORT 5000"))
app.get('/',(req,res)=>{
    res.send("Wel-Come")
})
const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/lostfound")
.then(()=>{
    console.log("Mongoose Connected Successfully")
})
.catch((error)=>{
    console.error(error)
})

const path = require('path');


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(express.json())
const lostandFoundRoutes = require('./routes/lostandfoundroutes')
app.use('/lostandfound',lostandFoundRoutes)

const logsign_route = require('./routes/log_reg_routes');
app.use('/logsign', logsign_route);

const claimRoutes=require('./routes/claimroutes')
app.use('/api/claims', claimRoutes);

const messageRoutes = require('./routes/messageRoutes')
app.use('/api/msg',messageRoutes)
