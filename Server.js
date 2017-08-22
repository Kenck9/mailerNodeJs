var express=require('express');
var nodemailer = require("nodemailer");
var keys = require('./config/keys');
var app=express();

/*
	Here we are configuring our SMTP Server details.
	STMP is mail server which is responsible for sending and recieving email.
*/

var smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: keys.user,
        pass: keys.pass
    },
    tls: {rejectUnauthorized: false},
    debug:true
});


/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/

app.get('/',function(req,res){
	res.sendfile('index.html');
});
app.get('/send',function(req,res){
  var dtt = timeStamp();
	var mailOptions={
    sender: "no-reply@appiloqueTestServer.com",
		to : keys.user ,
		subject : 'Sub: '+ req.query.subject + ' (' + dtt +')',
		text : 'Client Email: '+ req.query.to + '\n' + 'Client Message: ' + req.query.text + '\nTimeStamp: ' + dtt
	}
	console.log(mailOptions);
	smtpTransport.sendMail(mailOptions, function(error, response){
   	 if(error){
        	console.log(error);
		res.end("error");
	 }else{
        	console.log("Message sent: " + response.message);
		res.end("sent");
    	 }
});
});

/*--------------------Routing Over----------------------------*/
const PORT = process.env.PORT || 3000;
app.listen(PORT , function(){
	console.log("Express Started on "+ PORT);
});


/*--------------------TimeStamp----------------------------*/
function timeStamp() {
// Create a date object with the current time
  var now = new Date();
// Create an array with the current month, day and time
  var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
// Create an array with the current hour, minute and second
  var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
// Determine AM or PM suffix based on the hour
  var suffix = ( time[0] < 12 ) ? "AM" : "PM";
// Convert hour from military time
  time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
// If hour is 0, set it to 12
  time[0] = time[0] || 12;
// If seconds and minutes are less than 10, add a zero
  for ( var i = 1; i < 3; i++ ) {
    if ( time[i] < 10 ) {
      time[i] = "0" + time[i];
    }
  }
// Return the formatted string
  return date.join("/") + " " + time.join(":") + " " + suffix;
}
