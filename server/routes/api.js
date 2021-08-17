const express = require('express');
const mysql = require('mysql2');
const router = express.Router();

const dbConfig = require('../config/database');
const connection = mysql.createConnection(dbConfig);

connection.connect();

router.get('/', (req, res)=>{
    console.log('http://localhost:5000/api/');
    
    res.send({title: 'hello react!'});
});

router.get('/db/test', (req, res)=>{
    connection.query(`SELECT * FROM PkInfo`, (err, rows, fields)=>{
        if (err) 
            throw err;
        else
        res.send(rows);
    });
})

module.exports = router;