var express = require('express')
var app = express()
var path = require('path');
var morgan = require('morgan')
var mysql = require('mysql');
var crypto = require('crypto')
var bodyParser = require('body-parser')
var session = require('express-session');

app.use(bodyParser.json());

var con = mysql.createConnection({
	host: "localhost", 
	database:"NitukENotice",
	user: "root",
	password: process.env.DB_PASSWORD    

});

app.use(session({
   secret:'someRandomSecretValue',
   cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}

}));


con.connect(function(err){


	if(err) throw err;
	console.log("Connected!") ;
});


function hash(input, salt)
{

var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
return ["pbkdf2", "10000", salt,hashed.toString('hex')].join('$');

}


app.get('/hash/:input', function(req, res){

var hashedString = hash(req.params.input, 'this-is-some-random-string');
res.send(hashedString)

});

app.get('/test-db', function(req, res){

 con.query("SELECT * FROM user", function(err, result){

  if(err){
  	res.status(500).send(err.toString());

  }
  else
  {
  	res.send(JSON.stringify(result));
  }

 });

});

app.post('/create-user', function(req, res){


//JSON

var username = req.body.username;
var dbString = req.body.password;


//var username = req.params.username ;
//var dbString = req.params.password;

var salt = crypto.randomBytes(128).toString('hex');
var dbString = hash(dbString, salt);
con.query("Insert into user (username, password) values (?, ?)",[username, dbString], function(err, result){
if(err)
{
	res.status(500).send(err.toString());

} else {
	res.send("User Successfully created") ;
}
});


});

app.get('/cse/notices', function(req, res){

	con.query('SELECT notices from CSENotice',function(err, result){
		if(err){
			res.sendStatus(500).send(err.toString());
		}else{
			 if(result.length === 0){
			 	res.sendStatus(403);
			 }
			 else
			 {
			 	console.log(result.toString());
			 	res.send(result.toString());
			 }
			}
	});


});

app.post('/teach_create-user', function(req, res){


//JSON

var username = req.body.username;
var dbString = req.body.password;


//var username = req.params.username ;
//var dbString = req.params.password;

var salt = crypto.randomBytes(128).toString('hex');
var dbString = hash(dbString, salt);
con.query("Insert into teacher (username, password) values (?, ?)",[username, dbString], function(err, result){
if(err)
{
	res.status(500).send(err.toString());

} else {
	res.send("User Successfully created") ;
}
});


});



app.post('/enrollment', function(req, res){

var c_id = req.body.C_Id ;
var  Stud_Id = req.session.auth.userId.toString();
//console.log("Student Id"+ req.session.auth.userId.toString());
console.log(c_id.toString())

con.query("Select Instructor_Id from CSECources WHERE C_Id = ?",[c_id], function(err, result){

if(err)
{
	res.sendStatus(500);
}
else

{
	var Ins_ID = result[0].Instructor_Id ;
	console.log(Ins_ID) ;

	con.query("Insert into EnrollTable values (?,  ?, ?)",[c_id, Stud_Id, Ins_ID], function(err, result){

	if(err)
{
	res.sendStatus(500);

} else {
	res.send("Enrolled Successfully") ;
}

});

}

});


});


app.post('/login', function(req, res){

var username = req.body.username;
var password = req.body.password ;

con.query('SELECT * from user WHERE username = ?', [username], function(err, result){

 if(err){

 	res.sendStatus(500);

 }else{
 	console.log("result length"+result.length);

 	if(result.length === 0){
 		res.sendStatus(403);

 	}else
 	{

 		var dbString = result[0].password;
 		var salt = dbString.split('$')[2] ;
 		var hashedPassword = hash(password, salt);

 		if(hashedPassword === dbString){


 			// Set the session
 			req.session.auth = {userId: result[0].id};

			res.send('credentials correct !');

			//res.redirect('/check-login');
		}else
 		{
 			 	console.log("Invalid");

 			res.sendStatus(403);
 		}
 	}
}

});

});

app.post('/teach_login', function(req, res){

var username = req.body.username;
var password = req.body.password ;

con.query('SELECT * from teacher WHERE username = ?', [username], function(err, result){

 if(err){

 	res.sendStatus(500);

 }else{
 	console.log("result length"+result.length);

 	if(result.length === 0){
 		res.sendStatus(403);

 	}else
 	{

 		var dbString = result[0].password;
 		var salt = dbString.split('$')[2] ;
 		var hashedPassword = hash(password, salt);

 		if(hashedPassword === dbString){


 			// Set the session
 			req.session.auth = {userId: result[0].id};

			res.send('credentials correct !');

			//res.redirect('/check-login');
		}else
 		{
 			 	console.log("Invalid");

 			res.sendStatus(403);
 		}
 	}
}

});

});


app.get('/check-login', function(req, res){


	if(req.session && req.session.auth && req.session.auth.userId){
		res.send('You are logged in: ' + req.session.auth.userId.toString());

	}else {
		res.send("You are not logged in") ;
	}

});

app.get('/logout', function(req, res){

 delete req.session.auth ;
 res.send("Logged out");

});



app.use(morgan('combined'));



function createTemplate2(data, heading){


	var list=data ;
	console.log("list"+list) ;
	var head = heading ;

	var htmltemplate = `
	<!Doctype>
<html>
	<head>
 		<link href="/ui/style.css" rel="stylesheet" />	
	</head>
	<body>
		<h1>${heading}</h1>
		<hr/>
		<div class="footer">  
		  <ul id="namelist">   
            ${list}
            </ul>
        </div>

           <script type="text/javascript" src="/dep/enroll.js">
        </script>
	       
	</body>


</html>

	`
	return htmltemplate ;
}

function createTemplate3(data, heading){


	var list=data ;
	console.log("list"+list) ;
	var head = heading ;

	var htmltemplate = `
	<!Doctype>
<html>
	<head>
 		<link href="/ui/style.css" rel="stylesheet" />	
	</head>
	<body>
		<h1>${heading}</h1>
		<hr/>
		<div class="footer">  
		<input type="text" id="coursecode" placeholder="CourseCode"></input>
		<input type="text" id="coursename" placeholder="CourseName"></input>
		<input type="text" id="coursecoord" placeholder="Coordinator"></input>		
		<input type="number" id="coordid" placeholder="Coordinator_Id"></input>		
		<input type="submit" id = 'submit_btn' name="Submit"></input>
		  <ul id="namelist">   
            ${list}
            </ul>
        </div>

           <script type="text/javascript" src="/dep/addcourse.js">
        </script>
	       
	</body>


</html>

	`
	return htmltemplate ;
}







var articles = {

 'article-one' :{
	title: 'Article One | Mayank Gupta',
	heading: 'Article-One',
	date: 'Sep 5, 2017',
	content: `<p>
				This is the content of my first Article.
			</p>`	
},

												
'article-two' : {
	title: 'Article Two | Mayank Gupta',
	heading: 'Article-Two',
	date: 'Sep 5, 2017',
	content: `<p>
				This is the content of my second Article.
			</p>`	
},

												
'article-three' : {
	title: 'Article Three | Mayank Gupta',
	heading: 'Article-Three',
	date: 'Sep 5, 2017',
	content: `<p>
				This is the content of my Third Article.
			</p>`	
}
};


function createTemplate(data){
var title = data.title ;
var date = data.date ;
var heading = data.heading ;
var content = data.content;


var htmltemplate = `
<html>
<head>
    <title>
        ${title}
    </title>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link href="/ui/style.css" rel="stylesheet" />
    </head>    
   
<body>
    <div class="container">
    <div>
        <a href="/">Home</a>
    </div>
    <h3>
    	${heading}
    </h3>
    <div>
 	 	${date.toDateString()}
    </div>
    <div>
       ${content}
    </div>

    </div>
    
</body> 

</html>` ;

return htmltemplate ;
}

app.get('/', function(req, res){
 res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});



var counter = 0 ;
app.get('/counter', function(req, res){
console.log("Inside")
counter = counter + 1 
res.send(counter.toString())
});


app.get('/CSECourseNotices/:courcode', function(req, res){

if(req.session && req.session.auth && req.session.auth.userId){

var coursecode = req.params.courcode ;
console.log(coursecode);
con.query("Select Information from CSENotice where C_Code = ?",[coursecode], function(err, result){

	if(err){
		res.sendStatus(500);

	}
	else
	{
		console.log(coursecode);
		var list = '' ;
		//res.send(JSON.stringify(result)) ;
		for(var i = 0 ; i < result.length ; i++)
		{

  	list +=  '<li>'+result[i].Information+"\t"+'</li>' ;
			}
      
				res.send(createTemplate2(list, "Notices of "+coursecode));
	
	}



});


}
else
{
	console.log("You are not Logged In !!")
	return res.redirect("http://localhost:3001");


}
});



app.get('/submit-name/:name', function(req, res){
var names = [] ;


var name  = req.params.name;

names.push(name);

// JSON Javascript object Notation
res.send(JSON.stringify(names));

});

app.get('/addcourse/:ccode/:cname/:ccoord/:coordid', function(req, res){

var course = []
var ccode = req.params.ccode;
var cname = req.params.cname ;
var ccord = req.params.ccoord ;
var coorid = req.params.coordid ;

con.query('Insert into CSECources(C_Code, C_Name, C_Instructor, Instructor_Id) values(?, ?, ?, ?)',[ccode,cname,ccord,coorid],function(result,err){

 if(err){
 	res.sendStatus(500);
 	console.log("Error: "+JSON.stringify(err));

 }
 else{

 	res.send("Success");

 }

});


});

app.get('/articles/:articleName', function(req, res){

//var articles = getRequestString("articleName") ;

con.query("SELECT * FROM article WHERE title = ?",[req.params.articleName], function(err, result){

 if(err)
 {
 	res.status(500).send(err.toString());

 }
 else{
 	if(result.length === 0){
 		res.status(404).send("Article not found");
 	}
 	else{



 		

 		//res.send(JSON.stringify(result))
 		var articleData = result[0];
		res.send(createTemplate(articleData));

 	}

 }
});


});


app.get('/dep/addcse.html', function(req,res){
	if(req.session && req.session.auth && req.session.auth.userId){
 
		
var studid = req.session.auth.userId ;

con.query("SELECT Course_Code from EnrollTable where Student_ID = ?",[studid], function(err, resu){


var courses_c ;

 if(err)
 {
 	res.sendStatus(500) ;

 }
 else{
// 	console.log(resu[0].Course_Code) ;
 //	courses_c = resu;


con.query("SELECT * FROM CSECources", function(err, result){

 if(err)
 {
 	res.status(500) ;

 }
 else{
 	if(result.length === 0){
 		res.status(404);
 	}
 	else{




 	//   res.send(JSON.stringify(result));

// 	   var notices = result[0] ;
 //	   console.log(notices.Notices);

 	   var list = '' ;
 	   var a ;
 	   var EnrollSym ;
 	   for(var i = 0 ; i < result.length ; i++)
 	   {
 	
 		a = 0 ;
 	   	for(var j = 0 ; j < resu.length ; j++)
 	   	{

 	   		console.log("Outside "+resu[j].Course_Code)

 	   		if(result[i].C_Id == resu[j].Course_Code)
 	   		{
 	   			console.log(resu[j].Course_Code)
 	   			a = 1

 	   		}
 	   	}
 	   	if(a == 1){
 	   		EnrollSym = "Enrolled";
 	   	}
 	   	else
 	   	{
 	   		EnrollSym = "Enroll It" ;
 	   	}
 	   	list +=  '<li>'+result[i].C_Code+"\t"+result[i].C_Name+"\t"+result[i].C_Instructor+"\t"+ '<button type="button" onclick="Enroll(this)" id = "'+(i+1)+'">'+EnrollSym+'</button></li>' ;

 	   }
 		//res.send(JSON.stringify(result))
 	//	var articleData = result[0];
		res.send(createTemplate3(list, "Department of Computer Science and Engineering"));

 	}

 }
});

 
 	}



	

	});


}else
{

	console.log("You are not Logged In !!")
	return res.redirect("http://localhost:3001");
  
}




});

app.get('/dep/cse.html', function(req,res){
	if(req.session && req.session.auth && req.session.auth.userId){
 
		
var studid = req.session.auth.userId ;

con.query("SELECT Course_Code from EnrollTable where Student_ID = ?",[studid], function(err, resu){


var courses_c ;

 if(err)
 {
 	res.sendStatus(500) ;

 }
 else{
// 	console.log(resu[0].Course_Code) ;
 //	courses_c = resu;


con.query("SELECT * FROM CSECources", function(err, result){

 if(err)
 {
 	res.status(500) ;

 }
 else{
 	if(result.length === 0){
 		res.status(404);
 	}
 	else{




 	//   res.send(JSON.stringify(result));

// 	   var notices = result[0] ;
 //	   console.log(notices.Notices);

 	   var list = '' ;
 	   var a ;
 	   var EnrollSym ;
 	   for(var i = 0 ; i < result.length ; i++)
 	   {
 	
 		a = 0 ;
 	   	for(var j = 0 ; j < resu.length ; j++)
 	   	{

 	   		console.log("Outside "+resu[j].Course_Code)

 	   		if(result[i].C_Id == resu[j].Course_Code)
 	   		{
 	   			console.log(resu[j].Course_Code)
 	   			a = 1

 	   		}
 	   	}
 	   	if(a == 1){
 	   		EnrollSym = "Enrolled";
 	   	}
 	   	else
 	   	{
 	   		EnrollSym = "Enroll It" ;
 	   	}
 	   	list +=  '<li>'+result[i].C_Code+"\t"+result[i].C_Name+"\t"+result[i].C_Instructor+"\t"+ '<button type="button" onclick="Enroll(this)" id = '+result[i].C_Id+'>'+EnrollSym+'</button></li>' ;

 	   }
 		//res.send(JSON.stringify(result))
 	//	var articleData = result[0];
		res.send(createTemplate2(list, "Department of Computer Science and Engineering"));

 	}

 }
});

 
 	}



	

	});


}else
{

	console.log("You are not Logged In !!")
	return res.redirect("http://localhost:3001");
  
}




});



app.get('/enrolled/courses', function(req, res){

	if(req.session && req.session.auth && req.session.auth.userId){

	var studid= req.session.auth.userId ;
	var list = '' ;

	con.query("SELECT C_Code, C_Name, C_Instructor FROM CSECources WHERE C_ID IN (Select Course_Code from EnrollTable where Student_ID = ?)",[studid], function(err, result){

		if(err){
			res.sendStatus(500) ;
		}
		else
		{
			for(var i = 0 ; i < result.length ; i++)
			{
				console.log(result[i].C_Code) ;
		 	   	list +=  '<li>'+result[i].C_Code+"\t"+result[i].C_Name+"\t"+result[i].C_Instructor+"\t"+ '<button type="button" onclick="SeeNotices(this)" id = "'+result[i].C_Code+'">Notices</button></li>' ;
			}
      
				res.send(createTemplate2(list, "Courses Your Enrolled"));
	

      }



	});

}
else
{
		console.log("You are not Logged In !!")
	return res.redirect("http://localhost:3001");

}

});





app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/csa.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'csa.jpg'));
});




app.get('/ui/profile.html', function(req, res){

 res.sendFile(path.join(__dirname, 'ui', 'profile.html'))
});

app.get('/ui/Department.html', function(req, res){


if(req.session && req.session.auth && req.session.auth.userId){
 
 res.sendFile(path.join(__dirname, 'ui', 'Department.html')) ;

}else
{

	console.log("You are not Logged In !!")
	return res.redirect("http://localhost:3001");
  
}

});

app.get('/ui/teach_dep.html', function(req, res){


if(req.session && req.session.auth && req.session.auth.userId){
 
 res.sendFile(path.join(__dirname, 'ui', 'teach_dep.html')) ;

}else
{

	console.log("You are not Logged In !!")
	return res.redirect("http://localhost:3001");
  
}

});

app.get('/stud_login.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'stud_login.html'));
});

app.get('/teacher_login.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'teacher_login.html'));
});


app.get('/ui/counter.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'counter.js'));
});

app.get('/ui/main.js', function (req, res) {

  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/dep/addcourse.js', function (req, res) {

  res.sendFile(path.join(__dirname, 'dep', 'addcourse.js'));
});

app.get('/ui/teachmain.js', function (req, res) {

  res.sendFile(path.join(__dirname, 'ui', 'teachmain.js'));
});


app.get('/dep/enroll.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'dep', 'enroll.js'));
});


var port = 3001
app.listen(3001, function(req, res){
console.log('App listening on port'+port+'!');

});