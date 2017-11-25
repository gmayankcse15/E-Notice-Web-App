


var button = document.getElementById('counter');
var counter =  0

button.onclick = function() {

	var request = new XMLHttpRequest();

	request.onreadystatechange = function(){

 		if(request.readyState === XMLHttpRequest.DONE){
 			if(request.status === 200)
 			{
 				var counter = request.responseText ;
 				var span = document.getElementById('count');
 				span.innerHTML = counter.toString() ;

 			}
 		}   

	};

// Make a request
request.open('GET', 'http://localhost:3000/counter', true);
request.send(null);
};


var submit = document.getElementById('submit_btn');
submit.onclick = function(){

	var request = new XMLHttpRequest();


	request.onreadystatechange = function(){


		if(request.readyState === XMLHttpRequest.DONE){
			if(request.status === 200)
			{
				var names = request.responseText;
				names = JSON.parse(names);
	var list = '';
	for(var i = 0 ; i < names.length; i++)
	{
	list += '<li>' + names[i] + '</li>';

	}
	var ul = document.getElementById('namelist');
	ul.innerHTML = list

			}
		}
	};

	var nameInput = document.getElementById('name')
	var name = nameInput.value;
	request.open('GET', 'http://localhost:3001/submit-name/'+name, true) ;
	request.send(null);




};
