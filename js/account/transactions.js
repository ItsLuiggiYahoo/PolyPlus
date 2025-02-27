setTimeout(function () {}, 100)

/*
let Currencies;

LoadFile(chrome.runtime.getURL('js/resources/currencies.json'), function(text){
    Currencies = JSON.parse(text)
    console.log(new Date(Currencies.Date).toLocaleDateString("en-US", {day:"numeric",month:"long",year:"numeric"}), Currencies)
})
*/

let Utilities;
(async () => {
    Utilities = await import(chrome.runtime.getURL('/js/resources/utils.js'));
    Utilities = Utilities.default
})();

let Nav = document.querySelector('.nav-pills')
let DIV = document.createElement('div')
DIV.innerHTML = `
<input id="polyplus-brickconverter-input" type="number" class="form-control bg-dark mb-2" placeholder="How many Bricks?">
<input id="polyplus-brickconverter-output" type="text" class="form-control bg-dark mb-2" placeholder="Result" disabled>
<select id="polyplus-brickconverter-type" class="form-select bg-dark mb-2">
    <option value="USD" selected>United States Dollar (USD)</option>
    <option value="EUR">Euro (EUR)</option>
    <option value="CAD">Canadian Dollar (CAD)</option>
    <option value="GBP">Great British Pound (GBP)</option>
    <option value="MXN">Mexican Peso (MXN)</option>
    <option value="AUD">Australian Dollar (AUD)</option>
    <option value="TRY">Turkish Lira (TRY)</option>
</select>
<!--
<select id="polyplus-brickconverter-package" class="form-select bg-dark">
    <option value="0" selected>$0.99 USD</option>
    <option value="1">$4.99 USD</option>
    <option value="2">a</option>
    <option value="3">b</option>
    <option value="4">c</option>
    <option value="5">d</option>
</select>
-->
`
Nav.appendChild(document.createElement('hr'))
Nav.appendChild(DIV)

let Input = document.getElementById('polyplus-brickconverter-input')
let Output = document.getElementById('polyplus-brickconverter-output')
let Type = document.getElementById('polyplus-brickconverter-type')
chrome.storage.sync.get(['PolyPlus_Settings'], function(result){
    Type.selectedIndex = result.PolyPlus_Settings.IRLPriceWithCurrencyCurrency || 0
});
//let Package = document.getElementById('polyplus-brickconverter-package')

Input.addEventListener('input', function(){
    Update()
});

Type.addEventListener('change', function(){
    Update()
});

/*
Package.addEventListener('change', function(){
    Update()
});
*/

async function Update(){
    //let DISPLAY = Type.options[Type.selectedIndex].value
    //let IRL = (parseInt(Input.value.replace(/,/g, '')) * Currencies.Data[Package.selectedIndex][DISPLAY]).toFixed(2)
    const Result = await Utilities.CalculateIRL(Input.value, Type.selectedIndex)
    console.log(Input.value, Type.options[Type.selectedIndex].value, Result)
    Output.value = "$" + Result.bricks  + " " + Result.display
}

function LoadFile(path, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () { return callback(this.responseText); }
    xhr.open("GET", path, true);
    xhr.send();
}