const express = require('express');
const { mongodb } = require('./DB/database');
const authRoute = require('./Route/route')
const app = express()

const port = 3000;

mongodb();
app.use(express.json())

app.use('/api',authRoute)

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})