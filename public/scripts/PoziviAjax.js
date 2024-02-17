const PoziviAjax = (() => {
    function request(url, method, data, fnCallback) {
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: data ? JSON.stringify(data) : null,
            credentials: 'include' 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => fnCallback(null, data))
        .catch(error => fnCallback(error, null));
    }

    function impl_getNekretnine(fnCallback) {
        request('/nekretnine', 'GET', null, fnCallback);
}


 function impl_getKorisnik(fnCallback) {
        request('/korisnik', 'GET', null, fnCallback);
    }

    function impl_putKorisnik(noviPodaci, fnCallback) {
        request('/korisnik', 'PUT', noviPodaci, fnCallback);
    }

    function impl_postUpit(nekretnina_id, tekst_upita, fnCallback) {
        request('/upit', 'POST', { nekretnina_id, tekst_upita }, fnCallback);
    }

    function impl_postLogin(username, password, fnCallback) {
        request('/login', 'POST', { username, password }, fnCallback);
    }

    function impl_postLogout(fnCallback) {
        request('/logout', 'POST', null, fnCallback);
    }

    function impl_getNekretninaById(nekretnina_id, fnCallback) {
        // Send a POST request to track a click for a specific property
        fetch(`/nekretnina/${nekretnina_id}`, {
            method: "GET",           
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => fnCallback(null, data))
        .catch(error => fnCallback(error, null));
    }


    return {
        postLogin: impl_postLogin,
        postLogout: impl_postLogout,
        getKorisnik: impl_getKorisnik,
        putKorisnik: impl_putKorisnik,
        postUpit: impl_postUpit,
        getNekretnine: impl_getNekretnine,
        getNekretninaById : impl_getNekretninaById
    };

})();
