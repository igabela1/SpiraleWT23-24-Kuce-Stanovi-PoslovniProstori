let SpisakNekretnina = function () {
    // privatni atributi 
    let listaNekretnina = [];
    let listaKorisnika = [];

    // implementacija metoda
    let init = function (nekretnine, korisnici) {
        listaNekretnina = nekretnine;
        listaKorisnika = korisnici;
    };

    let filtrirajNekretnine = function (kriterij) {
        // Filtriranje liste nekretnina funkcijom filter()
        return listaNekretnina.filter(nekretnina => {
            // Filtriranje po tipu nekretnine
            if (kriterij.tip_nekretnine && nekretnina.tip_nekretnine !== kriterij.tip_nekretnine) {
                // Ako je naveden tip nekretnine i ne odgovara kriterijumu, vraća se false, nekretnina se izbacuje
                return false;
            }

            // Filtriranje po minimalnoj kvadraturi
            if (kriterij.min_kvadratura && nekretnina.kvadratura < kriterij.min_kvadratura) {
                // Ako je navedena minimalna kvadratura i nekretnina je manja od toga, vraća se false, nekretnina se izbacuje
                return false;
            }

            // Filtriranje po maksimalnoj kvadraturi
            if (kriterij.max_kvadratura && nekretnina.kvadratura > kriterij.max_kvadratura) {
               // Ako je navedena maksimalna kvadratura i nekretnina je veća od toga, vraća se false, nekretnina se izbacuje
            return false;
            }

            // Filtriranje po minimalnoj cijeni
            if (kriterij.min_cijena && nekretnina.cijena < kriterij.min_cijena) {
               // Ako je navedena minimalna cijena i nekretnina je jeftinija od toga, vraća se false, nekretnina se izbacuje
            return false;
            }

            // Filtriranje po maksimalnoj cijeni
            if (kriterij.max_cijena && nekretnina.cijena > kriterij.max_cijena) {
                // Ako je navedena maksimalna cijena i nekretnina je skuplja od toga, vraća se false, nekretnina se izbacuje
            return false;
            }

            // Ako nekretnina prolazi kroz sve prethodne uslove, vraća se true i zadržava se u rezultujućoj listi
        return true;
        });
    };

    let ucitajDetaljeNekretnine = function (id) {
          // Metoda find() za pronalaženje nekretnine sa datim identifikacionim brojem
    // Ako nekretnina sa zadatim id-om postoji, vraća se ta nekretnina, inače se vraća null
    return listaNekretnina.find(nekretnina => nekretnina.id === id) || null;
    };

    let postaviUpitZaNekretninu = function (idNekretnine, idKorisnika, tekstUpita) {
         // Pozivanje funkcije ucitajDetaljeNekretnine kako bi se dobili detalji o nekretnini sa datim id-om
    let nekretnina = ucitajDetaljeNekretnine(idNekretnine);

  
        if (nekretnina) {
              // Ako je nekretnina pronađena, dodavanje novog upita u njen niz upita
       nekretnina.upiti.push({
                korisnik_id: idKorisnika,
                tekst_upita: tekstUpita
            });
              // Vraća se true ako je sve ispravno
        return true;
        }

        return false; //Ako nekretnina nije pronađena vraćamo false
    };

    let ucitajUpiteZaNekretninu = function (idNekretnine) {
          // Pozivanje funkcije ucitajDetaljeNekretnine kako bi se dobili detalji o nekretnini sa datim id-om
    let nekretnina = ucitajDetaljeNekretnine(idNekretnine);

   
        if (nekretnina) {
             // Ako je nekretnina pronađena, vraćamo niza upita vezanih za tu nekretninu
        return nekretnina.upiti;
        }

        return null; // Ako nekretnina nije pronađena vraćamo null
    };

    return {
        init: init,
        filtrirajNekretnine: filtrirajNekretnine,
        ucitajDetaljeNekretnine: ucitajDetaljeNekretnine,
        postaviUpitZaNekretninu: postaviUpitZaNekretninu,
        ucitajUpiteZaNekretninu: ucitajUpiteZaNekretninu
    };
};

