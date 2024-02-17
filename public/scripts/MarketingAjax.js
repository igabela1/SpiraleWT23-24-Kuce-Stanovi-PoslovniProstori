
const MarketingAjax = (() => {
  let nekretnine = null;
  function impl_klikNekretnina(idNekretnine){
      // Send a POST request to track a click for a specific property
      fetch(`/marketing/nekretnina/${idNekretnine}`, {
        method: "POST",
      })
        .then((response) => {
          if (response.ok) {
            console.log("Click tracked successfully.");
          } else {
            console.error("Failed to track click.");
          }
        })
        .catch((error) => {
          console.error("Error tracking click:", error);
        });
    }

    function impl_novoFiltriranje(listaFiltriranihNekretnina) {
      // Extract IDs from the list of real estate objects
      const nizNekretnina = listaFiltriranihNekretnina.map(nekretnina => nekretnina.id);
    
      // Send a POST request for new filtering
      fetch("/marketing/nekretnine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nizNekretnina: nizNekretnina }),
      })
        .then((response) => {
          if (response.ok) {
            console.log("New filtering data sent successfully.");
          } else {
            console.error("Failed to send new filtering data.");
          }
        })
        .catch((error) => {
          console.error("Error sending new filtering data:", error);
        });
    }
    

    function impl_osvjeziPretrage (divNekretnine) {
      // Selektujemo sve div-ove čiji ID počinje s "pretrage-"
      const divoviPretrage = divNekretnine.querySelectorAll('[id^="pretrage-"]');
      // Prolazimo kroz sve div-ove i izvlačimo ID-ove
      const nizNekretnina = [];
      divoviPretrage.forEach(div => {
          const id = div.id.replace('pretrage-', ''); // Uklanjamo "pretrage-" iz ID-a
          nizNekretnina.push(id);
      });
      
  
      if (nizNekretnina.length > 0) {
        // Send a POST request to update views
        fetch("/marketing/osvjezi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nizNekretnina : nizNekretnina }),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              console.error("Failed to update views.");
            }
          })
          .then((data) => {
            if (data) {
              data.nizNekretnina.forEach((nekretnina) => {
                const pretrageDiv = document.getElementById(`pretrage-${nekretnina.id}`);
                if (pretrageDiv) {
                  pretrageDiv.innerText = `Pretrage: ${nekretnina.pretrage}`;
                }
              });
            }
          })
          .catch((error) => {
            console.error("Error updating views:", error);
          });
      }
    }
  
    function impl_osvjeziKlikove (divNekretnine){
      // Selektujemo sve div-ove čiji ID počinje s "pretrage-"
const divoviPretrage = divNekretnine.querySelectorAll('[id^="pretrage-"]');
// Prolazimo kroz sve div-ove i izvlačimo ID-ove
const nizNekretnina = [];
divoviPretrage.forEach(div => {
  const id = div.id.replace('pretrage-', ''); // Uklanjamo "pretrage-" iz ID-a
  nizNekretnina.push(id);
});

if (nizNekretnina.length > 0) {
        // Send a POST request to update clicks
        fetch("/marketing/osvjezi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nizNekretnina : nizNekretnina }),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              console.error("Failed to update clicks.");
            }
          })
          .then((data) => {
            if (data) {
              
              data.nizNekretnina.forEach((nekretnina) => {
                const klikoviDiv = document.getElementById(`klikovi-${nekretnina.id}`);
                if (klikoviDiv) {
                  klikoviDiv.innerText = `Klikovi: ${nekretnina.klikovi}`;
                }
              });
            }
          })
          .catch((error) => {
            console.error("Error updating clicks:", error);
          });
      }
    }
    
  return {
      osvjeziKlikove : impl_osvjeziKlikove,
      osvjeziPretrage : impl_osvjeziPretrage,
      novoFiltriranje : impl_novoFiltriranje,
      klikNekretnina : impl_klikNekretnina
  };
})();

