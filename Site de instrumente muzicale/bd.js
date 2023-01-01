const {Client}=require("pg");
require('dotenv').config();

var client= new Client({
    database:"tehniciweb",
    user:"George",
    password:"1983",
    host:"localhost",
    port:5432
});
client.connect();

/*
client.query(
   'Select * from tabel_test', (err, rez) =>
   {
    if(!err)
    {
        console.log(rez.rows);
    }else
    {
        console.log(err.message);
    }
    client.end;
   }
)
*/