// Make a request
var submit = document.getElementById('submit_btn');
submit.onclick = function(){

	var request = new XMLHttpRequest();


	request.onreadystatechange = function(){


		if(request.readyState === XMLHttpRequest.DONE){
			if(request.status === 200)
			{

				  window.location="http://localhost:3001/dep/addcse.html";
  
			}
		}
	};

	var cCode = document.getElementById('coursecode')
	var courseCode = cCode.value;
	var cName = document.getElementById('coursename')
	var courseName = cName.value;
	var cCoord = document.getElementById('coursecoord')
	var courseCoord = cCoord.value;
	var coord_id = document.getElementById('coordid')
	var Coordinatorid = coordid.value;

	console.log(courseCode)
	console.log(courseName)
	console.log(courseCoord)
	console.log(Coordinatorid)

	request.open('GET', 'http://localhost:3001/addcourse/'+courseCode+'/'+courseName+'/'+courseCoord+'/'+Coordinatorid, true) ;
	request.send(null);




};
