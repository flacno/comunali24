// Liste e candidati
const candidates = {
  "San Gavino Monreale - Città Futura": [
    "Stefano Altea", "Simone Angei", "Maria Ariu", "Davide Atzeni", "Silvio Boi", 
    "Rachele Carrisi", "Valentina Maura Cirronis", "Alessia Cossu", "Cruccu Emanuela", 
    "Angela Deidda", "Gianluca Figus", "Daniela Marongiu", "Fabio Orrù", "Claudia Pinna", 
    "Riccardo Pinna", "Antonio Podda (noto Lello)", "Luca Senis"
  ],
  "Civico 24-29": [
    "Bebo Casu", "Giuseppina Angela Chessa", "Fabio Meloni", "Giulia Figus", 
    "Nicola Orrù", "Antonella Matzeu", "Matteo Murgia", "Daniele Usai", "Sabrina Inconis", 
    "Barbara Collu", "Silvia Mamusa", "Marco Sebis", "Luigi Esposito", "Laura Follesa", 
    "Gian Mario Batzella", "Luciano Montis", "Roberto Mingoia"
  ],
  "San Gavino al Centro": [
    "Nicola Ennas", "Annalisa Ariu", "Fabrizio Atzeni", "Angela Canargiu", "Valeria Farci", 
    "Stefano Garofano", "Libero Lai", "Francesco Lilliu", "Francesca Lixi", "Mara Murgia", 
    "Alessandro Piras", "Sonia Putzu", "Maria Bonaria Secci (nota Rinella)", "Enrico Tinti", 
    "Creola Merella", "Giorgio Pia", "Paolo Alessandro Piras"
  ]
};

// Popola i candidati in base alla lista selezionata
document.getElementById('lista').addEventListener('change', function() {
  const lista = this.value;
  const candidatoSelect = document.getElementById('candidato');
  candidatoSelect.innerHTML = '';

  candidates[lista].forEach(function(candidato) {
    const option = document.createElement('option');
    option.value = candidato;
    option.textContent = candidato;
    candidatoSelect.appendChild(option);
  });
});

// Inizializza i candidati per la lista predefinita
document.getElementById('lista').dispatchEvent(new Event('change'));

// Aggiungi evento al form
document.getElementById('preference-form').addEventListener('submit', submitPreference);

function submitPreference(e) {
  e.preventDefault();
  const lista = document.getElementById('lista').value;
  const candidato = document.getElementById('candidato').value;
  const preferenze = parseInt(document.getElementById('preferenze').value);

  fetch('/submit-preference', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ lista, candidato, preferenze })
  })
  .then(response => response.text())
  .then(data => {
    console.log(data);
    loadPreferences();
  });

  document.getElementById('preference-form').reset();
  document.getElementById('lista').dispatchEvent(new Event('change'));
}

// Carica le preferenze iniziali
function loadPreferences() {
  fetch('/get-preferences')
    .then(response => response.json())
    .then(data => {
      const listaTotals = {};
      const candidatoTotals = {};

      data.forEach(preference => {
        if (listaTotals[preference.lista]) {
          listaTotals[preference.lista] += preference.preferenze;
        } else {
          listaTotals[preference.lista] = preference.preferenze;
        }

        if (candidatoTotals[preference.candidato]) {
          candidatoTotals[preference.candidato] += preference.preferenze;
        } else {
          candidatoTotals[preference.candidato] = preference.preferenze;
        }
      });

      const listaTotalsElement = document.getElementById('lista-totals');
      listaTotalsElement.innerHTML = '';
      for (const [lista, total] of Object.entries(listaTotals)) {
        const li = document.createElement('li');
        li.textContent = `${lista}: ${total}`;
        listaTotalsElement.appendChild(li);
      }

      const candidatoTotalsElement = document.getElementById('candidato-totals');
      candidatoTotalsElement.innerHTML = '';
      for (const [candidato, total] of Object.entries(candidatoTotals)) {
        const li = document.createElement('li');
        li.textContent = `${candidato}: ${total}`;
        candidatoTotalsElement.appendChild(li);
      }
    });
}

// Carica le preferenze al caricamento della pagina
loadPreferences();

// Aggiungi evento al pulsante di reset
document.getElementById('reset-button').addEventListener('click', function() {
  fetch('/reset-preferences', { method: 'POST' })
    .then(response => response.text())
    .then(data => {
      console.log(data);
      loadPreferences();
    });
});
