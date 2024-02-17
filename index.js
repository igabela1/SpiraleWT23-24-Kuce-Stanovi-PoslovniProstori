
const express = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const session = require('express-session'); 
const { log } = require('console');

const app = express();
const PORT = 3000;

const nekretnine = require("./data/nekretnine.json");
const korisnici = require("./data/korisnici.json");

const Sequelize = require('sequelize');
const sequelize = require("./baza.js");

// Kreiranje tabela u sequelize modulu
const Nekretnina = require("./Nekretnina.js") (sequelize);
const Korisnik = require("./Korisnik.js") (sequelize);
const Upit = require("./Upit.js") (sequelize);

// Kreiranje i punjenje baze sa json podacima sa spirale 3 ako ona nije kreirana već
sequelize.sync().then(async () => {
    var velicina = korisnici.length;
    for(var i=0; i<velicina; i++){
        var ime = korisnici[i].ime;
        var prezime = korisnici[i].prezime;
        var username = korisnici[i].username;
        var password = korisnici[i].password;
        await Korisnik.create({
            ime: ime,
            prezime: prezime,
            username: username,
            password: password
        });
    }

    velicina = nekretnine.length;
    for(var i=0; i<velicina; i++){
        var tip_nekretnine = nekretnine[i].tip_nekretnine;
        var naziv = nekretnine[i].naziv;
        var kvadratura = nekretnine[i].kvadratura;
        var cijena = nekretnine[i].cijena;
        var tip_grijanja = nekretnine[i].tip_grijanja;
        var lokacija = nekretnine[i].lokacija;
        var godina_izgradnje = nekretnine[i].godina_izgradnje;
        var datum_objave = new Date(nekretnine[i].datum_objave);
        var opis = nekretnine[i].opis;
        var nekretnina = await Nekretnina.create({
            tip_nekretnine: tip_nekretnine,
            naziv: naziv,
            kvadratura: kvadratura,
            cijena: cijena,
            tip_grijanja: tip_grijanja,
            lokacija: lokacija,
            godina_izgradnje: godina_izgradnje,
            datum_objave: datum_objave,
            opis: opis,
            pretrage: 0,
            klikovi: 0
        });
        var velicinaUpita = nekretnine[i].upiti.length;
        for(var j=0; j<velicinaUpita; j++){
            var upit = nekretnine[i].upiti[j];
            const noviUpitPodaci = {
                tekst_upita: upit.tekst_upita,
                KorisnikId: upit.korisnik_id, 
                NekretninaId: nekretnina.id, 
              };
              
              // Dodaj novi upit u tabelu Upit
              await Upit.create(noviUpitPodaci)
                .then((noviUpit) => {
                  console.log("Novi upit je uspješno dodan:", noviUpit);
                })
                .catch((error) => {
                  console.error("Došlo je do greške prilikom dodavanja novog upita:", error);
                });
        }
    }
});

app.use(express.json());

app.use(express.static('public'));

app.use(express.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));
app.use(express.static(path.join(__dirname, 'public')));

// Default ruta vodi na prijavu
app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'prijava.html'));
});

app.get('/api/profil.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'profil.html'));
  });
  
  app.get('/api/detalji.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'detalji.html'));
  });
  
  app.get('/api/meni.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'meni.html'));
  });
  
  app.get('/api/nekretnine.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'nekretnine.html'));
  });
  
  app.get('/api/prijava.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'prijava.html'));
  });

// Ruta za registraciju
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Proveri da li korisnik već postoji
        if (korisnici.some(user => user.username === username)) {
            return res.status(400).json({ message: "Korisnik već postoji!" });
        }

        // Hashiraj lozinku
        const hashedPassword = await bcrypt.hash(password, 10);

        // Dodaj novog korisnika
        korisnici.push({ id: korisnici.length + 1, username, password: hashedPassword });
        fs.writeFile("./data/korisnici.json", JSON.stringify(korisnici, null, 2), "utf-8", err =>{
            if(err)
                console.log("Error pri spašavanju korisnika: ${err}");
            else
                console.log("Sačuvan korisnik!");
        });
        
        res.status(201).json({ message: "Korisnik uspešno registrovan!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Došlo je do greške na serveru." });
    }
});

//Ruta /login
app.post('/login', async (req, res) => {
    try {
        
        const { username, password } = req.body;
        let korisnik = await Korisnik.findOne({where: {username: username},});
        if (korisnik && await bcrypt.compare(password, korisnik.password)) {
            req.session.username = username;
            res.status(200).json({ poruka: 'Uspješna prijava' });
        } else {
            res.status(401).json({ greska: 'Neuspješna prijava' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ greska: 'Greška servera', error: error.message });
    }
});

// Ruta /logout
app.post('/logout', (req, res) => {
    var ime = req.session.username;
    req.session.destroy(err => {
        if (err) {    
            res.status(500).json({ greska: 'Došlo je do greške prilikom odjave' });
        } else {
            if(ime != undefined)
                res.status(200).json({ poruka: 'Uspješno ste se odjavili' });
            else
                res.status(401).json({ poruka: 'Neautorizovan pristup'});
        }
    });
});
//Ruta /korisnik
app.get('/korisnik', async (req, res) => {
    if (req.session.username != undefined) {
        let korisnik = await Korisnik.findOne({where: {username: req.session.username},});
        res.status(200).json(korisnik);
    } else {
        res.status(401).json({ greska: 'Neautorizovan pristup' });
    }
});

// Ruta /upit
app.post('/upit', async (req, res) => {
    if (req.session.username != undefined) {
        const { nekretnina_id, tekst_upita } = req.body;


        const korisnik = await Korisnik.findOne({where: {username: req.session.username},});
        const nekretnina = await Nekretnina.findByPk(nekretnina_id);

        if (!nekretnina) {
            res.status(400).json({ greska: `Nekretnina sa id-em ${nekretnina_id} ne postoji` });
        } else {
            await Upit.create({
                tekst_upita: tekst_upita,
                KorisnikId: korisnik.id,
                NekretninaId: nekretnina.id,
            });
            res.status(200).json({ poruka: 'Upit je uspješno dodan' });
        }
    } else {
        res.status(401).json({ greska: 'Neautorizovan pristup' });
    }
});

// Ruta /korisnik
app.put('/korisnik', async (req, res) => {
    if (req.session.username != undefined) {
        const { ime, prezime, username, password } = req.body;

        const korisnik = await Korisnik.findOne({ where: { username: req.session.username } });

        if (ime) korisnik.ime = ime;
        if (prezime) korisnik.prezime = prezime;
        if (username) korisnik.username = username;
        if (password) korisnik.password = await bcrypt.hash(password, 10);
        
        await korisnik.save();

        res.status(200).json({ poruka: 'Podaci su uspješno ažurirani' });
    } else {
        res.status(401).json({ greska: 'Neautorizovan pristup' });
    }
});

// Ruta /nekretnine
app.get('/nekretnine', async (req, res) => {
    try {
        // Dohvati sve nekretnine iz baze
        const nekretnine = await Nekretnina.findAll();
        res.status(200).json(nekretnine);
    } catch (error) {
        console.error('Došlo je do greške:', error);
        res.status(500).json({ greska: 'Došlo je do server greške' });
    }
});

// Ruta za prijem i obradu informacija o filtriranim nekretninama
app.post('/marketing/nekretnine', async (req, res) => {
    try {
        const nekretnineIds = req.body.nizNekretnina.map(id => parseInt(id, 10));

        // Ažuriramo ili postavljamo broj pretraga za svaku nekretninu
        await Nekretnina.increment('pretrage', { where: { id: nekretnineIds } });

        res.status(200).send();
    } catch (error) {
        console.error('Došlo je do greške:', error);
        res.status(500).json({ greska: 'Došlo je do server greške' });
    }
});

// Ruta za prijem informacija o kliku na određenu nekretninu
app.post('/marketing/nekretnina/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    
    await Nekretnina.increment('klikovi', { where: { id: id } });

    //console.log('Ažuriran klik za nekretninu:', Object.fromEntries(app.locals.mapaNekretnina));
    res.status(200).send(); // Vraćamo statusni kod 200 bez tijela odgovora
});

app.post('/marketing/osvjezi', async (req, res) => {
    const nizNekretninaIds = req.body.nizNekretnina;
    
    const odgovor = {
        nizNekretnina: await Nekretnina.findAll({ attributes: ['id', 'pretrage', 'klikovi'] }),
    };

    //console.log('Podaci za osvježavanje:', odgovor.nizNekretnina);
    res.status(200).json({nizNekretnina: odgovor.nizNekretnina}); // Vraćamo JSON sa podacima
});

app.get('/nekretnina/:id', async (req, res) => {
    try {   
        const id = parseInt(req.params.id, 10);

        // Pronađi nekretninu sa datim ID-om u bazi podataka
        const nekretnina = await Nekretnina.findOne({ where: { id: id } });

        if (!nekretnina) {
            // Ako ne postoji nekretnina sa datim ID-om, vrati grešku 400
            res.status(400).json({ greska: `Nekretnina sa id-em ${id} ne postoji` });
        } else {
            // Ako postoji, vrati podatke o nekretnini u JSON formatu
            res.status(200).json(nekretnina);
        }
    } catch (error) {
        console.error('Došlo je do greške:', error);
        res.status(500).json({ greska: 'Došlo je do server greške' });
    }
});



// Pokreni server

app.listen(PORT, () => {
    console.log(`Server pokrenut na http://localhost:${PORT}/`);
});
