
var button2 = document.getElementById('teach_submit_btn') ;
button2.onclick = function() {
      
    // create a request object
    var request = new XMLHttpRequest() ;
   
    // Capture the response and store it in a variable
    request.onreadystatechange = function() {

    if(request.readyState === XMLHttpRequest.DONE) {
        if(request.status === 200)
          {
              
      console.log('user is logged in') ;
      alert('logged in successsfully');

          window.location="http://localhost:3001/ui/teach_dep.html";
  
          }
          else if(request.status === 403) {
           alert('Username/password is incorrect');
              
          }else if(request.status === 500){
              alert("Something went wrong on the server") ;
          }
    }
  
    
        
    };
    var username = document.getElementById('username').value;
     var password = document.getElementById('password').value ;
     console.log(username);
     console.log(password);
    
    
    request.open('POST', '/teach_login', true) ;
    request.setRequestHeader('Content-Type','application/json') ;
    request.send(JSON.stringify({username: username, password: password})) ;

    
};


var create_btn2 = document.getElementById('teach_create_btn') ;
create_btn2.onclick = function() {


  var request = new XMLHttpRequest();

  request.onreadystatechange = function() {

   if(request.readyState === XMLHttpRequest.DONE){
    if(request.status === 200)
    {
       console.log('user is created successsfully') ;
      alert('User created successsfully');
    }
    else if(request.status === 500){
      console.log("Something went wrong on the server") ;
    }

   }

  };


     var username = document.getElementById('user').value;
     var password = document.getElementById('passwd').value ;
     console.log(username);
     console.log(password);
    
    
    request.open('POST', '/teach_create-user', true) ;
    request.setRequestHeader('Content-Type','application/json') ;
    request.send(JSON.stringify({username: username, password: password})) ;





};