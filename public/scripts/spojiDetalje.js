document.addEventListener("DOMContentLoaded", function() {
    var id = new URLSearchParams(window.location.search).get('id');
    PoziviAjax.getNekretninaById(id, ispisi);
});

function ispisi(error, nekretnina){
    console.log(nekretnina);
}