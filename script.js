// PASSO 1
const passo1 = document.getElementById('passo1');
const valorHora = document.getElementById('valor');
const verValorHora = document.getElementById('valorHora');

let valorHr = 0;

passo1.addEventListener("submit", function (evento) {
    evento.preventDefault();
    valorHr = parseFloat(valorHora.value);
    verValorHora.textContent = (" R$ " + valorHr);
});

// PASSO 2
const passo2 = document.getElementById('passo2');
const dataE = document.getElementById('dataE');
const entradaHoras = document.getElementById('hEntrada');
const dataS = document.getElementById('dataS')
const saidaHoras = document.getElementById('hSaida');

let dtEntrada = 0;
let horasE = 0;
let dtSaida = 0;
let horasS = 0;

let hrsEntrada = 0;
let minutosEntrada = 0;
let hrsSaida = 0;
let minutosSaida = 0;
let tempoDiaTrabalhado = 0;

passo2.addEventListener("submit", function (evento) {
    evento.preventDefault();

    dtEntrada = dataE.value;
    horasE = entradaHoras.value;
    dtSaida = dataS.value;
    horasS = saidaHoras.value; 

    hrsEntrada = parseFloat(horasE.split(":")[0]);
    minutosEntrada = parseFloat(horasE.split(":")[1]);
    hrsSaida = parseFloat(horasS.split(":")[0]);
    minutosSaida = parseFloat(horasS.split(":")[1]);

    totalMinEntrada = (hrsEntrada * 60) + minutosEntrada;
    totalMinSaida = (hrsSaida * 60) + minutosSaida;

    if (totalMinSaida > totalMinEntrada) {
        tempoDiaTrabalhado = totalMinSaida - totalMinEntrada
    } else {
        tempoDiaTrabalhado = (1440 - totalMinEntrada) + totalMinSaida
    }


    console.log(typeof totalMinEntrada);
    console.log(typeof totalMinSaida);

    console.log(tempoDiaTrabalhado);

});