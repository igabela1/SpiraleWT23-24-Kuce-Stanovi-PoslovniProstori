function posalji(){
    var id = new URLSearchParams(window.location.search).get('id');
    var tekst = document.getElementById("tekst").value;
    PoziviAjax.postUpit(id, tekst, vrati);
}

function vrati(error, data){
    console.log(data.poruka);
}