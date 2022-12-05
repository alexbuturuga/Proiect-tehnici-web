const express = require("express");

app = express();

app.get("/index.html", function(req, res){
    console.log("ceva");
    res.send("Nu vreai sa-ti dau index!!!");
    
})



console.log("Hello world!");

app.listen(8080);
console.log("Srv a pornit!");