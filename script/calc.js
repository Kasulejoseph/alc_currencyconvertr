if (!('indexedDB' in window)) {
  console.log('This browser doesn\'t support IndexedDB');
}

var dbPromise = idb.open('currency-converter', 1, function (upgradeDb) {
  switch (upgradeDb.oldVesrion) {
    case 0:
      upgradeDb.createObjectStore('currency', {
        keyPath: 'id'
      });
  }
});

const apiKey = '7b036b846f05a1a1ef4e'
fetch(`https://free.currencyconverterapi.com/api/v5/currencies?q=compact=ultra&apiKey=${apiKey}`)
  .then(
    response => {
      if (response.status !== 200) {
        console.log(`Looks like there was a problem. Status Code: ${response.status}`);
        return;
      }
      response.json().then(results => {
        let currencySelect;
        let i;
        currencySelect = document.querySelectorAll('.currencyChange');

        for (i = 0; i < currencySelect.length; i++) {
          currencySelect[i].length = 0;
          let defaultCurrency = document.createElement('option');
          defaultCurrency.text = 'Select a Currency';
          currencySelect[i].add(defaultCurrency);
          currencySelect[i].selectedIndex = 0;
          let option;
          for (const result in results) {
            for (const id in results[result]) {

              let data = results[result][id]['id'];

              option = document.createElement('option');
              option.text = data;
              currencySelect[i].add(option)
            }
          }
        }

      });
    }
  )
  .catch(err => {
    console.log('Fetch Error :-S', err);
  });

document.getElementById('convert').onclick = calculateAmt;

function calculateAmt() {

  let frmCurrency = document.getElementById('currencyFrm').value;

  let toCurrency = document.getElementById('currencyTo').value;

  let query = `${frmCurrency}_${toCurrency}`;

  amt = document.getElementById('amount').value;

  fetch('https://free.currencyconverterapi.com/api/v6/convert?q=' +
      query + '&compact=ultra&apiKey=' + apiKey)
    .then(
      response => {
        if (response.status !== 200) {
          console.log(`Looks like there was a problem. Status Code: ${response.status}`);
          return;
        }

        // Examine the text in the response
        response.json().then(data => {
          console.log(data);

          for (query in data) {
            if (data.hasOwnProperty(query)) {
              let exchangeRate = data[query];
              let total = amt * exchangeRate;
              let currConv = Math.round(total * 100) / 100;
              console.log(currConv);
              document.getElementById('output').value = currConv;
            }
          }
        });
      }
    )
    .catch(err => {
      console.log('Fetch Error :-S', err);
    });
}