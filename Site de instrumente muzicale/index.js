const express = require("express");

app = express();
app.set("view engine", "ejs");

app.use("/resurse", express.static(__dirname+"/resurse"));


app.get("/*", function(req, res){
    console.log(req.url);
    // res.sendFile(__dirname+ "/index.html");
    if(req.url == "/home")
        req.url = "/index";
    res.render("pagini" + req.url, function(err,rezRandare)
    {
        console.log("Eroare", err);
        console.log("Rezulatat randare", rezRandare);

        if(err)
        {
            if(err.message.includes("Failed to lookup view"))
            res.render("pagini/404")
            else
            if(err.message.includes("Forbidden"))
            res.render("pagini/403")
            else
            res.render("pagini/503")
            
        }else
        {
            res.send(rezRandare);
        }
        
    });
    
})



console.log("Hello world!");

app.listen(8080);
console.log("Srv a pornit!");