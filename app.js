const path = require('node:path');
const FilePath = path.join(__dirname, "./db.js")
const pool = require(FilePath);
const express = require('express');

const app = express();;
app.use(express.json());

app.post('/assignments', async(req, res)=>{
    try{
        const {title, deadline}=req.body;
        let result = await pool.query(`
            INSERT INTO assignments(title, deadline)
            values($1, $2)
            returning *;
            `, [title, deadline])
        res.status(201).json(result.rows[0])
    }catch(err){
        console.log(err)
        res.status(500).json({err:"Server Failed"});
    }
})

app.listen(3000,() => {
    console.log('Server is running')
});