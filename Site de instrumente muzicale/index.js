const { text } = require("express");
const express = require("express");
const fs=require("fs");
const sharp=require("sharp");
const ejs = require("ejs");
const sass = require("sass");
const formidable = require("formidable");
const { JSDOM } = require("jsdom");

const {Utilizator} = require("./module_proprii/utilizator.js")

const AccesBD = require("./module_proprii/accesbd.js")
const mysql = require("mysql");

// const db = mysql.createConnection({
//     host    : 'localhost',
//     user    : 'george',
//     password: '12345',
//     database: 'magazin'
// });

// db.connect((err) => {
//     if(err){
//         throw err;
//     }
//     console.log('MySql Connected...');
// })

var instantaBD=AccesBD.getInstanta({init:"local"});
var db=instantaBD.getClient();
instantaBD.select({campuri:["nume","pret"], tabel:"produse"}, function(err,rez){
    console.log("=============================================")
    if(err)
        console.log(err);
    else
        console.log(rez);
})


cssbootstrap=sass.compile(__dirname+"/resurse/scss/customizare-boostrap.scss",{sourceMap:true});

fs.writeFileSync(__dirname+"/resurse/css/bibleoteci/bootstrap-custom.css", cssbootstrap.css)





app = express();
app.set("view engine", "ejs");

app.use("/resurse", express.static(__dirname+"/resurse"));
app.use("/node_modules", express.static(__dirname+"/node_modules"));

obGlobal={
    erori:null,
    imagini:null
}



app.get('/select', (req, res) =>{
    let sql = 'Select * from test';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        console.log(result);
        result.send('Post fetched...');
    });
})

// app.get("/produse", function(req,res){
//     db.query("select * from produse", function(err,rez){
//         if(err){
//         console.log(err);
//         renderError(res,2);
//         }
//         else
//         res.render("pagini/produse", {produse:rez.rows});
//     })
    

// })
// app.get("/produse",function(req, res){
//     console.log(req.query);
//     client.query("select * from unnest(enum_range(null::categ_prajitura))", function(err, rezCateg){
//         console.log(200)
//         continuareQuery=""
//         if (req.query.tip)
//             continuareQuery+=` and tip_produs='${req.query.tip}'` //"tip='"+req.query.tip+"'"
//         client.query("select * from prajituri where 1=1 " + continuareQuery , function( err, rez){
//             console.log(300)
//             if(err){
//                 console.log(err);
//                 renderError(res, 2);
//             }
//             else
//                 res.render("pagini/produse", {produse:rez.rows, optiuni:rezCateg.rows});
//         });
//     });
//     console.log(100)
// });

app.get('/produse', (req, res) =>{
    sql = 'Select * from produse';
let query = db.query(sql, (err,result)=>{
    if(err) {
        renderError(res,2);
        throw err;
    }
    else
    {
    let n = result.length;
    console.log(n);
    res.render("pagini/produse", {produse:[result], optiuni:[],n:n});
    }
});
console.log(100)
})


app.get('/produs/:id', (req, res) =>{
    console.log(req.params.id);
    let sql = 'Select * from produse where id='+req.params.id;
    let query = db.query(sql, (err,result)=>{
        if(err) {
            renderError(res,2);
            throw err;
        }
        else
        {
        
        // for( let prod of result)
        //     {
        //         console.log(prod.id)
        //     }
        console.log(result[0]);
        res.render("pagini/produs", {prod:[result[0]]});
        }
    });
})
function createImages(){
    var continutFisier=fs.readFileSync(__dirname+"/resurse/json/galerie.json").toString("utf8");
    //console.log(continutFisier);
    var obiect=JSON.parse(continutFisier);
    var dim_mediu=400;
    var dim_mic=200;

    obGlobal.imagini=obiect.imagini;

    obGlobal.imagini.forEach(function (elem){
        [numeFisier,extensie]=elem.fisier.split(".") 
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

///////////////////////// Utilizatori

app.post("/inregistrare",function(req, res){
    var username;
    console.log("ceva");
    var formular= new formidable.IncomingForm()
    formular.parse(req, function(err, campuriText, campuriFisier ){
        console.log(campuriText);


        var eroare="";

        var utilizNou = new Utilizator();
        try{
            utilizNou.setareNume = campuriText.nume;
            utilizNou.setareUsername = campuriText.username;
            utilizNou.email = campuriText.email;
            utilizNou.rol = "utilizator";
            // utilizNou.nume = campuriText.nume;
            utilizNou.culoare_chat = campuriText.culoare_chat;
            utilizNou.parola = campuriText.parola;
            utilizNou.salvareUtilizator();
        }
            catch(e){eroare+=e.message
            console.log(eroare)
            console.log("aici e problema")
            }

        if(!eroare){
            res.render("pagini/inregistrare", {raspuns: "Inregistrare cu succes!"});
        }
        else
            res.render("pagini/inregistrare", {err: "Eroare: "+eroare});
    });
    formular.on("field", function(nume,val){  // 1
   
        console.log(`--- ${nume}=${val}`);
       
        if(nume=="username")
            username=val;
    })
    formular.on("fileBegin", function(nume,fisier){ //2
        console.log("fileBegin");
       
        console.log(nume,fisier);
        //TO DO in folderul poze_uploadate facem folder cu numele utilizatorului


    })    
    formular.on("file", function(nume,fisier){//3
        console.log("file");
        console.log(nume,fisier);
    });
});

app.get("/token/:username/:token",function(req,res){
    console.log(req.params);
    try {
        Utilizator.getUtilizDupaUsername(req.params.username,{res:res,token:req.params.token} ,function(u,obparam){
            AccesBD.getInstanta().update(
                {tabel:"utilizatori",
                campuri:['confirmat_mail'],
                valori:['1'], 
                conditiiAnd:[`token='${obparam.token}'`]}, 
                function (err, rezUpdate){
                    if(err || rezUpdate.rowCount==0){
                        console.log("token:", err);
                        renderError(res,3);
                    }
                    else{
                        res.render("pagini/confirmare.ejs");
                    }
                })
        })
    }
    catch (e){
        console.log(e);
        renderError(res,2);
    }
})


app.get("/*", function(req, res){
    if(req.url == "/home")
        req.url = "/index";
    console.log(req.url);
    res.render("pagini" + req.url, {imagini:obGlobal.imagini},function(err,rezRandare)
    {
         console.log("Eroare", err);
         console.log("Rezulatat randare", rezRandare);
          
         if(err){
            if(err.message.includes("Failed to lookup view")){
                renderError(res,404,"titlu custom");
            }
            else
            {

            }
         }else
            console.log("aici merge");
        {
            res.send(rezRandare);
        }
        
});
    
})

// app.get("/*",function(req, res){
//     if(req.url == "/home")
//       req.url = "/index";
//     console.log("url:",req.url);
//     //res.sendFile(__dirname+ "/index.html");
//     //res.write("nu stiu");
//     //res.end();
//     res.render("pagini"+req.url, function(err,rezRandare){
//         //console.log("Eroare", err);
//         //console.log("Rezultat randare", rezRandare);

//         if(err){
//             if(err.message.includes("Failed to lookup view")){
//                 renderError(res,404,"titlu custom");
//             }
//             else{

//             }
//         }
//         else{
//             res.send(rezRandare);
//         }


//     });
// });


console.log("Hello world!");
app.listen("8080", () =>
{
    console.log("Server started on port 8080");
})
console.log("Srv a pornit!");