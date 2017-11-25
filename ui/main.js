

 // submit username and password to login 

function loadnotices() { 
var request = new XMLHttpRequest();
request.onreadystatechange = function(){

  if(request.readyState === XMLHttpRequest.DONE){
    if(request.status === 200){

      var notices = request.responseText;
      notices = JSON.parse(notices);
      var list = '';
      for(var i = 0 ; i < notices.length; i++)
      {
        list += '<li>' +notices[i] + '</li>';

      }
      var ul = document.getElementById('namelist');
      ul.innerHTML = list
    }
  }

};



request.open('GET', 'http://localhost:3001/cse/notices', true);
request.send(null);
}
var button = document.getElementById('submit_btn') ;
button.onclick = function() {
      
    // create a request object
    var request = new XMLHttpRequest() ;
   
    // Capture the response and store it in a variable
    request.onreadystatechange = function() {

    if(request.readyState === XMLHttpRequest.DONE) {
        if(request.status === 200)
          {
              
      console.log('user is logged in') ;
      alert('logged in successsfully');

          window.location="http://localhost:3001/ui/Department.html";
  
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
    
    
    request.open('POST', '/login', true) ;
    request.setRequestHeader('Content-Type','application/json') ;
    request.send(JSON.stringify({username: username, password: password})) ;

    
};


var create_btn = document.getElementById('create_btn') ;
create_btn.onclick = function() {


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
    
    
    request.open('POST', '/create-user', true) ;
    request.setRequestHeader('Content-Type','application/json') ;
    request.send(JSON.stringify({username: username, password: password})) ;





};
