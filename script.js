/* 
	Author : Samyak Jain
	Created on : 30 June 2020
*/
// import { Codec } from "./codec_implementation.js";
window.onload = function () {
	console.log("here onload");
	decodeBtn = document.getElementById("decode");
	encodeBtn = document.getElementById("encode");
	fileForm = document.getElementById("fileform");
	uploadFile = document.getElementById("uploadfile")
	submitBtn = document.getElementById("submitbtn");
	step1 = document.getElementById("step1");
	step2 = document.getElementById("step2");
	step3 = document.getElementById("step3");

	// codecObj = new Codec();
	submitBtn.onclick = function () {
		// var filesList = uploadedFile.files;
		// if(filesList.length>1){
		// 	alert("Multiple files uploaded.\nPlease upload a single .txt file and try again!");
		// 	return;
		// }	
		var uploadedFile = uploadFile.files[0];
		if(uploadedFile === undefined){
			alert("No file uploaded.\nPlease upload a valid .txt file and try again!");
			return;
		}
		let nameSplit = uploadedFile.name.split('.');
		var extension = nameSplit[nameSplit.length - 1].toLowerCase();
		console.log(extension);
		if(extension != "txt"){
			alert( "Invalid file type (." + extension + ") \nPlease upload a valid .txt file and try again!");
			return;
		}
		alert("File submitted");
		onclickChanges("Done!! File uploaded !",step1);

		var fileReader = new FileReader();
		fileReader.onload = function(fileLoadedEvent){
			// let text = fileLoadedEvent.target.result;
			// let [encodedString,outputMsg] = codecObj.encode(text);
		}
	}
	encodeBtn.onclick = function () {
		console.log("encode onclick");
		var uploadedFile = uploadFile.files[0];
		if(uploadedFile === undefined){
			alert("No file uploaded.\nPlease upload a file and try again!");
			return;
		}
		onclickChanges("Done!! Your file will be Compressed",step2);
		onclickChanges2("Compressing your file ...","Compressed");
	}
	decodeBtn.onclick = function () {
		console.log("decode onclick");
		var uploadedFile = uploadFile.files[0];
		if(uploadedFile === undefined){
			alert("No file uploaded.\nPlease upload a file and try again!");
			return;
		}
		onclickChanges("Done!! Your file will be De-compressed",step2);
		onclickChanges2("De-compressing your file ...","De-compressed");
	}

}

function onclickChanges(firstMsg,step){
	step.innerHTML = "";
	let img = document.createElement("img");
	img.src = "assets/done_icon3.png";
	img.id = "doneImg";
	step.appendChild(img);
	var br = document.createElement("br");
	step.appendChild(br);
	let msg = document.createElement("span");
	msg.className = "text2";
	msg.innerHTML = firstMsg;
	step.appendChild(msg);
}

function onclickChanges2(secMsg,word){
	decodeBtn.disabled = true;
	encodeBtn.disabled = true;
	step3.innerHTML = "";
	let msg2 = document.createElement("span");
	msg2.className = "text2";
	msg2.innerHTML = secMsg;
	step3.appendChild(msg2);
	// var br = document.createElement("br");
	// step3.appendChild(br);
	let msg3 = document.createElement("span");
	msg3.className = "text2";
	msg3.innerHTML = " , " + word + " file will be downloaded automatically!";
	step3.appendChild(msg3);
}