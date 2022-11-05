class Despesas {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }
    validarDados() {
        for (let i in this) {
            if (this[i] == null || this[i] == '' || this[i] == undefined) {
                return false;
            }
        }

        if (parseInt(this.ano) < 1900 || this.ano.length != 4 || parseInt(this.ano) > 3000) {
            return false;

        } else {
            if (parseInt(this.dia) > 31 || parseInt(this.dia) < 1) {
                return false;
            } else {
                if (parseFloat(this.valor) < 0) {
                    return false;
                }
                else {
                    return true;
                }
            }

        }
    }
}

class Bd {
    constructor() {
        if (localStorage.getItem("id") == null) {
            localStorage.setItem("id", 0);
        }
    }
    getProxId() {
        return (parseInt(localStorage.getItem("id")) + 1);
    }
    gravar(d) {
        let id = this.getProxId();
        localStorage.setItem(id, JSON.stringify(d));
        localStorage.setItem("id", id);

    }
    carregar() {
        let totalMes = Array();
        let total = 0;
        let totalTipo = Array();
        let id = localStorage.getItem("id");
        let despesas = Array();
        for (let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i));
            if (despesa == null) continue;
            despesa.id = i;
            despesas.push(despesa);
        }
        //total
        despesas.forEach(function (d) {
            total += parseFloat(d.valor);
        });
        //total mes
        for (let i = 1; i <= 12; i++) {
            totalMes[i] = 0;
            despesas.filter(o => o.mes == i.toString()).forEach(function (d) {
                totalMes[i] += parseFloat(d.valor);
            });
        }
        //total tipo
        for (let i = 1; i <= 5; i++) {
            totalTipo[i] = 0;
            despesas.filter(o => o.tipo == i.toString()).forEach(function (d) {
                totalTipo[i] += parseFloat(d.valor);
            });
        }

        despesas.totalTipo = totalTipo;
        despesas.totalMes = totalMes;
        despesas.total = total;
        return despesas;
    }
    pequisar(d) {
        let despesasFiltradas = Array();
        despesasFiltradas = this.carregar();
        if (d.ano != "") {
            despesasFiltradas = despesasFiltradas.filter(o => o.ano == d.ano);
        }
        if (d.mes != "") {
            despesasFiltradas = despesasFiltradas.filter(o => o.mes == d.mes);
        }
        if (d.dia != "") {
            despesasFiltradas = despesasFiltradas.filter(o => o.dia == d.dia);
        }
        if (d.tipo != "") {
            despesasFiltradas = despesasFiltradas.filter(o => o.tipo == d.tipo);
        }
        if (d.descricao != "") {
            despesasFiltradas = despesasFiltradas.filter(o => o.descricao == d.descricao);
        }
        if (d.valor != "") {
            despesasFiltradas = despesasFiltradas.filter(o => o.valor == d.valor);
        }
        return despesasFiltradas;

    }
    remover(id) {
        localStorage.removeItem(id);
    }


}

let bd = new Bd;
let btnDeleteSelect;
let totalTipo;
let totalMes;
function zerarCampos() {
    document.getElementById("ano").value = "";
    document.getElementById("mes").value = "";
    document.getElementById("dia").value = "";
    document.getElementById("tipo").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("valor").value = "";
}
function cadastrarDespesas() {
    let despesas = new Despesas(document.getElementById("ano").value,
        document.getElementById("mes").value,
        document.getElementById("dia").value,
        document.getElementById("tipo").value,
        document.getElementById("descricao").value,
        document.getElementById("valor").value);
    if (despesas.validarDados()) {
        bd.gravar(despesas);
        zerarCampos();
        $('#okGravacao').modal('show');
    } else {
        $('#erroGravacao').modal('show');
    }
}
function inserirDadosTabela(despesas) {
    let listaDespesas = document.getElementById("tabelaDespesas");
    listaDespesas.innerHTML = "";
    despesas.forEach(function (d) {
        let linha = listaDespesas.insertRow();
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;
        switch (d.tipo) {
            case "1": d.tipo = "Alimentação";
                break;
            case "2": d.tipo = "Educação";
                break;
            case "3": d.tipo = "Lazer";
                break;
            case "4": d.tipo = "Saúde";
                break;
            case "5": d.tipo = "Transporte";
                break;
        }
        linha.insertCell(1).innerHTML = d.tipo;
        linha.insertCell(2).innerHTML = d.descricao;
        linha.insertCell(3).innerHTML = parseFloat(d.valor).toFixed(2);
        let btn = document.createElement("button");
        btn.className = "btn btn-danger btn-delete-tab";
        btn.innerHTML = '<i class="bi bi-x-lg"></i>';
        btn.id = `id-despesa-${d.id}`
        btn.onclick = function () {
            $("#excluirDespesa").modal("show");
            let id = this.id.replace("id-despesa-", "");
            btnDeleteSelect = id;

        }
        linha.insertCell(4).append(btn);
        // Inserir valores totais

    })

    document.getElementById("valor-total").innerHTML = "R$ " + despesas.total.toFixed(2);
    document.getElementById("valor-mes").innerHTML = "R$ " + despesas.totalMes[1].toFixed(2);
    document.getElementById("valor-tipo").innerHTML = "R$ " + despesas.totalTipo[1].toFixed(2);
}
function carregarDespesas() {
    let despesas = Array();
    despesas = bd.carregar();
    totalTipo = despesas.totalTipo;
    totalMes = despesas.totalMes;

    inserirDadosTabela(despesas);
}
function pesquisarDespesa() {
    let despesas = new Despesas(document.getElementById("ano").value,
        document.getElementById("mes").value,
        document.getElementById("dia").value,
        document.getElementById("tipo").value,
        document.getElementById("descricao").value,
        document.getElementById("valor").value);
    zerarCampos();
    inserirDadosTabela(bd.pequisar(despesas));


}
function removerDespesa() {
    bd.remover(btnDeleteSelect);
    window.location.reload();
}
function inserirValorTotalMes() {
    switch (document.getElementById("gastos-mes").value) {
        case "1":
            document.getElementById("valor-mes").innerHTML = "R$ " + totalMes[1].toFixed(2);
            break;
        case "2":
            document.getElementById("valor-mes").innerHTML = "R$ " + totalMes[2].toFixed(2);
            break;
        case "3":
            document.getElementById("valor-mes").innerHTML = "R$ " + totalMes[3].toFixed(2);
            break;
        case "4":
            document.getElementById("valor-mes").innerHTML = "R$ " + totalMes[4].toFixed(2);
            break;
        case "5":
            document.getElementById("valor-mes").innerHTML = "R$ " + totalMes[5].toFixed(2);
            break;
        case "6":
            document.getElementById("valor-mes").innerHTML = "R$ " + totalMes[6].toFixed(2);
            break;
        case "7":
            document.getElementById("valor-mes").innerHTML = "R$ " + totalMes[7].toFixed(2);
            break;
        case "8":
            document.getElementById("valor-mes").innerHTML = "R$ " + totalMes[8].toFixed(2);
            break;
        case "9":
            document.getElementById("valor-mes").innerHTML = "R$ " + totalMes[9].toFixed(2);
            break;
        case "10":
            document.getElementById("valor-mes").innerHTML = "R$ " + totalMes[10].toFixed(2);
            break;
        case "11":
            document.getElementById("valor-mes").innerHTML = "R$ " + totalMes[11].toFixed(2);
            break;
        case "12":
            document.getElementById("valor-mes").innerHTML = "R$ " + totalMes[12].toFixed(2);
            break;
    }
}
function inserirValorTotalTipo() {
    switch (document.getElementById("gastos-tipo").value) {
        case "1":
            document.getElementById("valor-tipo").innerHTML = "R$ " + totalTipo[1].toFixed(2);
            break;
        case "2":
            document.getElementById("valor-tipo").innerHTML = "R$ " + totalTipo[2].toFixed(2);
            break;
        case "3":
            document.getElementById("valor-tipo").innerHTML = "R$ " + totalTipo[3].toFixed(2);
            break;
        case "4":
            document.getElementById("valor-tipo").innerHTML = "R$ " + totalTipo[4].toFixed(2);
            break;
        case "5":
            document.getElementById("valor-tipo").innerHTML = "R$ " + totalTipo[5].toFixed(2);
            break;
    }
}