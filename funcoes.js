
function atualizar() {
	window.location.href='simplex.html';
}

function criarForm(var_decisao, restricoes) {
	
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
		document.getElementById("form2").style.display = 'block';
		document.getElementById("target").innerHTML+="<span>Z = </span>";
		document.getElementById("target").innerHTML+="<input type='number' class='input1' required autocomplete='off' size='5' maxlength='10' step='0.1' id='y1' name='y1' />x<sub>1</sub>";
		for (var h = 2; h <= var_decisao; h++) {
			document.getElementById("target").innerHTML+=" + <input type='number' class='input1' required autocomplete='off' size='5' maxlength='10' step='0.1' id='y"+h+"' name='y"+h+"' />x<sub>"+h+"</sub>";
		}
		for (var i = 1; i <= restricoes; i++) {
			document.getElementById("target").innerHTML+="<p><b>Restrição "+i+"</b></p>";
			document.getElementById("target").innerHTML+="<input type='number' class='input1' required autocomplete='off' size='5' maxlength='10' step='0.1' id='x"+i+"1' name='x"+i+"1' />x<sub>1</sub>";
			for (var j = 2; j <= var_decisao; j++) {
				document.getElementById("target").innerHTML+=" + <input type='number' class='input1' required autocomplete='off' size='5' maxlength='10' step='0.1' id='x"+i+j+"' name='x"+i+j+"' />x<sub>"+j+"</sub>";
			}
			document.getElementById("target").innerHTML+="<span> <= </span>"
			+"<input type='number' class='input1' required size='5' maxlength='10' id='b"+i+"' name='b"+i+"' style='text-align:left' />";
		}
		document.getElementById("target").innerHTML+="<p><b>Restrição "+(++restricoes)+"</b></p>"
		+"<p>x<sub>i</sub> >= 0</p>";
		document.getElementById("btn1").style.display = 'none';
		document.getElementById("in1").disabled = true;
		document.getElementById("in2").disabled = true;
		document.getElementById('y1').focus();
	}
} 