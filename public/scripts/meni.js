// meni.js
document.addEventListener("DOMContentLoaded", function () {
    // Simulacija korisničkog stanja (prijavljen ili nije)
    var korisnikPrijavljen = false;

    // Inicijalizacija menija
    promijeniMeni(korisnikPrijavljen);
});

function promijeniMeni(prijavljen) {
    var meniLista = document.getElementById("meni-lista");

    if (prijavljen) {
        // Ako je korisnik prijavljen
        meniLista.innerHTML = '<li><a href="#">Odjava</a></li>' +
                              '<li><a href="profil.html">Profil</a></li>' +
                              '<li><a href="nekretnine.html">Nekretnine</a></li>' +
                              '<li><a href="detalji.html">Detalji</a></li>';
    } else {
        // Ako korisnik nije prijavljen
        meniLista.innerHTML = '<li><a href="nekretnine.html">Nekretnine</a></li>' +
                              '<li><a href="detalji.html">Detalji</a></li>' +
                              '<li><a href="prijava.html">Prijava</a></li>';
    }
}
