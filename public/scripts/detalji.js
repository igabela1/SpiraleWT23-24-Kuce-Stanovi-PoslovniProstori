
document.addEventListener("DOMContentLoaded", function() {
    PoziviAjax.getKorisnik(promijeniMeni);
    var id = new URLSearchParams(window.location.search).get('id');
});

function promijeniMeni(error, korisnik) {
        var menu = document.getElementById('meni-lista');
        if (korisnik) {
            menu.innerHTML = '<li><a onclick = "PoziviAjax.postLogout(prebaci)">Odjava</a></li>' +
            '<li><a href="profil.html">Profil</a></li>' +
            '<li><a href="nekretnine.html">Nekretnine</a></li>';
            document.getElementById("dodajUpit").style.display = "grid";
        } 
}

window.logout = function() {
    PoziviAjax.postLogout(prebaci);
}

function prebaci(error, data){
    if(!error)
        window.location.href = "/api/nekretnitne.html";
}
