var CASED = function (name) {
	this.name = name;
	this.charstem = "";
	this.class = "";
	this.moa = "";
	this.contra = "";
	this.se = "";
	this.elim = "";
	this.drugint = "";
	this.avail = "";
};

function submitDrug() {
	newDrug = new CASED(document.getElementById("druginfo").elements["name"].value);

	if(newDrug.name === "") {
		document.getElementById("druginfo").elements["name"].style.borderColor = "red";
		document.getElementById("nameerror").innerHTML = "Please enter a drug name.";
	} else if(findDrug(newDrug.name, drugs) !== -1) {
		document.getElementById("druginfo").elements["name"].style.borderColor = "red";
		document.getElementById("nameerror").innerHTML = "This drug already exists.";
	} else {
		newDrug.charstem = document.getElementById("druginfo").elements["charstem"].value;
		newDrug.class = document.getElementById("druginfo").elements["class"].value;
		newDrug.moa = document.getElementById("druginfo").elements["moa"].value;
		newDrug.contra = document.getElementById("druginfo").elements["contra"].value;
		newDrug.se = document.getElementById("druginfo").elements["se"].value;
		newDrug.elim = document.getElementById("druginfo").elements["elim"].value;
		newDrug.drugint = document.getElementById("druginfo").elements["drugint"].value;
		newDrug.avail = document.getElementById("druginfo").elements["avail"].value;

		drugs[drugs.length] = newDrug;

		refreshDrugs(drugs);
		clearInfo();
	}
};

function refreshDrugs(drugs) {
	drugs.sort(function(a, b){
		if(a.name < b.name) return -1;
		if(a.name > b.name) return 1;
		return 0;
	})

	var drugList = "<ul>";
	var printable = "<div class=\"title\">CASED Cards</div><span class=\"printText\">";

	for(var i = 0; i < drugs.length; i++) {
		drugList += "<li onclick=\"viewDrug(\'" + drugs[i].name + "\')\">" + drugs[i].name + "</li>";

		printable += "<div class=\"card\"><div class=\"name\">" + drugs[i].name + "</div>";
		if(drugs[i].charstem !== ""){printable += "<div class='property'><label>Characteristic stems(s):</label> " + drugs[i].charstem + "</div>";}
		if(drugs[i].class !== ""){printable += "<div class='property'><label>Class:</label> " + drugs[i].class + "</div>";}
		if(drugs[i].moa !== ""){printable += "<div class='property'><label>Mechanism of action:</label> " + drugs[i].moa + "</div>";}
		if(drugs[i].contra !== ""){printable += "<div class='property'><label>Contraindications:</label> " + drugs[i].contra + "</div>";}
		if(drugs[i].se !== ""){printable += "<div class='property'><label>Side effects:</label> " + drugs[i].se + "</div>";}
		if(drugs[i].elim !== ""){printable += "<div class='property'><label>Elimination:</label> " + drugs[i].elim + "</div>";}
		if(drugs[i].drugint !== ""){printable += "<div class='property'><label>Drug-drug interactions:</label> " + drugs[i].drugint + "</div>";}
		if(drugs[i].avail !== ""){printable += "<div class='property'><label>Availability:</label> " + drugs[i].avail + "</div>";}
		printable += "</div>";
	}
	drugList += "</ul>";
	printable += "</span>";

	document.getElementById("drugList").innerHTML = drugList;
	document.getElementById("printable").innerHTML = printable;
}

function clearInfo() {
	document.getElementById("druginfo").elements["name"].value = '';
	document.getElementById("druginfo").elements["charstem"].value = '';
	document.getElementById("druginfo").elements["class"].value = '';
	document.getElementById("druginfo").elements["moa"].value = '';
	document.getElementById("druginfo").elements["contra"].value = '';
	document.getElementById("druginfo").elements["se"].value = '';
	document.getElementById("druginfo").elements["elim"].value = '';
	document.getElementById("druginfo").elements["drugint"].value = '';
	document.getElementById("druginfo").elements["avail"].value = '';

	clearErrors();
	currDrug = new CASED("");
}

function findDrug(name, drugs) {
	for(var i = 0; i < drugs.length; i++) {
		if(name.toLowerCase() === drugs[i].name.toLowerCase()) {
			return i;
		}
	}
	return -1;
}

function deleteDrug() {
	if(currDrug.name === "") {
		clearInfo();
	} else if(confirm("Are you sure that you want to delete " + currDrug.name + "?")) {
		drugs.splice(findDrug(currDrug.name, drugs),1);

		refreshDrugs(drugs);

		clearInfo();
	}
}

function viewDrug(name) {
	// Saving open drug (if one is open)
	updateDrug();

	// Loading selected drug
	currDrug = drugs[findDrug(name, drugs)];
	document.getElementById("druginfo").elements["name"].value = name;
	document.getElementById("druginfo").elements["charstem"].value = currDrug.charstem;
	document.getElementById("druginfo").elements["class"].value = currDrug.class;
	document.getElementById("druginfo").elements["moa"].value = currDrug.moa;
	document.getElementById("druginfo").elements["contra"].value = currDrug.contra;
	document.getElementById("druginfo").elements["se"].value = currDrug.se;
	document.getElementById("druginfo").elements["elim"].value = currDrug.elim;
	document.getElementById("druginfo").elements["drugint"].value = currDrug.drugint;
	document.getElementById("druginfo").elements["avail"].value = currDrug.avail;
}

function updateDrug() {
	// Saving open drug (if one is open)
	if(currDrug.name !== "" && findDrug(currDrug.name, drugs) !== -1) {
		drugs.splice(findDrug(currDrug.name, drugs),1);
		submitDrug();
	}
}

function clearErrors() {
	document.getElementById("nameerror").innerHTML = "";
	document.getElementById('druginfo').elements['name'].style.borderColor = 'initial';
}

function save() {
	// Saving open drug (if one is open)
	updateDrug();

	var out = Date().toString() + "\n";

	for(var i = 0; i < drugs.length; i++) {
		out += "\n";
		for(var property in drugs[i]) {
			out += property.toUpperCase() + ": " + drugs[i][property] + "\n";
		}
	}

	myWindow = window.open("data:text," + encodeURIComponent(out), "_blank", "width=200, height=100");
	myWindow.focus();
}

function loadFile(inTxt) {
	var lines = inTxt.split("\n");

	// lines[0] contains a timestamp, start at lines[2]
	var newDrug = new CASED("");
	for(var i = 2; i < lines.length; i++) {
		if(lines[i] === "" && newDrug.name !== "") {
			drugs[drugs.length] = newDrug;
			newDrug = new CASED("");
		} else {
			var line = lines[i].split(": ");
			var prop = line[0];
			var data = line.slice(1).join("");
			for(var property in newDrug) {
				if(property.toLowerCase() === prop.toLowerCase()) {
					newDrug[property] = data;
				}
			}
		}
	}

	refreshDrugs(drugs);
}

function load() {
	var file = document.getElementById("loadfile").files[0];
	if(file) {
		if(isTxt(file.name)) {
			var reader = new FileReader();
			reader.readAsText(file, "UTF-8");
			reader.onload = function (evt) {
				loadFile(evt.target.result);
			}
			reader.onerror = function (evt) {
				alert("The file could not be read.");
			}
		} else {
			alert("Please select a text file.");
		}
	}
}

function isTxt(filename) {
	if(filename.split(".").reverse()[0].toLowerCase() === "txt") {
		return true;
	}
	return false;
}

// TODO: Get rid of global variables
var drugs = [];
var currDrug = new CASED("");