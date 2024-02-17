const Sequelize = require("sequelize");
const sequelize = require("./baza.js");


module.exports = function (sequelize, DataTypes){
    
    const Nekretnina = sequelize.define("Nekretnina", {
        tip_nekretnine: Sequelize.STRING,
        naziv: Sequelize.STRING,
        kvadratura: Sequelize.STRING,
        cijena: Sequelize.FLOAT,
        tip_grijanja: Sequelize.STRING,
        lokacija: Sequelize.STRING,
        godina_izgradnje: Sequelize.INTEGER,
        datum_objave: Sequelize.DATE,
        opis: Sequelize.TEXT,
        pretrage: Sequelize.INTEGER,
        klikovi: Sequelize.INTEGER
    },
    {
        tableName: "Nekretnina"
    });
    
    
    return Nekretnina;
};
