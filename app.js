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



app.get('/assignments', async(req, res)=>{
    try{
        let result = await pool.query(`SELECT * FROM assignments ORDER BY id desc`)
        res.status(200).json(result.rows)
    }catch(err){
        console.log(err)
        res.status(500).json({err:"Server Failed"})
    }
})
app.patch('/assignments/:id', async(req, res)=>{
    try{
        const { id } = req.params;
        const result = await pool.query(`
            UPDATE assignments SET submitted = true where id = $1
            RETURNING * ;`, [id])
        if (result.row.length === 0){
            return res.status(404).json({err:"Request not Found"})
        } else {
            res.status(201).json(result.rows[0])
        }
    }catch(err){
        console.log(err)
        res.status(500).json({err:"Server Failed"})
    }
})




app.listen(3000,() => {
    console.log('Server is running')
});