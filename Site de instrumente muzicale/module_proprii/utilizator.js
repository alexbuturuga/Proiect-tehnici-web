const AccesBD=require('./accesbd.js');
const crypto=require("crypto");
const nodemailer = require("nodemailer");
const parole = require("./parole.js");

class Utilizator{
    static tipConexiune="local";
    static tabel = "utilizatori";
    static parolaCriptare = "tehniciweb";
    static emailServer = "georgebuturuga00@gmail.com";
    static numeDomeniu = "localhost:8080";
    #eroare;

    constructor({id, username, nume, email, rol, culoare_chat="black", poza,ocupatie}={}) {
        this.id=id;
        this.username = username;
        this.nume = nume;
        this.rol=rol; //TO DO clasa Rol
        this.email = email;
        this.culoare_chat=culoare_chat;
        this.poza=poza;
        this.ocupatie=ocupatie;
        this.#eroare="";
    }

    checkName(nume)
    {
        return nume!="" && nume.match(new RegExp("^[A-Z][a-z]+$"));
    }

    set setareNume(nume){
        if (this.checkName(nume)) this.nume = nume
        else{
            throw new Error("Nume gresit!")
        }
    }

    checkUsername(username){
        return username!="" && username.match(new RegExp("^[A-Za-z0-9#_./]+$")) ;
    }

    set setareUsername(username){
        if (this.checkUsername(username)) this.username = username
        else{
            throw new Error("Username gresit!")
        }
    }
    

    salvareUtilizator()
    {
        let parolaCriptata=crypto.scryptSync(this.parola,Utilizator.
        parolaCriptare,64).toString("hex");
        let token = parole.genereazaToken(100);
      
        AccesBD.getInstanta(Utilizator.tipConexiune).insert({tabel:Utilizator.tabel, campuri:["username","nume","parola","rol","email","culoare_chat","token"], 
        valori:[`'${this.username}'`,`'${this.nume}'`,`'${this.parola}'`,`'${this.rol}'`,`'${this.email}'`,`'${this.culoare_chat}'`,`'${token}'`]}, function(err,rez)
        {
            if (err)
                console.log(err);
        })
        this.trimiteMail("Te-ai inregistrat cu succes","Username-ul tau este "+this.username,
            `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${this.username}.</p> 
            <p><a href='http://${Utilizator.numeDomeniu}/token/${this.username}/${token}'>Click aici pentru confirmare</a></p>`,
            )
       
    }

    async trimiteMail(subiect, mesajText, mesajHtml, atasamente=[]){
        var transp= nodemailer.createTransport({
            service: "gmail",
            secure: false,
            auth:{//date login 
                user:Utilizator.emailServer,
                pass:"jnsuxxyrvyrcuyyw"
            },
            tls:{
                rejectUnauthorized:false
            }
        });
        //genereaza html
        await transp.sendMail({
            from:Utilizator.emailServer,
            to:this.email, //TO DO
            subject:subiect,//"Te-ai inregistrat cu succes",
            text:mesajText, //"Username-ul tau este "+username
            html: mesajHtml,// `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${username}.</p> <p><a href='http://${numeDomeniu}/token/${username}/${token}'>Click aici pentru confirmare</a></p>`,
            attachments: atasamente
        })
        console.log("trimis mail");
    }

    // static getUtilizDupaUsername(username,obparam, proceseazaUtiliz){
    //     AccesBD.getInstanta(Utilizator.tipConexiune).select({tabel:"utilizatori", campuri:['*'], conditiiAnd:['username=${username}']}, function(err,rezSelect){
    //         if(err || rezSelect.rows.lenght == 0)
    //             {console.error("Utilizator:", err);
    //                 console.error("Utilizator:", rezSelect.rows.lenght);
    //             throw new Error();
    //             }
    //         // constructor({id, username, nume, email, rol, culoare_chat="black", poza,ocupatie}={}) {
    //         let u = new Utilizator(rezSelect.rows[0].id,rezSelect.rows[0].username,rezSelect.rows[0].nume,rezSelect.rows[0].email,
    //             rezSelect.rows[0].rol,rezSelect.rows[0].culoare_chat,rezSelect.rows[0].poza,rezSelect.rows[0].ocupatie );
    //         proceseazaUtiliz(u, obparam)
            
                

    //     });
    // }



    // static async getUtilizDupaUsernameAsync(username){
    //     if (!username) return null;
    //     try{
    //         let rezSelect= await AccesBD.getInstanta(Utilizator.tipConexiune).selectAsync(
    //             {tabel:"utilizatori",
    //             campuri:['*'],
    //             conditiiAnd:[`username='${username}'`]
    //         });
    //         if(rezSelect.rowCount!=0){
    //             return new Utilizator(rezSelect.rows[0])
    //         }
    //         else {
    //             console.log("getUtilizDupaUsernameAsync: Nu am gasit utilizatorul");
    //             return null;
    //         }
    //     }
    //     catch (e){
    //         console.log(e);
    //         return null;
    //     }
        
    // }
    static getUtilizDupaUsername (username,obparam, proceseazaUtiliz){
        if (!username) return null;
            let eroare=null;
        AccesBD.getInstanta(Utilizator.tipConexiune).select({tabel:"utilizatori",
        campuri:['*'],conditiiAnd:[`username=${username}`]}, function (err, rezSelect){
            if(err){
                
                console.error("Utilizator:", err);
                console.log("Utilizator",rezSelect.rows.lenght);
                //throw new Error()
                eroare=-2;
            }
            else if(rezSelect.rowCount==0){
                eroare=-1;
            }
            
            //constructor({id, username, nume, prenume, email, rol, culoare_chat="black", poza}={})
            let u= new Utilizator(rezSelect.rows[0])
            proceseazaUtiliz(u, obparam, eroare);
        }, [username]);
    }

    areDreptul(drept){
        return this.rol.areDreptul(drept);
    }
    
   
}
module.exports = {Utilizator:Utilizator}