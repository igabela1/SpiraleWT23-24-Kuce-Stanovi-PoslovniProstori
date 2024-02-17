
document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById('forma-prijava');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const menu = document.getElementById('meni-lista');

  
    loginForm.addEventListener("submit", function(event) {
    event.preventDefault();  

  
    const username = usernameInput.value;
    const password = passwordInput.value;

    PoziviAjax.postLogin(username, password, function(error, data){
        if(!error && data.poruka == 'Uspješna prijava')
            window.location.href = "/api/nekretnine.html";
    });
    });
});

window.logout = function() {
        PoziviAjax.postLogout(prebaci);
}

function prebaci(error, data){
    if(!error)
        window.location.href = "/api/nekretnitne.html";
}
