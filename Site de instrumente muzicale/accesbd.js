
const mysql = require("mysql");


db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql Connected...');
})

class AccesBD{
    static #instanta = null;

    constructor() {
        if(AccesBD.#instanta)
        {
            throw new Error("Deja a fost instantiat!");
        }
        AccesBD.#instanta = -1;
    }

    initLocal()
    {
        this.db = mysql.createConnection({
            host    : 'localhost',
            user    : 'george',
            password: '12345',
            database: 'magazin'})
            db.connect();
    }

    getClient(){
        if(!AccesBD.#instanta || AccesBD.#instanta == -1){
            throw new Error("Nu a fost instantiata clasa!");
        }
        return this.db;
    }
    static getInstanta({init="local"}={})
    {
        console.log(this);//this-ul este clasa nu instanta pt ca metoda statica
        if(!this.#instanta)
        {
            this.#instanta = new AccesBD();
            switch(init){
                case "local":initLocal();

            }
        }
        return this.#instanta;
    }


}
module.exports = AccesBD;
