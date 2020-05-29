const primeiraTela = document.getElementById('primeira_parte')
const segundaTela = document.getElementById('segunda_parte')

function criarForm(var_decisao, restricoes, event) {
	// Esse código evita a tela de ser atualizada
	event.preventDefault();

	if (var_decisao == "" || var_decisao <= 0 || var_decisao != parseInt(var_decisao)) {
		alert('Preencha o campo com a quantidade de variáveis.');
		form1.variaveis.focus();
		return;
	} else {
		if (restricoes == "" || restricoes <= 0 || restricoes != parseInt(restricoes)) {
			alert('Preencha o campo com a quantidade de restrições.');
			form1.regras.focus();
			return;
		}
	}

	if (var_decisao > 0 && restricoes > 0) {
		// Torna formulário 2 vizível
		segundaTela.classList.remove("hide")
		document.getElementById("form2").style.display = 'block';
		document.getElementById("target").innerHTML += "<span>Maximizar </span>";
		const defineInput = num => `
			<div class="input-field inline">
				<input 
					type="number" 
					class="inputZ" 
					required 
					autocomplete="off"
					maxlength='10' 
					step='0.1' 
					id='y${num}' 
					name='y${num}' 
				/>

				<label for="y1">x${num}</label>
			</div>
		`
		document.getElementById("target").innerHTML += defineInput(1);

		// Aqui criamos os inputs da função objetivo
		for (var h = 2; h <= var_decisao; h++) {
			const adicionaSinalDeMais = h >= 2 ? " + " : "";

			document.getElementById("target")
				.innerHTML += adicionaSinalDeMais + defineInput(h);
		}

		// Aqui montamos as restrições
		for (var i = 1; i <= restricoes; i++) {
			const defineRestricao = num => `<p><b>Restrição ${num} </b><p>`;

			const defineInputRestricao = (num, num2) => {
				const restricaoInputId = `x${num}${num2}`;

				return`
					<div class="input-field inline">
						<input 
							type='number' 
							class='input' 
							required 
							autocomplete='off' 
							size='5' 
							maxlength='10' 
							step='0.1' 
							id=${restricaoInputId}
							name=${restricaoInputId} 
						/>

						<label for="${restricaoInputId}">x${num2}</label>
					</div>
				`;
			};

			document.getElementById("target").innerHTML += defineRestricao(i);

			for (var j = 1; j <= var_decisao; j++) {
				const adicionaSinalDeMais = j >= 2 ? " + " : "";

				document.getElementById("target")
					.innerHTML += adicionaSinalDeMais + defineInputRestricao(i, j);
			}
			const defineInputB = num => {
				const defineIdDoInputB = "b" + num;

				return `
					<div class="input-field inline left-align">
						<input 
							type='number' 
							class='input' 
							required 
							size='5' 
							maxlength='10' 
							id=${defineIdDoInputB}
							name=${defineIdDoInputB} 
						/>

						<label for="${defineIdDoInputB}">b</label>
					</div>
				`;
			}

			document.getElementById("target")
				.innerHTML += "<span> <= </span>" + defineInputB(i) 
		}

		for (let i = 0; i < restricoes; i++) {
			
		}
		document.getElementById("target").innerHTML += "<p><b>Restrição " + (++restricoes) + "</b></p>"
			+ "<p>x<sub>i</sub> >= 0</p>";
		document.getElementById("btn_max").style.display = 'none';
		document.getElementById("var_decisao").disabled = true;
		document.getElementById("rest").disabled = true;
		document.getElementById('y1').focus();

		// Esconde as outras telas e mostra uma por vez
		primeiraTela.classList.add('hide');
	}
}

function resolverDireto() {
	var restricoes = parseInt(document.config_inicial.restricoes.value);
	var variaveis = parseInt(document.config_inicial.variaveis.value);
	var linhas = parseInt(document.config_inicial.restricoes.value) + 1;
	var colunas = parseInt(document.config_inicial.variaveis.value) + parseInt(document.config_inicial.restricoes.value) + 1;

	if (validarCoeficientes(variaveis, restricoes) == 1) {
		return;
	}
	esconder(variaveis, restricoes);

	document.getElementById("btn_solucao").style.display = 'none';
	document.getElementById("tab").innerHTML += "<h2>Resolução</h2>";
	document.getElementById("tab").innerHTML += "<hr/>";
	matriz = [[]];
	matriz[0][0] = 'Base';

	var indice = 1;
	for (var l = 1; l <= variaveis; l++) {
		matriz[0][indice] = "x" + indice;
		indice++;
	}
	for (var m = 1; m <= restricoes; m++) {
		matriz[0][indice] = "f" + m;
		indice++;
	}

	matriz[0][matriz[0].length] = 'b';

	var x = document.querySelectorAll(".input");
	indice = 0;
	var coluna = 0;
	for (var i = 1; i < linhas; i++) {
		matriz.push(['f' + i]);
		for (var j = 1; j <= variaveis; j++) {
			matriz[i][j] = parseFloat(x[indice].value.replace(",", "."));
			indice++;
		}
		coluna = variaveis + 1;
		for (var k = 1; k <= restricoes; k++) {
			if (i == k) {
				matriz[i][coluna] = 1;
			} else {
				matriz[i][coluna] = 0;
			}
			coluna++;
		}
		matriz[i][coluna] = x[indice].value;
		indice++;
	}


	// Adicionando a última linha '-Z'
	var z = document.querySelectorAll(".inputZ");
	coluna = 0;
	matriz.push(['Z']);
	for (var l = 0; l < variaveis; l++) {
		matriz[linhas][l + 1] = parseFloat(z[l].value.replace(",", ".")) * (-1);
	}
	coluna = variaveis + 1;
	for (var m = 1; m <= restricoes; m++) {
		matriz[linhas][coluna] = 0;
		coluna++;
	}
	matriz[linhas][coluna] = 0;

	var ite = 1;
	while (condicaoParada(matriz)) {
		calcMatrizDireto(matriz);
		ite++;
	}
}
function resolverPasso() {
	var restricoes = parseInt(document.config_inicial.restricoes.value);
	var variaveis = parseInt(document.config_inicial.variaveis.value);
	var linhas = parseInt(document.config_inicial.restricoes.value) + 1;
	var colunas = parseInt(document.config_inicial.variaveis.value) + parseInt(document.config_inicial.restricoes.value) + 1;

	if (validarCoeficientes(variaveis, restricoes) == 1) {
		return;
	}
	esconder(variaveis, restricoes);

	document.getElementById("btn_solucao").style.display = 'none';
	document.getElementById("tab").innerHTML += "<h2>Resolução</h2>";
	document.getElementById("tab").innerHTML += "<hr/>";
	matriz = [[]];
	matriz[0][0] = 'Base';

	var indice = 1;
	for (var l = 1; l <= variaveis; l++) {
		matriz[0][indice] = "x" + indice;
		indice++;
	}
	for (var m = 1; m <= restricoes; m++) {
		matriz[0][indice] = "f" + m;
		indice++;
	}

	matriz[0][matriz[0].length] = 'b';

	// Adicionando linhas com as variavéis básicas. Ex: 'f1', 'f2'
	var x = document.querySelectorAll(".input");
	indice = 0;
	var coluna = 0;
	for (var i = 1; i < linhas; i++) {
		matriz.push(['f' + i]);
		for (var j = 1; j <= variaveis; j++) {
			matriz[i][j] = parseFloat(x[indice].value.replace(",", "."));
			indice++;
		}
		coluna = variaveis + 1;
		for (var k = 1; k <= restricoes; k++) {
			if (i == k) {
				matriz[i][coluna] = 1;
			} else {
				matriz[i][coluna] = 0;
			}
			coluna++;
		}
		matriz[i][coluna] = x[indice].value;
		indice++;
	}


	// Adicionando a última linha '-Z'
	var z = document.querySelectorAll(".inputZ");
	coluna = 0;
	matriz.push(['Z']);
	for (var l = 0; l < variaveis; l++) {
		matriz[linhas][l + 1] = parseFloat(z[l].value.replace(",", ".")) * (-1);
	}
	coluna = variaveis + 1;
	for (var m = 1; m <= restricoes; m++) {
		matriz[linhas][coluna] = 0;
		coluna++;
	}
	matriz[linhas][coluna] = 0;
	printTabela(matriz);

	var ite = 1;
	while (condicaoParada(matriz)) {
		document.getElementById("tab").innerHTML += "<p><b>Iteração " + ite + "</b></p>";
		calcMatrizPasso(matriz);
		ite++;
	}

	var solucao = "Solução: ";

	for (var n = 1; n <= variaveis; n++) {
		var valor = 0;
		for (var o = 1; o <= restricoes; o++) {
			if (matriz[o][0] == 'x' + n) {
				valor = matriz[o][colunas];
				break;
			}
		}
		if (n == variaveis) {
			solucao += "x<sub>" + n + "</sub> = " + valor;
		} else {
			solucao += "x<sub>" + n + "</sub> = " + valor + ", ";
		}
	}
	solucao += " e Z = " + (matriz[linhas][colunas]);
	document.getElementById("tab").innerHTML += "<p><b>" + solucao + "</b></p>";

}

function validarCoeficientes(p_variaveis, p_restricoes) {
	for (i = 1; i <= p_variaveis; i++) {
		if (document.getElementById('y' + i).value == "") {
			document.getElementById('y' + i).focus();
			alert('Informe os valores de todos os coeficientes.');
			return 1;
		}
		for (j = 1; j <= p_restricoes; j++) {
			if (document.getElementById('x' + j + i).value == "") {
				document.getElementById('x' + j + i).focus();
				alert('Informe os valores de todos os coeficientes.');
				return 1;
			}
		}
	}
	for (j = 1; j <= p_restricoes; j++) {
		if (document.getElementById('b' + j).value == "") {
			document.getElementById('b' + j).focus();
			alert('Informe os valores de todas as constantes.');
			return 1;
		}
	}
}

function esconder(p_variaveis, p_restricoes) {
	for (i = 1; i <= p_variaveis; i++) {
		document.getElementById('y' + i).style = "-moz-appearance:textfield;";
		document.getElementById('y' + i).style.border = "0";
		document.getElementById('y' + i).readOnly = true;
		for (j = 1; j <= p_restricoes; j++) {
			document.getElementById('x' + j + i).style = "-moz-appearance:textfield;";
			document.getElementById('x' + j + i).style.border = "0";
			document.getElementById('x' + j + i).readOnly = true;
		}
	}
	for (j = 1; j <= p_restricoes; j++) {
		document.getElementById('b' + j).style = "-moz-appearance:textfield;";
		document.getElementById('b' + j).style.border = "0";
		document.getElementById('b' + j).readOnly = true;
	}
}

function printTabela(p_matriz) {
	var restricoes = parseInt(document.config_inicial.restricoes.value);
	var variaveis = parseInt(document.config_inicial.variaveis.value);
	var linhas = restricoes + 1;
	var colunas = restricoes + variaveis + 1;
	var tabela = document.createElement("table");
	tabela.className = "table table-striped";
	var thead = document.createElement("thead");
	var tbody = document.createElement("tbody");

	var tr = document.createElement("tr");

	for (var l = 0; l <= colunas; l++) {
		var variavel = p_matriz[0][l];
		var th = document.createElement("th");

		if (l == 0) {
			var texto = document.createTextNode(variavel);

			th.appendChild(texto);
		} else {
			var sub = document.createElement("sub");
			var textoSub = document.createTextNode(variavel.substr(1, 1));
			var texto = document.createTextNode(variavel.substr(0, 1));

			sub.appendChild(textoSub)
			th.appendChild(sub);
			th.insertBefore(texto, th.firstChild);
		}
		tr.appendChild(th);
	}
	thead.appendChild(tr);

	for (var n = 1; n <= linhas; n++) {
		var tr = document.createElement("tr");

		for (var o = 0; o <= colunas; o++) {
			var variavel = p_matriz[n][o];
			var td = document.createElement("td");

			if (o == 0 && n < linhas) {
				var sub = document.createElement("sub");
				var b = document.createElement("b");
				var textoSub = document.createTextNode(variavel.substr(1, 1));
				var texto = document.createTextNode(variavel.substr(0, 1));
				sub.appendChild(textoSub)
				b.appendChild(sub);
				b.insertBefore(texto, b.firstChild);
				td.appendChild(b);
			} else {
				if (variavel != 'Z') {
					var texto = document.createTextNode(variavel);
					td.appendChild(texto);
				} else {
					var b = document.createElement("b");
					var texto = document.createTextNode(variavel);
					b.appendChild(texto);
					td.appendChild(b);
				}
			}
			tr.appendChild(td);
		}
		tbody.appendChild(tr);
	}

	tabela.appendChild(thead);
	tabela.appendChild(tbody);
	tabela.border = 1;
	document.getElementById("tab").appendChild(tabela);
}


function condicaoParada(p_matriz) {
	var i = p_matriz.length - 1;

	for (j = 1; j < p_matriz[i].length; j++) {
		if (p_matriz[i][j] < 0) {
			return true;
		}
	}
	return false;
}
function calcMatrizDireto(p_matriz) {
	var nLinhas = p_matriz.length - 1;
	var nColunas = p_matriz[nLinhas].length - 1;


	// Escolhendo qual colocar como variável básica
	var maior = p_matriz[nLinhas][1];
	indMaior = 1;

	for (j = 2; j <= nColunas; j++) {
		if (p_matriz[nLinhas][j] < maior) {
			maior = p_matriz[nLinhas][j];
			indMaior = j;
		}
	}

	// Escolhendo qual variável básica sai
	var menor = Number.MAX_VALUE;
	var indMenor = 0;
	for (k = 1; k < nLinhas; k++) {
		var teste = p_matriz[k][nColunas] / p_matriz[k][indMaior]; //não testou após mudança
		if (p_matriz[k][indMaior] != 0 && teste < menor && teste >= 0) { //não testou após mudança
			menor = p_matriz[k][nColunas] / p_matriz[k][indMaior];
			indMenor = k;
		}
	}
	var v_in = p_matriz[0][indMaior];
	var v_out = p_matriz[indMenor][0];

	// Deixando o valor da nova variável básica == 1
	var aux = p_matriz[indMenor][indMaior];
	if (aux != 1) {
		for (l = 1; l <= nColunas; l++) {
			p_matriz[indMenor][l] = p_matriz[indMenor][l] / aux;
		}
	}

	// Zerando os outros valores na coluna da nova variável básica
	for (i = 1; i <= nLinhas; i++) {
		var aux = p_matriz[i][indMaior];
		if (i != indMenor && aux != 0) {
			for (j = 1; j <= nColunas; j++) {
				p_matriz[i][j] = parseFloat(p_matriz[i][j]) + parseFloat(-1 * aux * p_matriz[indMenor][j]);
			}
		}
	}
}

function calcMatrizPasso(p_matriz) {
	var nLinhas = p_matriz.length - 1;
	var nColunas = p_matriz[nLinhas].length - 1;

	console.log(p_matriz[nLinhas][j])

	// Escolhendo qual colocar como variável básica
	var maior = p_matriz[nLinhas][1];
	indMaior = 1;

	for (j = 2; j <= nColunas; j++) {
		if (p_matriz[nLinhas][j] < maior) {
			maior = p_matriz[nLinhas][j];
			indMaior = j;
		}
	}

	// Escolhendo qual variável básica sai
	var menor = Number.MAX_VALUE;
	var indMenor = 0;
	for (k = 1; k < nLinhas; k++) {
		var teste = p_matriz[k][nColunas] / p_matriz[k][indMaior];
		if (p_matriz[k][indMaior] != 0 && teste < menor && teste >= 0) {
			menor = p_matriz[k][nColunas] / p_matriz[k][indMaior];
			indMenor = k;
		}
	}
	var v_in = p_matriz[0][indMaior];
	var v_out = p_matriz[indMenor][0];
	document.getElementById("tab")
		.innerHTML += "<p>Troca BASE: entra " +
		v_in.substr(0, 1) +
		"<sub>" +
		v_in.substr(1, 1) +
		"</sub> e sai " +
		v_out.substr(0, 1) +
		"<sub>" +
		v_out.substr(1, 1) +
		"</sub></p>";

	p_matriz[indMenor][0] = p_matriz[0][indMaior];

	// Deixando o valor da nova variável básica == 1
	var aux = p_matriz[indMenor][indMaior];
	if (aux != 1) {
		for (l = 1; l <= nColunas; l++) {
			p_matriz[indMenor][l] = p_matriz[indMenor][l] / aux;
		}
	}
	// Zerando os outros valores na coluna da nova variável básica
	for (i = 1; i <= nLinhas; i++) {
		var aux = p_matriz[i][indMaior];
		if (i != indMenor && aux != 0) {
			for (j = 1; j <= nColunas; j++) {
				p_matriz[i][j] = parseFloat(p_matriz[i][j]) + parseFloat(-1 * aux * p_matriz[indMenor][j]);
			}
		}
	}
	printTabela(p_matriz);
}
