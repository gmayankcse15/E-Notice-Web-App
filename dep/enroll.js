function Enroll(elem) {

	 alert("You clicked Successfully"+elem.id);
     
     var request = new XMLHttpRequest() ;
   
    // Capture the response and store it in a variable
    request.onreadystatechange = function() {

    	console.log("Inside request");
    if(request.readyState === XMLHttpRequest.DONE) {
        if(request.status === 200)
          {

              

     		alert("You are Enrolled Successfully"+elem.id);
     
     		var enr = document.getElementById(elem.id);
			enr.innerHTML = "Enrolled"

          }
          else if(request.status === 403) {
           alert('You cannot Enrolled in this course:');
              
          }else if(request.status === 500){
              alert("Something went wrong on the server") ;
          }
    }
  
    
        
    };
   

    request.open('POST', '/enrollment', true) ;
    request.setRequestHeader('Content-Type','application/json') ;
    request.send(JSON.stringify({C_Id: elem.id})) ;



}

function SeeNotices(elem){
	//alert("You have clicked"+elem.id);
	   window.location="http://localhost:3001/CSECourseNotices/"+elem.id;






}