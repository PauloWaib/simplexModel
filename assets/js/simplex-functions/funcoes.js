var simplex_type = '';

var limite = '0';

var table_id = 1;

function mostrarIteracoes() {
	$('#tab').css('display','block');
}

function mostrarSolucaoFinal() {
    $('#tab').css('display','none');
}

function calculaMaxMin(p_matriz_final, quantDec, bValues) {

    restNames = [];
    restValues = [];
    minMaxValues = [];

    for(let i = quantDec + 1,k=0; i < p_matriz_final[0].length -1;k++,i++){

        restNames.push(p_matriz_final[0][i])
        restValues.push(p_matriz_final[p_matriz_final.length -1][i])
        let auxArray = new Array;
        for(let j = 1; j < p_matriz_final.length -1 ; j++){
            let bCol     = p_matriz_final[j][p_matriz_final[0].length-1]
            let restCol  = p_matriz_final[j][i]

            auxArray.push((bCol/restCol)* -1);
        }

        let minPos = Number.POSITIVE_INFINITY;
        let maxNeg = Number.NEGATIVE_INFINITY;

        for(let j = 0; j< auxArray.length;j++){
            if(auxArray[j] > 0 && auxArray[j] < minPos ){
                minPos = auxArray[j]
            }else if(auxArray[j] < 0 && auxArray[j] > maxNeg ){
                maxNeg = auxArray[j]
            }
        }
        if(minPos === Number.POSITIVE_INFINITY ){
            minPos = 0
        }
        if(maxNeg === Number.NEGATIVE_INFINITY ){
            maxNeg = 0
        }

        minMaxValues.push([(maxNeg + parseInt(bValues[k])) , (minPos + parseInt(bValues[k]))])
    }

    var senseMatriz = [];

    for(let i = 0; i< p_matriz_final.length-2; i++ ){
        let auxArray  = new Array;
        auxArray.push(restNames[i])
        auxArray.push(restValues[i])
        senseMatriz.push(auxArray)
    }

    for(let i = 0; i< senseMatriz.length; i++ ){
        for(let j = 0; j < minMaxValues[0].length; j++){
            senseMatriz[i].push(minMaxValues[i][j])
        }
    }

    printTabelaMaxMin(senseMatriz);
}

function printTabelaMaxMin(senseMatriz) {
    var linhas = senseMatriz.length;
    var colunas = senseMatriz[0].length;
    var tabela = document.createElement("table");
    tabela.id = 'table-maxMin';

    tabela.className = "table table-striped";
    var thead = document.createElement("thead");
    thead.className = "thead-dark";
    var tbody=document.createElement("tbody");
    var tr = document.createElement("tr");
    tr.scope = "col";

    cabecalho = ['Varíaveis','Preço Sombra','Menor Valor','Maior Valor'];

    for (var l = 0; l < colunas; l++) {
        var variavel = cabecalho[l];
        var th = document.createElement("th");
        var texto = document.createTextNode(variavel);
        th.appendChild(texto);
        tr.appendChild(th);
    }

    thead.appendChild(tr);

    for(var n = 0; n < linhas; n++) {

        var tr = document.createElement("tr");

        for(var o = 0; o < colunas; o++) {

            var variavel = senseMatriz[n][o];

            if(variavel < 0) {
                variavel = variavel * (-1);
            }
            var td = document.createElement("td");

            td.appendChild(document.createTextNode(variavel));

            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    tabela.appendChild(thead);
    tabela.appendChild(tbody);
    tabela.border = 1;

    document.getElementById("valuesMaxMin").appendChild(tabela);
    $('#box-table-MaxMin').css('display','block');
    $('#hr-pos-box-table-final').css('display','block');

}

/*
function restoSolucao(p_matriz_final, restricoes) {

	// Variaveis não Basicas

    matrizSolucao = [[]];
    matrizResto = [[]];

    for ($i = 0; $i < restricoes - 1 ;$i++) {
        matrizSolucao.push(p_matriz_final[$i][0]);
    }

    var qtdeColunasTabela = matriz[0].length;

    for($i = 1; $i <= qtdeColunasTabela -1;$i++) {
    	matrizSolucao.push(p_matriz_final[0][$i]);
    }

    $countResto = matrizResto.length;

    for($i = 0; $i < matrizSolucao.length; $i++) {
        $posicao = matrizSolucao[$i].indexOf(matrizResto);
        if ($posicao !== false)
            delete matrizResto[$posicao];
    }


    for ($i = 0; $i < $countResto; $i++) {
        if ((matrizResto[$i]) !== 'undefined') {
            console.log (matrizResto[$i] = 0);
        }
	}


}

function precoSombra(p_matriz_final) {
    $sombra = "";

    for($i = ($this->nDecisoes + 1); $i <= $this->qtdeColunasTabela -1;$i++) {
        echo '<p>'.$sombra.$this->tabela[0][$i].' = '.$this->tabela[$this->nRestricoes + 1][$i].'</p>';
	}


    return $sombra;
}
*/

function condicaoParada(p_matriz) {

    var i = p_matriz.length - 1;

    for (j = 1; j < p_matriz[i].length; j++) {

        if (limite == 100) {
            return false;
        }
        else {
            limite++;
        }

        if (p_matriz[i][j] > 0) {
            return true;
        }
    }
    return false;

}

function calcMatriz(p_matriz) {
	var nLinhas = p_matriz.length - 1;
	var nColunas = p_matriz[nLinhas].length - 1;

	// Escolhendo qual colocar como variável básica
	var maior = p_matriz[nLinhas][1];
	indMaior = 1;

	for (j = 2; j <= nColunas; j++) {
		if (p_matriz[nLinhas][j] > maior) {
			maior = p_matriz[nLinhas][j];
			indMaior = j;
		}
	}

	// Escolhendo qual variável básica sai
	var menor = Number.MAX_VALUE;

	var indMenor = 0;
	for (k = 1; k < nLinhas; k++) {
		var teste = p_matriz[k][nColunas] / p_matriz[k][indMaior]; //não testou após mudança
		if (p_matriz[k][indMaior] != 0 && teste < menor && teste >= 0 ) { //não testou após mudança
			menor = p_matriz[k][nColunas] / p_matriz[k][indMaior];
			indMenor = k;
		}
	}

	var v_in = p_matriz[0][indMaior];
	var v_out = p_matriz[indMenor][0];
	document.getElementById("tab").innerHTML+="<p>Abaixo, na Base: Entra <strong>"+v_in.substr(0,1)+"<sub>"+v_in.substr(1,1)+"</sub></strong> e Sai <strong>"+v_out.substr(0,1)+"<sub>"+v_out.substr(1,1)+"</sub></strong></p>";
	p_matriz[indMenor][0] = p_matriz[0][indMaior];
	
	printTabela(p_matriz);

	// Deixando o valor da nova variável básica == 1
	var aux = p_matriz[indMenor][indMaior];
	if (aux != 1) {
		for (l = 1; l <= nColunas; l++) {
			p_matriz[indMenor][l] = p_matriz[indMenor][l] / aux;
		}
		var fracao = new Fraction(1/aux);
		var numFormatado = fracao.toFraction();
		document.getElementById("tab").innerHTML+="<p>Linha "+indMenor+" = Linha "+indMenor+" * "+numFormatado+"</p>";
		printTabela(p_matriz);
	}

	// Zerando os outros valores na coluna da nova variável básica
	for (i = 1; i <= nLinhas; i++) {
		var aux = p_matriz[i][indMaior];
		if (i != indMenor && aux != 0) {
			for (j = 1; j <= nColunas; j++) {
				p_matriz[i][j] = parseFloat(p_matriz[i][j]) + parseFloat(-1 * aux * p_matriz[indMenor][j]);
			}
			var fracao = new Fraction(-1*aux);
			var numFormatado = fracao.toFraction();
			document.getElementById("tab").innerHTML+="<p>Linha "+i+" = Linha "+i+" + ("+numFormatado+") * Linha "+indMenor+"</p>";
			printTabela(p_matriz);
		}
	}
}

//bloqueia edição nos inputs
function esconder(p_variaveis, p_restricoes) {
	for (i = 1; i <= p_variaveis; i++) {
		document.getElementById('y'+i).style = "-moz-appearance:textfield;";
		document.getElementById('y'+i).style.border = "0";
		document.getElementById('y'+i).readOnly = true;

		for (j = 1; j <= p_restricoes; j++) {
			document.getElementById('x'+j+i).style = "-moz-appearance:textfield;";
			document.getElementById('x'+j+i).style.border = "0";
			document.getElementById('x'+j+i).readOnly = true;
		}
	}
	for (j = 1; j <= p_restricoes; j++) {
		document.getElementById('b'+j).style = "-moz-appearance:textfield;";
		document.getElementById('b'+j).style.border = "0";
		document.getElementById('b'+j).readOnly = true;
	}
}

function validarCoeficientes(p_variaveis, p_restricoes) {
	for (i = 1; i <= p_variaveis; i++) {
		if (document.getElementById('y'+i).value == "") {
			document.getElementById('y'+i).focus();
			alert('Informe os valores de todos os coeficientes.');
			return 1;
		}
		for (j = 1; j <= p_restricoes; j++) {
			if (document.getElementById('x'+j+i).value == "") {
				document.getElementById('x'+j+i).focus();
				alert('Informe os valores de todos os coeficientes.');
				return 1;
			}
		}
	}
	for (j = 1; j <= p_restricoes; j++) {
		if (document.getElementById('b'+j).value == "") {
			document.getElementById('b'+j).focus();
			alert('Informe os valores de todas as constantes.');
			return 1;
		}
	}
}

function atualizar() {
	window.location.href='index.html';
}

function criarForm(p_variaveis, p_restricoes, x) {
	
	if (p_variaveis == "" || p_variaveis <= 0 || p_variaveis != parseInt(p_variaveis)) {
		alert('A quantidade de variáveis precisa ser maior que 0!');
		form1.variaveis.focus();
		return;
	} else {
		if (p_restricoes == "" || p_restricoes <= 0 || p_restricoes != parseInt(p_restricoes)) {
			alert('A quantidade de restrições precisa ser maior que 0!');
			form1.regras.focus();
			return;
		}
	}
	if (p_variaveis > 0 && p_restricoes > 0) {

        if(x == 2) {
            simplex_type = 'maximize';
			
        }
        else{
            simplex_type = 'minimize';
        }

	    var aux = 10;

	    if(p_variaveis > 1 && p_variaveis < 4) {
            qtd_columns = 'col-md-6 ';
            col_offset = ' offset-md-3 ';
        }
        else if(p_variaveis > 3 && p_variaveis < 5) {
            qtd_columns = 'col-md-8 ';
            col_offset = ' offset-md-2 ';
        }
        else {
            qtd_columns = 'col-md ';
            col_offset = '';
        }

		$("#form2").css('display','block');
        $("#aqui").html("<div class=\"row\"><div id='global-row-1' class=\""+col_offset+qtd_columns+col_offset+" my-4 input-group d-flex text-center text-muted\"></div></div>");

        if(simplex_type == 'maximize') {
            var simplex_z = 'Max Z = ';
        }
        else {
            var simplex_z = 'Min Z = ';
        }

        $("#global-row-1").append("<div class=\"input-group-prepend\"><span class=\"input-group-text\">"+simplex_z+"</span></div>");

        // Função de Z -- O laço roda o número de vezes o usuario digitou
		for (var h = 1; h <= p_variaveis; h++) {
            $("#global-row-1").append("<span class=\"px-3\"></span> <input type='number' class=\"inputZ form-control\" required autocomplete='off' size='5' maxlength='10' step='0.1' id='y"+h+"' name='y"+h+"' /><div class=\"input-group-append\"><span class=\"input-group-text\"> X<sub>"+h+"</sub></span></div>");
		}

		$('#global-row-1').append('<hr class="line-breaking">');

		// Restrições
        for (var i = 1; i <= p_restricoes; i++) {

			$('#aqui').append("<div class=\"row\"><div id='global-row-"+(i+1)+"' class=\""+col_offset+qtd_columns+col_offset+"my-4 input-group d-flex text-center text-muted\"></div></div>")

			$("#global-row-"+(i+1)).append("<div class='d-flex align-content-center'><p><b>Restrição "+i+"</b></p></div>");

			// O laço roda o número de vezes o usuario digitou
            for (var j = 1; j <= p_variaveis; j++) {
                $("#global-row-"+(i+1)).append("<span class=\"px-3\"></span> <input type='number' class=\"input form-control\" required autocomplete='off' size='5' maxlength='10' step='0.1' id='x"+(aux + j)+"' name='x"+(aux + j)+"' /><div class=\"input-group-append\"><span class=\"input-group-text\"> X<sub>"+j+"</sub></span></div>");
            }

            aux += 10;

            $("#global-row-"+(i+1)).append("<span class=\"px-3\"></span><div class=\"input-group-append\"><span class=\"input-group-text\"> &#8804; </span></div><input type=\"numer\" class=\"input form-control\" autocomplete='off' required size='5' maxlength='10' id='b"+i+"' name='b"+i+"'>");

        }

        $("#restricoesStatic").append("<p class='mt-5'><b><h3>X<sub>i</sub> &nbsp; ≥ &nbsp;0</h3></b></p><br>");
        $("#restricoesStatic").css('display','flex');

		document.getElementById("form1").style.display = 'none';
		document.getElementById("in1").disabled = true;
		document.getElementById("in2").disabled = true;
		$('#box-buttons-solve').css('display','flex');
		$('#hr-pos-box-buttons-solve').css('display','block');
		//document.getElementById('y1').focus();
	}
}

function printTabela(p_matriz) {
	var restricoes = parseInt(document.form1.regras.value);
	var variaveis = parseInt(document.form1.variaveis.value);
	var linhas = restricoes+1;
	var colunas = restricoes + variaveis+1;
	var tabela = document.createElement("table");

    var fracao = new Fraction((p_matriz[linhas][colunas]));

	tabela.id = 'table-'+table_id;

	table_id++;

	tabela.className = "table table-striped";
	var thead = document.createElement("thead");
	thead.className = "thead-light";
	var tbody=document.createElement("tbody");
	var tr = document.createElement("tr");
	tr.scope = "col";

	for (var l = 0; l <= colunas; l++) {
		var variavel = p_matriz[0][l];
		var th = document.createElement("th");
		if(l == 0) {
			var texto = document.createTextNode(variavel);
			th.appendChild(texto)
		} else {
			var sub = document.createElement("sub");
			var textoSub = document.createTextNode(variavel.substr(1,1));
			var texto = document.createTextNode(variavel.substr(0,1));
			sub.appendChild(textoSub);
			th.appendChild(sub);
			th.insertBefore(texto, th.firstChild);
		}
		tr.appendChild(th);
	}

	thead.appendChild(tr);

	var chegou_noZ = false;

	for(var n = 1; n <= linhas; n++) {

		var tr = document.createElement("tr");
		for(var o = 0; o <= colunas; o++) {

			var variavel = p_matriz[n][o];

            if(variavel == 'Z') {
                chegou_noZ = true;
            }

			var td = document.createElement("td");

			if (o == 0 && n < linhas) {
				var sub = document.createElement("sub");
				var b = document.createElement("b");
				var textoSub = document.createTextNode(variavel.substr(1,1));
				var texto = document.createTextNode(variavel.substr(0,1));
				sub.appendChild(textoSub);
				b.appendChild(sub);
				b.insertBefore(texto, b.firstChild);
				td.appendChild(b);
			} else {
				if (variavel != 'Z') {
                    // Verificar se está na linha de Z
                    if(chegou_noZ && simplex_type == 'maximize') {
                        var aux_val = 0;

                        aux_val = (variavel * (- 1));

                        var fracao = new Fraction(aux_val);
                        variavel = fracao.toFraction();

                    	if (variavel == -0) {
                            variavel = 0;
						}
                        var texto = document.createTextNode(variavel);
                    }
                    else {
                        var fracao = new Fraction(variavel);
                        variavel = fracao.toFraction();
                        var texto = document.createTextNode(variavel);
					}

					// Printa o valor da linha Z
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

function resolver() {
    var restricoes = parseInt(document.form1.regras.value);
    var variaveis = parseInt(document.form1.variaveis.value);
    var linhas = parseInt(document.form1.regras.value) + 1;
    var colunas = parseInt(document.form1.variaveis.value) + parseInt(document.form1.regras.value) + 1;

    if (validarCoeficientes(variaveis, restricoes) == 1) {
        return;
    }

    esconder(variaveis, restricoes);

    document.getElementById("form2").style.display = 'none';
    document.getElementById("tab").innerHTML+="<div id='iteracoes'></div>";
    document.getElementById("tab").innerHTML+="<hr/><br>";
    document.getElementById("tab").innerHTML+="<h2>Resolução</h2>";
    document.getElementById("tab").innerHTML+="<br><hr/>";
    document.getElementById("tab").innerHTML+="<h4>Tabela Inicial</h4><br>";

    matriz = [[]];
    matriz[0][0] = 'Base';

    var indice = 1;

    for (var l = 1; l <= variaveis; l++) {
        matriz[0][indice] = "x"+indice;
        indice++;
    }
    for (var m = 1; m <= restricoes; m++) {
        matriz[0][indice] = "f"+m;
        indice++;
    }

    matriz[0][matriz[0].length] = 'B';
    bValues = [];

    // Adicionando linhas com as variavéis básicas. Ex: 'f1', 'f2'
    var x = document.querySelectorAll(".input");
    indice = 0;
    var coluna = 0;

    for (var i = 1; i < linhas; i++) {
        matriz.push(['f'+i]);
        for (var j = 1; j <= variaveis; j++) {
            matriz[i][j] = parseFloat(x[indice].value.replace(",","."));
            indice++;
        }
        coluna = variaveis + 1;
        for (var k = 1; k <= restricoes; k++) {
            if(i==k) {
                matriz[i][coluna] = 1;
            } else {
                matriz[i][coluna] = 0;
            }
            coluna++;
        }
        matriz[i][coluna] = x[indice].value;
        bValues.push(x[indice].value);
        indice++;
    }

    // Adicionando a última linha 'Z'
	var z = document.querySelectorAll(".inputZ");

    coluna = 0;

    matriz.push(['Z']);
    for (var l = 0; l < variaveis; l++) {
    	if(simplex_type == 'maximize') {
            matriz[linhas][l+1] = (parseFloat(z[l].value.replace(",",".")));
		}
		else {
            matriz[linhas][l+1] = (-1 * (parseFloat(z[l].value.replace(",","."))));
		}
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
        document.getElementById("tab").innerHTML+="<div class='my-5 mx-3'><hr/></div>";
        document.getElementById("tab").innerHTML+="<p><b>Iteração "+ite+"</b></p>";
        calcMatriz(matriz);
        ite++;
    }

    var fracao = new Fraction((matriz[linhas][colunas]));
    var solucao = "Variáveis Básicas: ";
	var elemento = '';

    for (i = 1; i < matriz.length; i++) {
        if(matriz[i][0] == 'Z') {

        	// Achar o Z e fazer ele negativar se for Minimizar

			if(i == (matriz.length-1)) {
                if(simplex_type == 'maximize') {
                    var fracao = new Fraction((-1) * matriz[i][matriz[0].length-1]);
                }
                else {
                    var fracao = new Fraction(matriz[i][matriz[0].length-1]);
                }
			}
			else {
                var fracao = new Fraction((-1) * matriz[i][matriz[0].length-1]);
			}

			var numFormatado = fracao.toFraction();
            elemento = "<span><i>"+matriz[i][0]+"</i> = "+numFormatado+"</span>";
            solucao += elemento;
        }
        else {
            var fracao = new Fraction(matriz[i][matriz[0].length-1]);
            var numFormatado = fracao.toFraction();
            elemento = "<span><i>"+matriz[i][0]+"</i> = "+numFormatado+"</span>,&nbsp;&nbsp;";
            solucao += elemento;
        }
    }
 
    if(simplex_type == 'maximize') {
        var z = ((fracao.toFraction()) * (-1));
	}
	else{
    	var z = fracao.toFraction();
	}

    calculaMaxMin(matriz, variaveis, bValues);

    if(isNaN(z) || limite == 100) {
        document.getElementById("tab").innerHTML+="<br><hr/>";
        document.getElementById("tab").innerHTML+="<p class='mt-5'><b><h3>A solução é ilimitada!</h3></b></p><br>";
        document.getElementById("btn4").style.display = 'block';
	}
	else {
    	$('#box-btns-slider').css('display','flex');
        document.getElementById("btn4").style.display = 'block';
        $('#resultado-final').append("<p id='solucaoFinal' class='mt-5'><b><h3>"+solucao+"</h3></b></p><br>");
        $('#resultado-final').append($('#table-'+(table_id - 1 )));
        $('#box-table-final').css('display','flex');
        $('#tab').css('display','none');
	}
}