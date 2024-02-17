// profil.js
document.addEventListener("DOMContentLoaded", function () {
    PoziviAjax.getKorisnik(promijeniMeni);
    var forma = document.querySelector('form');

    forma.addEventListener('submit', function (event) {
        event.preventDefault();

        // Dobavljanje podataka iz forme
        var ime = document.getElementById('ime').value;
        var prezime = document.getElementById('prezime').value;
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;

        // Pozivanje funkcije za slanje podataka
        PoziviAjax.putKorisnik({ ime, prezime, username, password }, function(error, data){
            console.log(data.poruka);
        });
    });
});

function promijeniMeni(error, korisnik) {
        if(korisnik == null) {
            document.body.innerHTML = "<h2>Niste prijavljeni</h4>";
        }
}

function prebaci(error, data){
    window.location.href = '/api/nekretnine.html';
}
