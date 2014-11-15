function sendEmail(){
	var date = new Date();
	document.location.href = "mailto:sjb8116@rit.edu?subject=JSTestbench%20-%20Error%20Report%20-%20" + (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + "&body=" + document.getElementById('desc').value +'%0A%0D%0A%0DResponse Email: ' + document.getElementById('email').value ;
}