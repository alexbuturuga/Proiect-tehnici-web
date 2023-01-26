const express = require("express");
const mysql = require("mysql");

const db = mysql.createConnection({
    host    : 'localhost',
    user    : 'george',
    password: '12345',
    database: 'magazin'
});

db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql Connected...');
})
const app = express();

app.get('/select', (req, res) =>{
    let sql = 'Select * from produse';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send('Post fetched...');
    });
})

app.listen("8080", () =>
{
    console.log("Server started on port 8080");
})

app.get('/produse', (req, res) =>{
    let sql = 'Select * from produse';
    let query = db.query(sql, (err,result)=>{
        if(err) {
            renderError(res,2);
            throw err;
        }
        else
        {
        console.log(result.rows);
        // res.render("pagini/produse", {produse:[result.rows], optiuni:[]});
        }
    });
})