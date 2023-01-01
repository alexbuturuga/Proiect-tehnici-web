const { text } = require("express");
const express = require("express");
const fs=require("fs");
const sharp=require("sharp");
const ejs = require("ejs");
const sass = require("sass");

cssbootstrap=sass.compile(__dirname+"/resurse/scss/customizare-boostrap.scss",{sourceMap:true});

fs.writeFileSync(__dirname+"/resurse/css/bibleoteci/bootstrap-custom.css", cssbootstrap.css)

/*
const {Client}=require("pg");
var client= new Client({database:"tehniciweb",
        user:"George", 
        password:"1983", 
        host:"localhost", 
        port:5432});
client.connect();

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

app = express();
app.set("view engine", "ejs");

app.use("/resurse", express.static(__dirname+"/resurse"));
app.use("/node_modules", express.static(__dirname+"/node_modules"));

obGlobal={
    erori:null,
    imagini:null
}

function createImages(){
    var continutFisier=fs.readFileSync(__dirname+"/resurse/json/galerie.json").toString("utf8");
    //console.log(continutFisier);
    var obiect=JSON.parse(continutFisier);
    var dim_mediu=400;
    var dim_mic=200;

    obGlobal.imagini=obiect.imagini;

    obGlobal.imagini.forEach(function (elem){
        [numeFisier,extensie]=elem.fisier.split(".")   //"briose-frisca.png" ->["briose-frisca", "png"]
        if(!fs.existsSync(obiect.cale_galerie+"/mediu/")){
            fs.mkdirSync(obiect.cale_galerie+"/mediu/");
        }
        elem.fisier_mediu=obiect.cale_galerie+"/mediu/"+numeFisier+".webp"
        elem.fisier=obiect.cale_galerie+"/"+elem.fisier;
        sharp(__dirname+"/"+elem.fisier).resize(dim_mediu).toFile(__dirname+"/"+elem.fisier_mediu);
    });


    console.log(obGlobal.imagini);
}
createImages();


function createErrors(){
    var continutFisier=fs.readFileSync(__dirname+"/resurse/json/erori.json").toString("utf8");
    //console.log(continutFisier);
    obGlobal.erori=JSON.parse(continutFisier);
    //console.log(obErori.erori);
}
createErrors();

function renderError(res, identificator, titlu, text, imagine){
    var eroare = obGlobal.erori.info_erori.find(function(elem){
        return elem.identificator==identificator;
    })
    titlu= titlu || (eroare && eroare.titlu) || obGlobal.erori.eroare_default.titlu;
    text= text || (eroare && eroare.text) || obGlobal.erori.eroare_default.text;
    imagine= imagine || (eroare && obGlobal.erori.cale_baza+"/"+eroare.imagine) || obGlobal.erori.cale_baza+"/"+obGlobal.erori.eroare_default.imagine;
    if(eroare && eroare.status){
        res.status(identificator).render("pagini/eroare", {titlu:titlu, text:text, imagine:imagine})
    }
    else{
        res.render("pagini/eroare", {titlu:titlu, text:text, imagine:imagine});
    }
}


app.get("*/galerie-animata.css",function(req, res){

    var sirScss=fs.readFileSync(__dirname+"/resurse/scss/galerie_animata.scss").toString("utf8");
    var culori=["navy","black","purple","grey"];
    var indiceAleator=Math.floor(Math.random()*culori.length);
    var culoareAleatoare=culori[indiceAleator]; 
    rezScss=ejs.render(sirScss,{culoare:culoareAleatoare});
    console.log(rezScss);
    var caleScss=__dirname+"/temp/galerie_animata.scss"
    fs.writeFileSync(caleScss,rezScss);
    try {
        rezCompilare=sass.compile(caleScss,{sourceMap:true});
        
        var caleCss=__dirname+"/temp/galerie_animata.css";
        fs.writeFileSync(caleCss,rezCompilare.css);
        res.setHeader("Content-Type","text/css");
        res.sendFile(caleCss);
    }
    catch (err){
        console.log(err);
        res.send("Eroare");
    }
});

app.get("*/galerie-animata.css.map",function(req, res){
    res.sendFile(path.join(__dirname,"temp/galerie-animata.css.map"));
});




app.get("/*.ejs", function(req, res)
{
    renderError(res,403);
})

app.get("/*", function(req, res){
    console.log(req.url);
    // res.sendFile(__dirname+ "/index.html");
    if(req.url == "/home")
        req.url = "/index";
    res.render("pagini" + req.url, {function(err,rezRandare)
    {
        console.log("Eroare", err);
        console.log("Rezulatat randare", rezRandare);

        if(err)
        {
            if(err.message.includes("Failed to lookup view"))
                {
                    renderError(res,404,"titlu custom");
                }else
                {

                }
            
        }else
        {
            res.send(rezRandare);
        }
        
    },imagini:obGlobal.imagini});
    
})



console.log("Hello world!");

app.listen(8080);
console.log("Srv a pornit!");