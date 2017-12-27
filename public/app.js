$.getJSON("/all", function(data){
	console.log(data);
	for (i=0; i < data.length; i++) {
		$("#results").append("<tr><td>" + data[i].title + "</td>" +
			"<td>" + data[i].link + "</td>" + 
			"<td>" + data[i].summary + "</td></tr>");
	}
});


