const { text } = require("express");
const express = require("express");
const fs=require("fs");
const sharp=require("sharp");

app = express();
app.set("view engine", "ejs");

app.use("/resurse", express.static(__dirname+"/resurse"));

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