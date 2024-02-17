const Sequelize = require("sequelize");
const sequelize = require("./baza.js");
const Korisnik = require("./Korisnik.js") (sequelize);
const Nekretnina = require("./Nekretnina.js") (sequelize);

module.exports = function (sequelize, DataTypes){
    
    const Upit = sequelize.define("Upit", {
        tekst_upita: Sequelize.TEXT
    },
    {
        tableName: "Upit"
    });
    
    // Definisanje veze između Upita i Korisnika i Nekretnine
    Upit.belongsTo(Korisnik, {
        foreignKey: 'KorisnikId',
        allowNull: false,
    });
    
    Upit.belongsTo(Nekretnina, {
        foreignKey: 'NekretninaId',
        allowNull: false,
    });
    


    return Upit;
};

