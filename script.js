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

    if (registros.length > 0 || totalMinutosTrabalhados > 0) {
        calcularTotal();
    } else {
        verValorBruto.textContent = "R$0.00";
        calcularValorLiquido();
    }

});



// ----------------------------------------------------------------------

// PASSO 2

// puxar do html para JS
const passo2 = document.getElementById('passo2');
const formEditar = document.getElementById('formEditar');
const dataE = document.getElementById('dataE');
const editDataE = document.getElementById('editDataE');
const entradaHoras = document.getElementById('hEntrada');
const editEntradaHoras = document.getElementById('editHoraE');
const dataS = document.getElementById('dataS');
const editDataS = document.getElementById('editDataS');
const saidaHoras = document.getElementById('hSaida');
const editSaidaHoras = document.getElementById('editHoraS');
const HSaidaD = document.getElementById('hSaidaD');
const editHSaidaD = document.getElementById('editSaidaD');
const HVoltaD = document.getElementById('hVoltaD');
const editHVoltaD = document.getElementById('editVoltaD');
const dados = document.getElementById('dados');
const verSomaHoras = document.getElementById('totalHoraGeral');
const verValorBruto = document.getElementById('valorBruto');
const modalEditar = document.getElementById('modalEditar');
const btnCancelarEdicao = document.getElementById('cancelarEdicao');
const resetarDadosBtn = document.getElementById('resetarDados');
const STORAGE_KEY = 'calculadoraTrabalhoDados';

// armazenar o valor dentro da variavel
let dtEntrada = 0;
let editDtEntrada = 0;
let horasE = 0;
let editHorasE = 0;
let dtSaida = 0;
let editDtSaida = 0;
let horasS = 0;
let editHorasS = 0;
let saidaDescanso = 0;
let editSaidaDescanso = 0;
let voltaDescanso = 0;
let editVoltaDescanso = 0;

// armazenar dentro de um array o objeto
let registros = [];
let indiceEditando = null;

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

function calcularHorasTrabalhadas() {
    // pega os dados do formulário
    dtEntrada = dataE.value;
    horasE = entradaHoras.value;
    dtSaida = dataS.value;
    horasS = saidaHoras.value;
    saidaDescanso = HSaidaD.value;
    voltaDescanso = HVoltaD.value;

    // separa-os em array e faz conversões
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
}

function abrirModalEdicao(indice) {
    const registro = registros[indice];
    indiceEditando = indice;
    const dataEntrada = registro.dataEntrada.split("/").reverse().join("-");
    const dataSaida = registro.dataSaida.split("/").reverse().join("-");

    editDataE.value = dataEntrada;
    editEntradaHoras.value = registro.horasEntrada;
    editDataS.value = dataSaida;
    editSaidaHoras.value = registro.horasSaida;
    editHSaidaD.value = registro.saidaDescanso;
    editHVoltaD.value = registro.voltaDescanso;
    modalEditar.style.display = 'flex';
}

function fecharModalEdicao() {
    indiceEditando = null;
    modalEditar.style.display = 'none';
    formEditar.reset();
}

function salvarDadosLocalmente() {
    const dadosParaSalvar = {
        valorHr,
        registros,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(dadosParaSalvar));
}

function limparDados() {
    registros = [];
    valorHr = 0;
    valorBruto = 0;
    totalMinutosTrabalhados = 0;
    totalHorasDecimal = 0;

    valorHora.value = '';
    valorHora.disabled = false;
    verValorHora.textContent = '';
    passo1.classList.remove('concluido');

    dados.innerHTML = '';
    verSomaHoras.textContent = '0h0min';
    verValorBruto.textContent = 'R$0';
    document.getElementById('desconto').value = '';
    document.getElementById('somar').value = '';
    document.getElementById('valorDesconto').textContent = 'R$0';
    document.getElementById('valorSomar').textContent = 'R$0';
    document.getElementById('valorLiquido').textContent = 'R$0';
    localStorage.removeItem(STORAGE_KEY);
}

function carregarDadosLocalmente() {
    const dadosSalvos = localStorage.getItem(STORAGE_KEY);

    if (!dadosSalvos) {
        return;
    }

    try {
        const dados = JSON.parse(dadosSalvos);

        if (dados.valorHr) {
            valorHr = Number(dados.valorHr);
            valorHora.value = valorHr;
            valorHora.disabled = true;
            verValorHora.textContent = ' R$ ' + valorHr;
            passo1.classList.add('concluido');
        }

        if (Array.isArray(dados.registros)) {
            registros = dados.registros;
            mostrarRegistros();
            calcularTotal();
        }
    } catch (erro) {
        console.error('Erro ao carregar os dados salvos:', erro);
    }
}

function excluirRegistro(indice) {
    registros.splice(indice, 1);
    mostrarRegistros();
    calcularTotal();
}

function editarRegistro(indice) {
    abrirModalEdicao(indice);
}

resetarDadosBtn.addEventListener('click', function () {
    limparDados();
});

formEditar.addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (indiceEditando === null) {
        return;
    }

    const dtEntradaEditada = editDataE.value;
    const horasEEditada = editEntradaHoras.value;
    const dtSaidaEditada = editDataS.value;
    const horasSEditada = editSaidaHoras.value;
    const saidaDescansoEditado = editHSaidaD.value;
    const voltaDescansoEditado = editHVoltaD.value;

    const registroAtualizado = {
        dataEntrada: dtEntradaEditada.split("-").reverse().join("/"),
        horasEntrada: horasEEditada,
        dataSaida: dtSaidaEditada.split("-").reverse().join("/"),
        horasSaida: horasSEditada,
        saidaDescanso: saidaDescansoEditado,
        voltaDescanso: voltaDescansoEditado,
    };

    const totalMinInicio = (parseFloat(horasEEditada.split(":")[0]) * 60) + parseFloat(horasEEditada.split(":")[1]);
    const totalMinFim = (parseFloat(horasSEditada.split(":")[0]) * 60) + parseFloat(horasSEditada.split(":")[1]);
    const totalMinInicioDescanso = (parseFloat(saidaDescansoEditado.split(":")[0]) * 60) + parseFloat(saidaDescansoEditado.split(":")[1]);
    const totalMinFimDescanso = (parseFloat(voltaDescansoEditado.split(":")[0]) * 60) + parseFloat(voltaDescansoEditado.split(":")[1]);
    const descansoTotal = totalMinFimDescanso - totalMinInicioDescanso;

    let tempoTrabalhado = 0;

    if (totalMinFim >= totalMinInicio) {
        tempoTrabalhado = (totalMinFim - totalMinInicio) - descansoTotal;
    } else {
        tempoTrabalhado = ((1440 - totalMinInicio) + totalMinFim) - descansoTotal;
    }

    registroAtualizado.tempoDescanso = `${Math.floor(descansoTotal / 60)}h ${descansoTotal % 60}min`;
    registroAtualizado.tempoTrabalhado = `${Math.floor(tempoTrabalhado / 60)}h ${tempoTrabalhado % 60}min`;
    registroAtualizado.totalMinutos = tempoTrabalhado;

    registros[indiceEditando] = { ...registros[indiceEditando], ...registroAtualizado };

    mostrarRegistros();
    calcularTotal();
    fecharModalEdicao();
});

btnCancelarEdicao.addEventListener('click', fecharModalEdicao);
modalEditar.addEventListener('click', function (evento) {
    if (evento.target === modalEditar) {
        fecharModalEdicao();
    }
});

function mostrarRegistros() {
    dados.innerHTML = "";

    registros.forEach(function (registro, indice) {
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
                <td>
                    <button onclick="excluirRegistro(${indice})"> Excluir </button>
                    <button onclick="editarRegistro(${indice})"> Editar </button>
                </td>
            </tr>
        `;
    });
}

function calcularTotal() {
    let totalMinutos = 0;
    registros.forEach(function (registro) {
        totalMinutos += Number(registro.totalMinutos || 0);
    });

    let horas = Math.floor(totalMinutos / 60);
    let minutos = totalMinutos % 60;
    totalMinutosTrabalhados = totalMinutos;
    totalHorasDecimal = totalMinutos / 60;

    verSomaHoras.textContent = (horas + "h" + minutos + "min");
    valorBruto = valorHr > 0 ? valorHr * totalHorasDecimal : 0;
    verValorBruto.textContent = ("R$" + valorBruto.toFixed(2));
    calcularValorLiquido();
}

passo2.addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (!valorHr || !dataE.value || !dataS.value || !entradaHoras.value || !saidaHoras.value || !HSaidaD.value || !HVoltaD.value) {
        return;
    }

    calcularHorasTrabalhadas();

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

    if (indiceEditando !== null) {
        registros[indiceEditando] = registro;
        indiceEditando = null;
    } else {
        registros.push(registro);
    }

    mostrarRegistros();
    calcularTotal();
    salvarDadosLocalmente();
    passo2.reset();
    calcularValorLiquido();
});

carregarDadosLocalmente();

// ---------------------------------------------------------------------------
// PASSO 3

const passo3 = document.getElementById('formPasso3');
const VDesc = document.getElementById('desconto');
const VAcres = document.getElementById('somar');
const verValorDesc = document.getElementById('valorDesconto');
const verValorAcres = document.getElementById('valorSomar');
const verValorLiqui = document.getElementById('valorLiquido');

let valorDesconto = 0.0;
let valorAcrescimo = 0.0;
let valorLiquido = 0.0;

function calcularValorLiquido() {
    valorDesconto = parseFloat(VDesc.value) || 0.0;
    valorAcrescimo = parseFloat(VAcres.value) || 0.0;

    valorLiquido = (valorBruto - valorDesconto) + valorAcrescimo;

    verValorDesc.textContent = ("R$" + valorDesconto.toFixed(2));
    verValorAcres.textContent = ("R$" + valorAcrescimo.toFixed(2));
    verValorLiqui.textContent = ("R$" + valorLiquido.toFixed(2));
}

VDesc.addEventListener("input", calcularValorLiquido);
VAcres.addEventListener("input", calcularValorLiquido);

passo3.addEventListener("submit", function (evento) {
    evento.preventDefault();
    calcularValorLiquido();
});



