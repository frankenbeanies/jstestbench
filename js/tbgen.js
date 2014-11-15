function _genTB(){
	window.location.hash = "tb-form";
	var ta = document.getElementById('ta');
	var tb = document.getElementById('tb');
	tb.style.backgroundColor = "#333";
	tb.value = "";
	try{
		if(ta.value == ""){
			throw "Please paste your code into the first box before submitting.";
		}
		var taArray = getLinesAsArray(ta.value);
		var tbString = "";
		var imports = getImports(taArray);

		var entityArrays = getEntityArrays(taArray);
		for(var i = 0; i < entityArrays.length; i++){
			tbString += imports;
			var tmpArray = entityArrays[i][0].split(" ");
			tmpArray[1] = tmpArray[1] + "_tb";
			tbString += tmpArray.join(" ") + "\n";
			tbString += "end;\n\n";
			//architecture
			tbString += "architecture tb of " + tmpArray[1] + " is\n";
			//components
			tbString += "\tcomponent " + tmpArray[1].replace("_tb", "") + "\n";

			for(var j = 1; j < entityArrays[i].length - 1; j++){
				if(j != 1){
					tbString += "\t";
				}
				tbString += "\t\t" + entityArrays[i][j] + "\n";
			}

			tbString += "\tend component;\n\n";

			var ports = [];

			//signals
			for(var j = 1; j < entityArrays[i].length - 1; j++){
				var tmpArray2 = entityArrays[i][j].split(":");
				tbString += "\tsignal " + tmpArray2[0].replace("port", "").replace("(", "") + " : " + tmpArray2[1].split(' ')[2].replace(')', '') + "\n";
				tmpPorts = tmpArray2[0].replace("port", "").replace("(", "").replace(" ", "").split(',');
				ports += tmpPorts;
			}

			tbString += "begin\n";

			//port maps
			var truePorts = [];
			tbString += "\tuut : " + tmpArray[1].replace("_tb", "") + " port map ( "; 
			for(var j = 0; j < ports.length; j++){
				if(!ports[j].match(/^\s+$/) && ports[j] != ','){
					truePorts.push(ports[j]);
				}
			}

			for(var j = 0; j < truePorts.length; j++){
				tbString += truePorts[j] + " => " + truePorts[j];
				if(j != truePorts.length - 1){
					tbString += ", ";
				}
			}

			tbString += " );\n\n";

			//stimulus process
			tbString += "\tstimulus : process\n\tbegin\n"
			tbString += "\n\t\t-- Put testbench code here\n\n"
			tbString += "\t\twait;\n\tend process;\n"

			tbString += "end;\n\n";
		}

		if(tbString == ""){
			throw "There was an issue parsing your code. Please check for errors and try again. If you believe that this message is in error, please fill out the form below. Thank you!";
		}else{
			tb.value = tbString;
		}
	}catch(error){
		tb.style.backgroundColor = "#8A3324";
		tb.value = "Error: " + error
	}
	
}

function getImports(taArray){
	var i = 0;
	while(taArray[i].indexOf("use") != 0)
	{
		i++;
	}

	while(taArray[i].indexOf("use") == 0){
		i++;
	}

	var responseString = "";
	for(var j = 0; j <= i; j++){
		if(taArray[j].indexOf("--") != 0){
			responseString += taArray[j] + "\n";
		}
	}

	return responseString;
}

function getEntityArrays(taArray){
	var entityArrays = [];
	var i = 0;
	do{
		while(i < taArray.length && taArray[i].indexOf("entity") != 0){
			i++;
		}

		var j = i;
		while(i < taArray.length && taArray[i].indexOf("end ") != 0){
			i++;
		}

		if(i >= taArray.length){
			break;
		}

		var entityArray = taArray.slice(j, ++i);
		entityArrays.push(entityArray);
	}while(i < taArray.length);
	return entityArrays
}

function getLinesAsArray(lines){
	return lines.split("\n");
}