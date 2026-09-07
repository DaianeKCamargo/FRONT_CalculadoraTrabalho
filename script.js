// PASSO 1
const passo1 = document.getElementById('passo1');
const valorHora = document.getElementById('valor');
const verValorHora = document.getElementById('valorHora');

let valorHr = 0;

passo1.addEventListener("submit", function (evento) {
    evento.preventDefault();
    valorHr = parseFloat(valorHora.value);
    valorHora.disabled = true;
    verValorHora.textContent = (" R$ " + valorHr);

    passo1.classList.add("concluido");

});



// ----------------------------------------------------------------------

// PASSO 2

// puxar do html para JS
const passo2 = document.getElementById('passo2');
const dataE = document.getElementById('dataE');
const entradaHoras = document.getElementById('hEntrada');
const dataS = document.getElementById('dataS')
const saidaHoras = document.getElementById('hSaida');
const HSaidaD = document.getElementById('hSaidaD');
const HVoltaD = document.getElementById('hVoltaD');
const dados = document.getElementById('dados');
const verSomaHoras = document.getElementById('totalHoraGeral');
const verValorBruto = document.getElementById('valorBruto');



// armazenar o valor dentro da variavel
let dtEntrada = 0;
let horasE = 0;
let dtSaida = 0;
let horasS = 0;
let saidaDescanso = 0;
let voltaDescanso = 0;

// armazenar dentro de um array o objeto
let registros = [];


// conversão para o calculo de horas
let hrsEntrada = 0;
let minutosEntrada = 0;
let hrsSaida = 0;
let minutosSaida = 0;
let hrsSaidaD = 0;
let minutosSaidaD = 0;
let hrsVoltaD = 0;
let minutosVoltaD = 0;
let dataFormatadaE = 0;
let dataFormatadaS = 0;
let totalMinEntrada = 0;
let totalMinSaida = 0;
let totalMinSDescanso = 0;
let totalMinVDescanso = 0;

// calculo de horas
let tempoDiaTrabalhado = 0;
let tempoDiaDescanso = 0;
let totalHDescanso = 0;
let totalMinDescanso = 0;
let totalDHoras = 0;
let totalDMinutos = 0;
let totalMinutosTrabalhados = 0;
let totalGHoras = 0;
let totalGMinutos = 0;
let totalHorasDecimal = 0;
let valorBruto = 0;

function mostrarRegistros() {
    dados.innerHTML = "";

    registros.forEach (function(registro) {
        dados.innerHTML += `
            <tr> 
                <td>${registro.dataEntrada}</td>
                <td>${registro.horasEntrada}</td>
                <td>${registro.dataSaida}</td>
                <td>${registro.horasSaida}</td>
                <td>${registro.saidaDescanso}</td>
                <td>${registro.voltaDescanso}</td>
                <td>${registro.tempoDescanso}</td>
                <td>${registro.tempoTrabalhado}</td>
            </tr>
        `;
    });
}

function calcularTotal() {
    let totalMinutos = 0;
    registros.forEach(function (registro) {
        totalMinutos += registro.totalMinutos;
    });

    let horas = Math.floor(totalMinutos / 60);
    let minutos = totalMinutos % 60;

    verSomaHoras.textContent = (horas + "h" + minutos + "min");
}

passo2.addEventListener("submit", function (evento) {
    evento.preventDefault();
    
    // pega os dados do formulário
    dtEntrada = dataE.value;
    horasE = entradaHoras.value;
    dtSaida = dataS.value;
    horasS = saidaHoras.value;
    saidaDescanso = HSaidaD.value;
    voltaDescanso = HVoltaD.value;
    
    // sepera-os em array e faz conversões
    hrsEntrada = parseFloat(horasE.split(":")[0]);
    minutosEntrada = parseFloat(horasE.split(":")[1]);
    hrsSaida = parseFloat(horasS.split(":")[0]);
    minutosSaida = parseFloat(horasS.split(":")[1]);
    hrsSaidaD = parseFloat(saidaDescanso.split(":")[0]);
    minutosSaidaD = parseFloat(saidaDescanso.split(":")[1]);
    hrsVoltaD = parseFloat(voltaDescanso.split(":")[0]);
    minutosVoltaD = parseFloat(voltaDescanso.split(":")[1]);
    dataFormatadaE = dtEntrada.split("-").reverse().join("/");
    dataFormatadaS = dtSaida.split("-").reverse().join("/");

    // calculo descanso
    totalMinSDescanso = (hrsSaidaD * 60) + minutosSaidaD;
    totalMinVDescanso = (hrsVoltaD * 60) + minutosVoltaD;
    tempoDiaDescanso = totalMinVDescanso - totalMinSDescanso;
    totalHDescanso = Math.floor(tempoDiaDescanso / 60);
    totalMinDescanso = tempoDiaDescanso % 60;
    
    // calculo horas entrada e saida por dia
    totalMinEntrada = (hrsEntrada * 60) + minutosEntrada;
    totalMinSaida = (hrsSaida * 60) + minutosSaida;
    if (totalMinSaida >= totalMinEntrada) {
        tempoDiaTrabalhado = (totalMinSaida - totalMinEntrada) - tempoDiaDescanso;
    } else {
        tempoDiaTrabalhado = ((1440 - totalMinEntrada) + totalMinSaida) - tempoDiaDescanso;
    }
    // Math.floor arredonda para baixo o valor mostrado em float
    totalDHoras = Math.floor(tempoDiaTrabalhado / 60);
    totalDMinutos = tempoDiaTrabalhado % 60;
    
    // calculo total horas geral
    totalMinutosTrabalhados += tempoDiaTrabalhado;
    totalHorasDecimal = totalMinutosTrabalhados / 60;
    totalGHoras = Math.floor(totalHorasDecimal);
    totalGMinutos = totalMinutosTrabalhados % 60;
    
    
    // calculo valor horas
    valorBruto = parseFloat(valorHr * totalHorasDecimal);
    
    // cria um objeto
    let registro = {
        dataEntrada: dataFormatadaE,
        horasEntrada: horasE,
        dataSaida: dataFormatadaS,
        horasSaida: horasS,
        saidaDescanso: saidaDescanso,
        voltaDescanso: voltaDescanso,
        tempoDescanso: `${totalHDescanso}h ${totalMinDescanso}min`,
        tempoTrabalhado: `${totalDHoras}h ${totalDMinutos}min`,
        totalMinutos: tempoDiaTrabalhado
    }
    
    registros.push(registro);
    mostrarRegistros();
    calcularTotal();
   

    console.log(registros);
    
    // Visualização dos dados na tela
    // dados.innerHTML += `<tr><td>${dataFormatadaE}</td><td>${horasE}</td><td>${dataFormatadaS}</td><td>${horasS}</td><td>${saidaDescanso}</td><td>${voltaDescanso}</td><td>${totalHDescanso}h ${totalMinDescanso}min</td><td>${totalDHoras}h ${totalDMinutos}min </td></tr>`;

    verSomaHoras.textContent = (totalGHoras + "h " + totalGMinutos + "min");
    verValorBruto.textContent = ("R$" + valorBruto);
    
});

// ---------------------------------------------------------------------------
// PASSO 3

const passo3 = document.getElementById('passo3');
const VDesc = document.getElementById('desconto');
const VAcres = document.getElementById('somar');
const verValorDesc = document.getElementById('valorDesconto');
const verValorAcres = document.getElementById('valorSomar');
const verValorLiqui = document.getElementById('valorLiquido');

let valorDesconto = 0.0;
let valorAcrescimo = 0.0;
let valorLiquido = 0.0;

passo3.addEventListener("submit", function (evento) {
    evento.preventDefault();

    valorDesconto = parseFloat(VDesc.value) || 0.0;
    valorAcrescimo = parseFloat(VAcres.value) || 0.0;

    valorLiquido = (valorBruto - valorDesconto) + valorAcrescimo;

    verValorDesc.textContent = ("R$" + valorDesconto);
    verValorAcres.textContent = ("R$" + valorAcrescimo);
    verValorLiqui.textContent = ("R$" + valorLiquido);

});



