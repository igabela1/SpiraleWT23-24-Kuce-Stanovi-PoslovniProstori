let divNekretnine = document.getElementById("filter-nekretnine");

let previousProperty = null;
// Kopirati u svaki kao provjeru za prijavljenog korisnika ili ako je veća razlika u izgledu stranica za 
// prijavljenje korisnike napraviti različite html file za sve

function promijeniMeni(error, korisnik) {
    var meniLista = document.getElementById("meni-lista");

    if (!error && korisnik.username != undefined) {
        // Ako je korisnik prijavljen
        meniLista.innerHTML = '<li><a onclick = "PoziviAjax.postLogout(prebaci)">Odjava</a></li>' +
                              '<li><a href="profil.html">Profil</a></li>' +
                              '<li><a href="nekretnine.html">Nekretnine</a></li>' +
                              '<li><a href="detalji.html">Detalji</a></li>';
    }
}

function prebaci(error, data){
    if(!error)
        window.location.href = '/api/nekretnine.html';
}

function prikaziFilterNekretnine(error, properties) {
    

    document.getElementById("filter-nekretnine").innerHTML = "";    
    const container = document.getElementById("filter-nekretnine");

    properties.forEach(property => {
        // Stvaranje HTML elementa za svaku nekretninu
        const propertyDiv = document.createElement("div");
        propertyDiv.classList.add("nekretnina"); 

        // Postavljanje sadržaja HTML elementa na temelju atributa nekretnine
        propertyDiv.innerHTML = `
            <h4>${property.naziv}</h4>
            <img src="${"../slike/pp2.jpg"}" alt="${property.naziv}">
            <p>Kvadratura: ${property.kvadratura} m²</p>
            <p>Cijena: ${property.cijena} BAM</p>        
            <div id="pretrage-${property.id}">Pretrage: 0</div>
            <div id="klikovi-${property.id}">Klikovi: 0</div>
            <button class="details-button">Detalji</button>
            <div class="detalji"> 
            <p>Lokacija: ${property.lokacija}</p>
            <p>Godina izgradnje: ${property.godina_izgradnje}</p>
            <button class="otvori-detalje" onclick="PoziviAjax.getNekretninaById(${property.id}, prikaziDetalje)">Otvori detalje</button>
            </div>
        `;

        // Dodavanje HTML elementa u odgovarajući kontejner
        container.appendChild(propertyDiv);

        // Dodaj event listener za klik na dugme "Detalji"
        const detaljiBtn = propertyDiv.querySelector(".details-button");
        detaljiBtn.addEventListener("click", () => {  
            if(previousProperty){
            var detalji = previousProperty.querySelector(".detalji");
            detalji.style.display = "none";
            previousProperty.style.width = "300px";  
            }        
            previousProperty = propertyDiv; 
            propertyDiv.style.width = "500px";
            var detalji = propertyDiv.querySelector(".detalji");
            detalji.style.display = "grid";
            MarketingAjax.klikNekretnina(property.id);                        
        });
    });
}


document.addEventListener('DOMContentLoaded', () => {

    // Dodati u svaki poziv sa DOM loaded da se provjeri je li korisnik prijavljen i dodati onu funkciju za promjenu menija
    PoziviAjax.getKorisnik(promijeniMeni);

    const pretragaBtn = document.getElementById('pretragaBtn');
    pretragaBtn.addEventListener('click', () => PoziviAjax.getNekretnine(obradiPretragu));
    
    setInterval(() => {
        MarketingAjax.osvjeziPretrage(divNekretnine);
        MarketingAjax.osvjeziKlikove(divNekretnine);
    }, 500);

    // Poziv za ispis svih nekretnina kad se učita stranica
    PoziviAjax.getNekretnine(prikaziFilterNekretnine);
});


function obradiPretragu(error, nekretnine) {
    const minimalnaCijena = document.getElementById('min-cijena').value || null;
    const maksimalnaCijena = document.getElementById('max-cijena').value || null;
    const minimalnaKvadratura = document.getElementById('min-kvadratura').value || null;
    const maksimalnaKvadratura = document.getElementById('max-kvadratura').value || null;

    const kriteriji = {
        minimalnaCijena: minimalnaCijena ? parseFloat(minimalnaCijena) : null,
        maksimalnaCijena: maksimalnaCijena ? parseFloat(maksimalnaCijena) : null,
        minimalnaKvadratura: minimalnaKvadratura ? parseFloat(minimalnaKvadratura) : null,
        maksimalnaKvadratura: maksimalnaKvadratura ? parseFloat(maksimalnaKvadratura) : null,
    };


    // Provjera da li su svi kriteriji nula
    const sviKriterijiNula = Object.values(kriteriji).every(val => val === null || val === 0);

    // Ako su svi kriteriji nula, prikaži sve nekretnine
    if (sviKriterijiNula) {
        const tipoviNekretninaRedoslijed = ["Stan", "Kuća", "Poslovni prostor"];
        nekretnine.sort((a, b) => {
            const tipA = tipoviNekretninaRedoslijed.indexOf(a.tip_nekretnine);
            const tipB = tipoviNekretninaRedoslijed.indexOf(b.tip_nekretnine);
    
            return tipA - tipB;
        });
        prikaziFilterNekretnine(null, nekretnine);
        return;
    }

    const filtriraneNekretnine = nekretnine.filter(n => {
        return (kriteriji.minimalnaCijena == null || n.cijena >= kriteriji.minimalnaCijena) &&
               (kriteriji.maksimalnaCijena == null || n.cijena <= kriteriji.maksimalnaCijena) &&
               (kriteriji.minimalnaKvadratura == null || n.kvadratura >= kriteriji.minimalnaKvadratura) &&
               (kriteriji.maksimalnaKvadratura == null || n.kvadratura <= kriteriji.maksimalnaKvadratura);
    });
    MarketingAjax.novoFiltriranje(filtriraneNekretnine);
    prikaziFilterNekretnine(null, filtriraneNekretnine);
}

function prikaziDetalje(error, nekretnina) {
    const detaljiURL = `detalji.html?id=${nekretnina.id}`;

    // Otvaranje nove stranice s detaljima nekretnine
    window.location.href = detaljiURL;
}